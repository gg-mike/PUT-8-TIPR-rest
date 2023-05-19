import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { addValidator, pageCollection, userAuthValidator } from "./utils.js";

/* COLLECTION */

export const all = async (req, res) => {
  let results = await pageCollection(req, User);
  if (req.authUser && req.authUser.isAdmin)
    return res.status(200).json(results);
  results.docs.forEach(doc => { return { _id: doc._id, name: doc.name, characters: doc.characters } });
  res.status(200).json({ ...results });
}

export const add = async (req, res) => {
  const results = await addValidator(req.query.token, res, User);
  if (!results.valid) return results.res;

  await User.insertOne({ _id: results.id, ...req.body, password: await bcrypt.hash(req.body.password, 12) });
  
  res.status(201).send("Created user");
}

/* ELEMENT */

export const info = async (req, res) => {
  const { uid } = req.params;

  if ((await User.countDocuments({ _id: uid})) === 0)
    return res.status(404).send("User with this id does not exist");
  if (req.authUser && (req.authUser.uid === uid || req.authUser.isAdmin))
    return res.status(200).json(await User.findById(uid));
  
  res.status(200).json(await User.findById(uid).select(["_id", "name", "characters"]));
}

export const replace = async (req, res) => {
  const { uid } = req.params;
  const results = userAuthValidator(uid, req.authUser, res);
  if (!results.valid) return results.res;
  
  res.status(501).send("Endpoint not implemented");
}

export const update = async (req, res) => {
  const { uid } = req.params;
  const results = userAuthValidator(uid, req.authUser, res);
  if (!results.valid) return results.res;

  res.status(501).send("Endpoint not implemented");
}

export const remove = async (req, res) => {
  const { uid } = req.params;
  const results = userAuthValidator(uid, req.authUser, res);
  if (!results.valid) return results.res;
  
  res.status(501).send("Endpoint not implemented");
}

/* CHARACTER COLLECTION */

export const allCharacters = async (req, res) => {
  const { uid } = req.params;
  
  if ((await User.countDocuments({ _id: uid})) === 0)
    return res.status(404).send("User with this id does not exist");

  let results = await pageCollection(req, User, { _id: uid }, { _id: 0, characters: 1 });
  res.status(200).json({ ...results, docs: results.docs.map(doc => doc.characters)[0] });
}

export const addCharacter = async (req, res) => {
  const { uid } = req.params;
  const results = userAuthValidator(uid, req.authUser, res);
  if (!results.valid) return results.res;

  res.status(501).send("Endpoint not implemented");
}

/* CHARACTER ELEMENT */

export const infoCharacter = async (req, res) => {
  const { uid, cid } = req.params;
  
  res.status(501).send("Endpoint not implemented");
}

export const replaceCharacter = async (req, res) => {
  const { uid, cid } = req.params;
  const results = userAuthValidator(uid, req.authUser, res);
  if (!results.valid) return results.res;
  
  res.status(501).send("Endpoint not implemented");
}

export const updateCharacter = async (req, res) => {
  const { uid, cid } = req.params;
  const results = userAuthValidator(uid, req.authUser, res);
  if (!results.valid) return results.res;
  
  res.status(501).send("Endpoint not implemented");
}

export const removeCharacter = async (req, res) => {
  const { uid, cid } = req.params;
  const results = userAuthValidator(uid, req.authUser, res);
  if (!results.valid) return results.res;
  
  res.status(501).send("Endpoint not implemented");
}
