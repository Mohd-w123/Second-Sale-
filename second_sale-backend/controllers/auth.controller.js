import bcrypt from 'bcryptjs';
import User from '../models/User.js';
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

    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    res.json({
      message: 'OTP sent successfully (Dummy OTP enabled: enter 123456)',
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
    if (!finalOtp) {
      return res.status(400).json({ message: 'OTP verification code is required' });
    }

    // Dummy OTP support: accept 123456, 1234, 000000, or any 4-to-6 digit code in development/testing
    if (!/^\d{4,6}$/.test(finalOtp)) {
      return res.status(400).json({ message: 'Invalid OTP format. Please enter a 4 or 6-digit OTP (e.g. 123456)' });
    }

    // Find or create user by original phone number
    let user = await User.findOne({ phone: cleanPhone });
    let isNewUser = false;

    if (!user) {
      user = await User.create({
        phone: cleanPhone,
        name: 'User',
      });
      isNewUser = true;
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
