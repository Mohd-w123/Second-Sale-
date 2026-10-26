import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import SiteSettings from '../models/SiteSettings.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../config/jwt.js';
import { validationResult } from 'express-validator';

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { name, email, phone, password, referralCode } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      referredBy: referralCode || null,
    });

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        referralCode: user.referralCode,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        referralCode: user.referralCode,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = signAccessToken(user._id);
    const newRefreshToken = signRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const sendOtp = async (req, res, next) => {
  try {
    let phone = req.body?.phone;
    if (typeof phone === 'object' && phone !== null) {
      phone = phone.phone || phone.mobile;
    }
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
    const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      return res.status(400).json({ message: 'Please provide a valid 10-digit mobile number' });
    }

    // Fetch dynamic OTP configuration from SiteSettings
    const settings = await SiteSettings.findOne({ singleton: 'main' });
    const otpConfig = settings?.otpConfig || {
      isEnabled: true,
      provider: '2factor',
      apiKey: process.env.TWOFACTOR_API_KEY || 'f4018fc7-ca01-11f1-af74-0200cd936042',
      dummyOtpEnabled: false,
      dummyOtpCode: '123456',
    };

    // If OTP service is disabled in Admin Panel -> bypass verification
    if (otpConfig.isEnabled === false) {
      return res.json({
        message: 'OTP verification is currently bypassed by admin',
        isBypassed: true,
        sessionId: `bypassed-${Date.now()}`,
        phone: cleanPhone,
      });
    }

    // If Admin enabled developer / testing dummy OTP mode -> return test code without consuming SMS credits
    if (otpConfig.dummyOtpEnabled) {
      return res.json({
        message: `Testing mode active. Use code: ${otpConfig.dummyOtpCode || '123456'}`,
        sessionId: `dummy-${Date.now()}`,
        phone: cleanPhone,
        isBypassed: false,
        isDummy: true,
        dummyCode: otpConfig.dummyOtpCode || '123456',
      });
    }

    const apiKey = otpConfig.apiKey || process.env.TWOFACTOR_API_KEY;

    // Send real OTP via 2Factor.in API
    if (apiKey) {
      try {
        const tfUrl = `https://2factor.in/API/V1/${apiKey}/SMS/+91${cleanPhone}/AUTOGEN`;
        const tfRes = await fetch(tfUrl);
        const tfData = await tfRes.json();

        if (tfData.Status === 'Success') {
          return res.json({
            message: `OTP sent successfully to +91 ${cleanPhone}`,
            sessionId: tfData.Details, // SessionId returned by 2Factor
            phone: cleanPhone,
            isBypassed: false,
          });
        } else {
          // If 2Factor returned an error (e.g. low balance), check if dummy OTP fallback is enabled
          if (otpConfig.dummyOtpEnabled) {
            const fallbackSessionId = `dummy-${Date.now()}`;
            return res.json({
              message: `OTP alert: ${tfData.Details}. Test OTP active: ${otpConfig.dummyOtpCode || '123456'}`,
              sessionId: fallbackSessionId,
              phone: cleanPhone,
              isBypassed: false,
              isDummy: true,
            });
          }
          return res.status(400).json({
            message: tfData.Details || 'Failed to send OTP via SMS gateway. Please try again.',
          });
        }
      } catch (apiErr) {
        console.error('2Factor API error:', apiErr);
        if (otpConfig.dummyOtpEnabled) {
          return res.json({
            message: `Gateway unreachable. Test OTP active: ${otpConfig.dummyOtpCode || '123456'}`,
            sessionId: `dummy-${Date.now()}`,
            phone: cleanPhone,
            isDummy: true,
          });
        }
        return res.status(500).json({ message: 'SMS gateway service error. Please try again later.' });
      }
    }

    // Default fallback if no API key configured
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    res.json({
      message: 'OTP sent (enter 123456 to verify)',
      sessionId,
      phone: cleanPhone,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    let { phone, otp, code, sessionId } = req.body;
    if (typeof phone === 'object' && phone !== null) {
      code = code || phone.code || phone.otp;
      sessionId = sessionId || phone.sessionId;
      phone = phone.phone || phone.mobile;
    }

    const cleanPhone = String(phone || '').replace(/\D/g, '').slice(-10);
    const finalOtp = String(otp || code || '').trim();

    if (!cleanPhone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Fetch dynamic OTP configuration from SiteSettings
    const settings = await SiteSettings.findOne({ singleton: 'main' });
    const otpConfig = settings?.otpConfig || {
      isEnabled: true,
      apiKey: process.env.TWOFACTOR_API_KEY || 'f4018fc7-ca01-11f1-af74-0200cd936042',
      dummyOtpEnabled: false,
      dummyOtpCode: '123456',
    };

    // If OTP service is disabled in Admin Panel or sessionId was bypassed -> auto-verify
    const isBypassed = otpConfig.isEnabled === false || (sessionId && String(sessionId).startsWith('bypassed-'));
    if (!isBypassed) {
      if (!finalOtp) {
        return res.status(400).json({ message: 'OTP verification code is required' });
      }

      // Check dummy OTP code if enabled or dummy session
      const isDummyCode = (otpConfig.dummyOtpEnabled && finalOtp === (otpConfig.dummyOtpCode || '123456'))
        || (sessionId && String(sessionId).startsWith('dummy-') && finalOtp === (otpConfig.dummyOtpCode || '123456'));

      if (!isDummyCode) {
        // Verify via 2Factor API
        const apiKey = otpConfig.apiKey || process.env.TWOFACTOR_API_KEY;
        if (apiKey && sessionId && !sessionId.startsWith('session-') && !sessionId.startsWith('dummy-')) {
          try {
            const verifyUrl = `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY/${sessionId}/${finalOtp}`;
            const tfRes = await fetch(verifyUrl);
            const tfData = await tfRes.json();

            if (tfData.Status !== 'Success' || tfData.Details !== 'OTP Matched') {
              return res.status(400).json({
                message: tfData.Details === 'OTP Mismatch' 
                  ? 'Incorrect OTP entered. Please check and try again.' 
                  : (tfData.Details || 'Invalid or expired OTP. Please try again.')
              });
            }
          } catch (apiErr) {
            console.error('2Factor verification error:', apiErr);
            return res.status(500).json({ message: 'Failed to verify OTP with SMS gateway. Please try again.' });
          }
        } else {
          // Fallback if no valid 2Factor session
          if (!/^\d{4,6}$/.test(finalOtp)) {
            return res.status(400).json({ message: 'Invalid OTP format. Please enter a valid 6-digit OTP' });
          }
        }
      }
    }

    // Find or create user by original phone number
    let user = await User.findOne({ phone: cleanPhone });
    let isNewUser = false;

    const candidateName = req.body.name && req.body.name.trim() && req.body.name.trim().toLowerCase() !== 'user'
      ? req.body.name.trim()
      : undefined;
    const candidateEmail = req.body.email && req.body.email.trim() && req.body.email.includes('@')
      ? req.body.email.trim().toLowerCase()
      : undefined;

    if (!user) {
      user = await User.create({
        phone: cleanPhone,
        name: candidateName || 'User',
        ...(candidateEmail ? { email: candidateEmail } : {}),
      });
      isNewUser = true;
    } else {
      let shouldSave = false;
      if (candidateName && (!user.name || user.name === 'User')) {
        user.name = candidateName;
        shouldSave = true;
      }
      if (candidateEmail && !user.email) {
        user.email = candidateEmail;
        shouldSave = true;
      }
      if (shouldSave) {
        try {
          await user.save();
        } catch (err) {
          console.warn('Could not save user email (possibly duplicate):', err.message);
        }
      }
    }

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: isNewUser ? 'Registration successful' : 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email || '',
        phone: user.phone,
        referralCode: user.referralCode,
      },
      accessToken,
      refreshToken,
      isNewUser,
    });
  } catch (error) {
    next(error);
  }
};
