const jwtMiddleware = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ msg: "No token provided" });

  const token = header.split(" ")[1];

  jwtMiddleware.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Invalid token" });
    req.user = decoded;
    next();
  });
};
