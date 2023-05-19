import { Schema, model } from "mongoose";

const campaignSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  dm: {
    type: String,
    required: true,
  },
  characters: {
    type: [String],
    required: true,
    default: [],
  },
  fallen: {
    type: [String],
    required: true,
    default: [],
  }
}, { timestamps: true });

const Campaign = model("Campaign", campaignSchema);

export default Campaign;
