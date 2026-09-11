import mongoose from 'mongoose';

const adminUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    enum: ['admin', 'sales'],
    default: 'sales',
  },
  permissions: {
    type: [String],
    default: ['orders'],
    // Allowed values: 'dashboard', 'orders', 'partners', 'users', 'devices', 'refurbished', 'categories', 'pincodes', 'homepage', 'pages', 'site-settings'
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

const AdminUser = mongoose.model('AdminUser', adminUserSchema);
export default AdminUser;
