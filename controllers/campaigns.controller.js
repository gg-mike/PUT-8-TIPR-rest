import Campaign from "../models/campaign.model.js";
import User from "../models/user.model.js";
import { getCharacter, pageCollection } from "../utils/collection.js";

/* COLLECTION */

export const all = async (req, res) => {
  let page = await pageCollection(req, Campaign);
  res.status(200).json({ ...page });
}

export const add = async (req, res) => {
  await Campaign.insertOne({ _id: req.newId, ...req.body });
  res.status(201).send("Created campaign");
}

/* ELEMENT */

export const info = async (req, res) => {
  res.status(200).json(await Campaign.findById(req.params.rid));
}

export const replace = async (req, res) => {
  const { rid } = req.params;
  
  res.status(501).send("Endpoint not implemented");
}

export const update = async (req, res) => {
  const { rid } = req.params;
  
  res.status(501).send("Endpoint not implemented");
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
