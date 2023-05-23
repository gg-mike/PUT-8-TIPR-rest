import etag from "etag";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const wrapper = async (req, res, callback) => {
  try {
    await callback(req, res);
  } catch (err) {
    res.status(500).send(`[ERROR] ${err.message}`);
  }
}

export const addValidator = async (token, collection) => {
  const id = jwt.verify(token, process.env.SECRET_KEY)?._id;
  if (!id)
    return { status: 400, message: "Provided token is invalid"};
  const doc = await collection.findById(id);
  if (doc)
    return { status: 400, message: "Provided token was already used" };
  return { id };
}

export const userAuthValidator = (uid, authUser) => {
  if (!authUser)
    return { status: 401, message: "Unauthenticated" };
  else if (authUser.id !== uid && !authUser.isAdmin)
    return { status: 403, message: "Forbidden"};
  return {};
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

export const validEtag = (req, data) => {
  if (req.headers["if-match"] === undefined)
    return { status: 400, message: "Missing attribute 'if-match'" };
  if (req.headers["if-match"] !== etag(Buffer.from(JSON.stringify(data)), { weak: true }))
    return { status: 412, message: "Attempted to work on old version of the document" };
  return {};
}

export const getCharacter = async (req, uid, cid, ifMatch = false) => {
  if ((await User.countDocuments({ _id: uid})) === 0)
    return { status: 404, message: "User with this id does not exist" };

  let result = await User.findById(uid, { characters: 1 });
  result = result.characters.filter(doc => doc._id == cid);

  if (result.length == 0)
    return { status: 404, message: "Character with this id does not exist" };
  
  if (ifMatch) {
    const { status, message } = validEtag(req, result[0]);
    if (status != 200)
      return { status, message };
  }

  return { character: result[0] };
}