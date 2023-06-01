import Campaign from "../models/campaign.model.js";
import User from "../models/user.model.js";
import { documentMissing, getCharacter, pageCollection } from "../utils/collection.js";
import { bodyValidator } from "../utils/validators.js";

/* COLLECTION */

export const all = async (req, res) => {
  let page = await pageCollection(req, Campaign);
  res.status(200).json({ ...page });
}

export const add = async (req, res) => {
  await Campaign.insertMany([{ _id: req.newId, ...req.body }]);
  res.status(201).send("Created campaign (" + req.newId + ")");
}

/* ELEMENT */

export const info = async (req, res) => {
  res.status(200).json(await Campaign.findById(req.params.rid));
}

export const replace = async (req, res) => {
  const { rid } = req.params;
  const { status, message } = bodyValidator(req.body, { dm: "String", name: "String", "characters": "Array", fallen: "Array" });
  if (status) return res.status(status).send(message);

  if (await documentMissing(User, { "_id": req.body.dm }))
    return res.status(404).send("User with this id does not exist (DM)");

  for await (const id of req.body.characters) {
    if (await documentMissing(User, { "characters._id": id }))
      return res.status(404).send("Character with this id (" + id + ") does not exist");
    let c1 = await Campaign.findOne({ "characters": id });
    if (c1._id !== rid)
      return res.status(400).send("Character with this id (" + id + ") already used for different campaign (" + c1._id + ")");
    let c2 = await Campaign.findOne({ "fallen": id });
    if (c2._id !== rid)
      return res.status(400).send("Character with this id (" + id + ") already used for different campaign (" + c2._id + ")");
  }

  for await (const id of req.body.fallen) {
    if (await documentMissing(User, { "characters._id": id }))
      return res.status(404).send("Fallen character with this id (" + id + ") does not exist");
    let c1 = await Campaign.findOne({ "characters": id });
    if (c1._id !== rid)
      return res.status(400).send("Character with this id (" + id + ") already used for different campaign (" + c1._id + ")");
    let c2 = await Campaign.findOne({ "fallen": id });
    if (c2._id !== rid)
      return res.status(400).send("Character with this id (" + id + ") already used for different campaign (" + c2._id + ")");
  }

  await Campaign.updateOne({ _id: rid }, { ...req.body });
  
  res.status(200).send("Replaced campaign");
}

export const update = async (req, res) => {
  const { rid } = req.params;
  const { status, message } = bodyValidator(req.body, { dm: "String" });
  if (status) return res.status(status).send(message);

  if (await documentMissing(User, { "_id": req.body.dm }))
    return res.status(404).send("User with this id does not exist (DM)");

    await Campaign.updateOne({ _id: rid }, { dm: req.body.dm });
  
  res.status(200).send("Updated campaign");
}

export const remove = async (req, res) => {
  await Campaign.findByIdAndDelete(req.params.rid);
  return res.status(200).send("Removed campaign");
}

/* CHARACTER COLLECTION */

export const allCharacters = async (req, res) => {
  const characters = (await Campaign.findById(req.params.rid).select("characters")).characters;
  res.status(200).send(await Promise.all(characters.map(async (sid) => await getCharacter(sid))));
}

export const addCharacter = async (req, res) => {
  const { rid } = req.params;
  await Promise.all(req.body.ids.map(async (sid) => {
    if (await Campaign.findOne({ _id: rid, "characters": sid }))
      return res.status(400).send(`Character (${sid}) is already in characters for this campaign`);
    if (await Campaign.findOne({ _id: rid, "fallen": sid }))
      return res.status(400).send(`Character (${sid}) is already in fallen characters for this campaign`);
    await Campaign.findByIdAndUpdate(rid, { $push: { characters: sid }});  
  }));

  res.status(200).send(`Added ${req.body.characters.length} characters`);
}

/* CHARACTER ELEMENT */

export const infoCharacter = async (req, res) => {
  res.status(200).json(await getCharacter(req.params.sid));
}

export const redirect = async (req, res) => {
  const user = await User.findOne({ "characters._id": req.params.sid });
  res.redirect(307, `/users/${user._id}/characters/${req.params.sid}`);
}

export const kill = async (req, res) => {
  const { rid, sid } = req.params;
  await Campaign.findByIdAndUpdate(rid, { $pull: { characters: sid }, $push: { fallen: sid }});
  res.status(200).send("Killed character");
}

/* FALLEN COLLECTION */

export const allFallen = async (req, res) => {
  const fallen = (await Campaign.findById(req.params.rid).select("fallen")).fallen;
  res.status(200).send(await Promise.all(fallen.map(async (sid) => await getCharacter(sid))));
}

export const addFallen = async (req, res) => {
  const { rid } = req.params;
  await Promise.all(req.body.ids.map(async (sid) => {
    if (await Campaign.findOne({ _id: rid, "characters": sid }))
      return res.status(400).send(`Character (${sid}) is already in characters for this campaign`);
    if (await Campaign.findOne({ _id: rid, "fallen": sid }))
      return res.status(400).send(`Character (${sid}) is already in fallen characters for this campaign`);
    await Campaign.findByIdAndUpdate(rid, { $push: { fallen: sid }});  
  }));

  res.status(200).send(`Added ${req.body.characters.length} fallen characters`);
}

/* FALLEN ELEMENT */

export const resurrect = async (req, res) => {
  const { rid, sid } = req.params;
  await Campaign.findByIdAndUpdate(rid, { $pull: { fallen: sid }, $push: { characters: sid }});
  res.status(200).send("Resurrected character");
}
