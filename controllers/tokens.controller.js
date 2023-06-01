import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import { bodyValidator } from "../utils/validators.js";

export const generateToken = async (req, res) => {
  const { type } = req.query;

  if (!type)
    return res.status(400).send("Missing query param 'type'");

  switch (type) {
    case "auth":
      return generateAuthToken(req.body, res);
    case "post":
      return generatePostToken(res);
    default:
      return res.status(400).send(`Unknown type value of '${type}'`);
  }
}

const generateAuthToken = async (body, res) => {
  try {
    const { status, message } = bodyValidator(body, { login: "String", password: "String" });
    if (status) return res.status(400).send(message);

    const user = await User.findOne({ login: body.login });
    if (!user) return res.status(404).send("User doesn't exist");

    const passwordMatch = await bcrypt.compare(body.password, user.password);
    if (!passwordMatch) return res.status(400).send("Invalid credentials");

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.SECRET_KEY, { expiresIn: "2h" });
    res.status(200).json({ token });  
  } catch (err) {
    res.status(500).send(`[ERROR] auth token (${err.message})`);
  }
}

const generatePostToken = async (res) => {
  try {
    const token = jwt.sign({ _id: new mongoose.Types.ObjectId() }, process.env.SECRET_KEY, { expiresIn: 120 });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).send(`[ERROR] post-token (${err.message})`);
  }
}
