import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { addValidator, getCharacter, pageCollection, userAuthValidator } from "./utils.js";

/* COLLECTION */

export const all = async (req, res) => {
  let page = await pageCollection(req, User);
  if (req.authUser && req.authUser.isAdmin)
    return res.status(200).json(page);
    page.docs.forEach(doc => { return { _id: doc._id, name: doc.name, characters: doc.characters } });
  res.status(200).json({ ...page });
}

export const add = async (req, res) => {
  const { id, status, message } = await addValidator(req.query.token, User);
  if (status) return res.status(status).send(message);

  await User.insertOne({ _id: id, ...req.body, password: await bcrypt.hash(req.body.password, 12) });
  
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
  const { status, message } = userAuthValidator(uid, req.authUser);
  if (status) return res.status(status).send(message);
  
  res.status(501).send("Endpoint not implemented");
}

export const update = async (req, res) => {
  const { uid } = req.params;
  const { status, message } = userAuthValidator(uid, req.authUser);
  if (status) return res.status(status).send(message);

  res.status(501).send("Endpoint not implemented");
}

export const remove = async (req, res) => {
  const { uid } = req.params;
  const { status, message } = userAuthValidator(uid, req.authUser);
  if (status) return res.status(status).send(message);
  
  res.status(501).send("Endpoint not implemented");
}

/* CHARACTER COLLECTION */

export const allCharacters = async (req, res) => {
  const { uid } = req.params;
  
  if ((await User.countDocuments({ _id: uid})) === 0)
    return res.status(404).send("User with this id does not exist");

  let page = await pageCollection(req, User, { _id: uid }, { _id: 0, characters: 1 });
  res.status(200).json({ ...page, docs: page.docs.map(doc => doc.characters)[0] });
}

export const addCharacter = async (req, res) => {
  const { uid } = req.params;
  const { status, message } = userAuthValidator(uid, req.authUser);
  if (status) return res.status(status).send(message);

  res.status(501).send("Endpoint not implemented");
}

/* CHARACTER ELEMENT */

export const infoCharacter = async (req, res) => {
  const { uid, cid } = req.params;
  
  const { character, status, message } = await getCharacter(req, uid, cid);
  if (character === undefined)
    return res.status(status).send(message);

  res.status(200).json(character);
}

export const replaceCharacter = async (req, res) => {
  const { uid, cid } = req.params;
  {
    const { status, message } = userAuthValidator(uid, req.authUser);
    if (status) return res.status(status).send(message);
  }

  const { character, status, message } = await getCharacter(req, uid, cid, true);
  if (character === undefined)
    return res.status(status).send(message);

  console.log(character);
  
  res.status(501).send("Endpoint not implemented");
}

export const updateCharacter = async (req, res) => {
  const { uid, cid } = req.params;
  {
    const { status, message } = userAuthValidator(uid, req.authUser);
    if (status) return res.status(status).send(message);
  }

  const { character, status, message } = await getCharacter(req, uid, cid, true);
  if (character === undefined)
    return res.status(status).send(message);

  console.log(character);
  
  res.status(501).send("Endpoint not implemented");
}

export const removeCharacter = async (req, res) => {
  const { uid, cid } = req.params;
  const { status, message } = userAuthValidator(uid, req.authUser);
  if (status) return res.status(status).send(message);

  // TODO: Admin user cannot be deleted

  res.status(501).send("Endpoint not implemented");
}
