import Campaign from "../models/campaign.model.js";
import User from "../models/user.model.js";

export const documentMissing = async (collection, filter) => {
  try {
    return await collection.countDocuments(filter) === 0;
  } catch (err) {
    return true;
  }
}

export const getCharacter = async (rid) => {
  return (await User.findOne({ "characters._id": rid })).characters.filter(doc => doc._id == rid)[0];
}

export const pageCollection = async (req, collection, filter={}, projection={}) => {
  let { page } = req.query;
  page = page ? page : 0;
  const nextPage = 5 + page * 5 <= await collection.countDocuments(filter);
  return { 
    "next-page": nextPage, 
    "docs": await collection.find(filter, projection).skip(page * 5).limit(5).sort({ name: "asc" })
  };
}

export const getDm = async (rid) => {
  return (await Campaign.findById(rid).select("dm"));
}

