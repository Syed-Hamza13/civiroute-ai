const checkRole = (rolesArray) => {
  return (req, res, next) => {
    if (!req.session || !rolesArray.includes(req.session.role)) {
      return res.status(403).json({ 
        message: `Access denied. Requires one of these roles: ${rolesArray.join(', ')}` 
      });
    }
    next();
  };
};

module.exports = { checkRole }; 