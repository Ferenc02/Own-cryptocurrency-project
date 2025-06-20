import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  console.log("Token:", token);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return res.status(200).json({ message: "Token is valid", user: decoded });
  } catch (error) {
    return res.status(400).json({ message: "Invalid token" });
  }
};
