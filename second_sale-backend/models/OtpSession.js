import mongoose from 'mongoose';

const otpSessionSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, index: true },
    sessionId: { type: String, index: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true }
);

export default mongoose.models.OtpSession || mongoose.model('OtpSession', otpSessionSchema);

