import jwt from "jsonwebtoken";
import "dotenv/config";

const auth = async (req, _, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      if (token) req.authUser = jwt.verify(token, process.env.SECRET_KEY);
    }
  } catch (err) {
    console.warn(`[WARN ] auth service => ${err.message}`);
  }

  next();
};

export default auth;
