import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Admin access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Forbidden. Admin access only.' });
    }

    req.admin = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name || 'Admin',
      role: decoded.role || (decoded.isAdmin ? 'superadmin' : 'sales'),
      permissions: decoded.permissions || ['*'],
    };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Admin token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ message: 'Invalid admin token' });
  }
};

export const requirePermission = (permissionKey) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { role, permissions } = req.admin;
    if (role === 'superadmin' || permissions?.includes('*') || permissions?.includes(permissionKey)) {
      return next();
    }
    return res.status(403).json({
      message: `Access denied. You do not have permission to access ${permissionKey}.`,
    });
  };
};

export default adminAuth;
