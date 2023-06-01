import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Campaign from "../models/campaign.model.js";
import { getCharacter, pageCollection } from "../utils/collection.js";

/* COLLECTION */

export const all = async (req, res) => {
  let page = await pageCollection(req, User);
  if (req.authUser && req.authUser.isAdmin)
    return res.status(200).json(page);
  page.docs.forEach(doc => { return { _id: doc._id, name: doc.name, characters: doc.characters } });
  res.status(200).json({ ...page });
}

export const add = async (req, res) => {
  await User.insertMany([{ _id: req.newId, ...req.body, password: await bcrypt.hash(req.body.password, 12) }]);
  res.status(201).send("Created user (" + req.newId + ")");
}

/* ELEMENT */

export const info = async (req, res) => {
  const { rid } = req.params;

  if (req.authUser && (req.authUser.id === rid || req.authUser.isAdmin))
    return res.status(200).json(await User.findById(rid));
  
  res.status(200).json(await User.findById(rid).select(["_id", "name", "characters"]));
}

export const replace = async (req, res) => {
  const { rid } = req.params;
  const { name, login, password, isAdmin, characters } = req.body;

  if (characters !== undefined)
    return res.status(400).send("To change characters use '/users/:rid/characters' endpoints");  
  if (!password)
    return res.status(400).send("Password cannot be empty");
  if (!req.authUser.isAdmin && isAdmin) 
    return res.status(400).send("Regular user cannot change admin status");

  const user = await User.findById(rid);
  if (user.login === "root" && !isAdmin)
    return res.status(400).send("Root user cannot lose admin privileges");
  if (user.login === "root" && login !== "root")
    return res.status(400).send("Root user cannot have different login");

  await User.updateOne({ _id: rid }, { "$set": { ...req.body, password: await bcrypt.hash(password, 12) }})
  
  res.status(200).send("Replaced user");
}

export const update = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  
  if (!(await bcrypt.compare(oldPassword, (await User.findById(rid).select("password")).password))) 
    return res.status(400).send("Invalid old password");
  
  await User.updateOne({ _id: req.params.rid }, { password: await bcrypt.hash(newPassword, 12) });

  res.status(200).send("Changed user password");
}

export const remove = async (req, res) => {
  const { rid } = req.params;

  const user = await User.findById(rid);

  if (user.login === "root")
    return res.status(400).send("Root user cannot be removed");

  if (!user.characters.length)
    await User.findByIdAndDelete(rid);

  const { force } = req.query;
  const characters = user.characters.map(elem => elem._id);

  if(await Campaign.countDocuments({ characters: { $in: characters } }) && force === undefined)
    return res.status(409).send("User characters are used in campaign (use 'force' query param to remove anyway)");

  await Campaign.updateMany({ characters: { $in: characters } }, { $pull: { characters: { $in: characters } }});
  await User.findByIdAndDelete(rid);

  return res.status(200).send("Removed user");
}

/* CHARACTER COLLECTION */

export const allCharacters = async (req, res) => {
  let page = await pageCollection(req, User, { _id: req.params.rid }, { _id: 0, characters: 1 });
  res.status(200).json({ ...page, docs: page.docs.map(doc => doc.characters)[0] });
}

export const addCharacter = async (req, res) => {
  await User.findByIdAndUpdate(req.params.rid, { $push: { characters: { _id: req.newId, ...req.body }}});
  res.status(200).send("Added character (" + req.newId + ")");
}

/* CHARACTER ELEMENT */

export const infoCharacter = async (req, res) => {
  res.status(200).json(await getCharacter(req.params.sid));
}

export const replaceCharacter = async (req, res) => {
  await User.updateOne({ "characters._id": req.params.sid }, { "$set": { 
    "characters.$.name": req.body.name,
    "characters.$.className": req.body.className,
    "characters.$.race": req.body.race,
    "characters.$.level": req.body.level,
    "characters.$.hitPoints": req.body.hitPoints
  }})
  res.status(200).send("Replaced character");
}

export const updateCharacter = async (req, res) => {
  await User.findOneAndUpdate({ "characters._id": req.params.sid }, { $set: { "characters.$.hitPoints": req.body.hitPoints }});
  res.status(200).send("Updated character");
}

export const removeCharacter = async (req, res) => {
  const { rid, sid } = req.params;
  const { force } = req.query;

  if(await Campaign.countDocuments({ characters: sid }) && force === undefined)
    return res.status(409).send("Character is used in campaign (use 'force' query param to remove anyway)");

  await Campaign.findOneAndUpdate({ characters: sid }, { $pull: { characters: sid }});
  await User.findByIdAndUpdate(rid, { $pull: { "characters": { _id: sid }}});

  res.status(200).send("Removed character");
}

export const transferCharacters = async (req, res) => {
  const { rid } = req.params;
  const { dest, ids } = req.body;
  let characters = []

  for await (const id of ids) {
    if (!(await User.countDocuments({ _id: rid, "characters._id": id })))
      return res.status(400).send(`User doesn't have character with id '${id}'`);
    characters.push(await getCharacter(id));
  }

  await User.findByIdAndUpdate(rid, { $pull: { "characters": { "_id": { $in: ids }}}});
  await User.findByIdAndUpdate(dest, { $push: { "characters": { $each: characters} }});

  res.status(200).send("Transferred " + (ids.length > 1 ? "characters" : "character"));
}
