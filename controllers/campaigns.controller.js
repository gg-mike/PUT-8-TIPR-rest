import Campaign from "../models/campaign.model.js";
import { addValidator, pageCollection, userAuthValidator } from "./utils.js";

/* COLLECTION */

export const all = async (req, res) => {
  let results = await pageCollection(req, Campaign);
  res.status(200).json({ ...results });
}

export const add = async (req, res) => {
  const addResults = await addValidator(req.query.token, res, Campaign);
  const authResults = userAuthValidator(req.dm, req.authUser, res);
  if (!addResults.valid) return addResults.res;

  if ((await Campaign.countDocuments({ _id: req.dm })) === 0)
    return res.status(404).send("User with DM id does not exist");
  if (!authResults.valid) return authResults.res;

  await Campaign.insertOne({ _id: addResults.id, dm: req.dm });
  
  res.status(201).send("Created campaign");
}

/* ELEMENT */

export const info = async (req, res) => {
  const { cid } = req.params;
  
  res.status(501).send("Endpoint not implemented");
}

export const replace = async (req, res) => {
  const { cid } = req.params;
  
  res.status(501).send("Endpoint not implemented");
}

export const update = async (req, res) => {
  const { cid } = req.params;
  
  res.status(501).send("Endpoint not implemented");
}

export const remove = async (req, res) => {
  const { cid } = req.params;
  
  res.status(501).send("Endpoint not implemented");
}

/* CHARACTER COLLECTION */

export const allCharacters = async (req, res) => {
  const { cid } = req.params;
  
  res.status(501).send("Endpoint not implemented");
}

export const addCharacter = async (req, res) => {
  const { cid } = req.params;
  
  res.status(501).send("Endpoint not implemented");
}

/* CHARACTER ELEMENT */

export const infoCharacter = async (req, res) => {
  const { cid, kid } = req.params;
  
  res.status(501).send("Endpoint not implemented");
}

export const changeStats = async (req, res) => {
  const { cid, kid } = req.params;
  
  res.status(501).send("Endpoint not implemented");
}

export const changeHitPoints = async (req, res) => {
  const { cid, kid } = req.params;
  
  res.status(501).send("Endpoint not implemented");
}

export const kill = async (req, res) => {
  const { cid, kid } = req.params;
  
  res.status(501).send("Endpoint not implemented");
}

/* FALLEN COLLECTION */

export const allFallen = async (req, res) => {
  const { cid } = req.params;
  
  res.status(501).send("Endpoint not implemented");
}

/* FALLEN ELEMENT */

export const infoFallen = async (req, res) => {
  const { cid, fid } = req.params;
  
  res.status(501).send("Endpoint not implemented");
}

export const resurrect = async (req, res) => {
  const { cid, fid } = req.params;
  
  res.status(501).send("Endpoint not implemented");
}
