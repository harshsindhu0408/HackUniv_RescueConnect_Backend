import jwt from "jsonwebtoken";
import agency from "../models/agency.js";

// Authenticating Agency using Bearer token
export const requireSignIn = async (req, res, next) => {

  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    // Decoding JWT
    const decoded = jwt.verify(token, process.env.JWT_SECERT);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
