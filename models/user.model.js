import { Schema, model } from "mongoose";

const characterSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  className: {
    type: String,
    required: true,
  },
  race: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
    default: 1,
  },
  hitPoints: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  characters: {
    type: [characterSchema],
    required: true,
    default: [],
  },
  login: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
}, { timestamps: true });

const User = model("User", userSchema);

export default User;
