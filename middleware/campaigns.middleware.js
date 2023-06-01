import Campaign from "../models/campaign.model.js";
import User from "../models/user.model.js";
import { documentMissing, getDm } from "../utils/collection.js";
import { addValidator, authValidator, bodyValidator, etagValidator } from "../utils/validators.js";

export const campaign = {
  exists: async (req, res, next) => {
    if (await documentMissing(Campaign, { "_id": req.params.rid }))
      return res.status(404).send("Campaign with this id does not exist");
    
    next();
  },
  auth: async (req, res, next) => {
    req.dm = getDm(req.params.rid);
    const { status, message } = authValidator(req.dm, req.authUser);
    if (status) return res.status(status).send(message);
    
    next();
  },
  addAuth: async (req, res, next) => {
    const { status, message } = authValidator(req.body.dm, req.authUser);
    if (status) return res.status(status).send(message);
    
    next();
  },
  add: async (req, res, next) => {
    {
      const { id, status, message } = await addValidator(req.query.token, Campaign, "_id");
      if (status) return res.status(status).send(message);
      req.newId = id;
    }
    const { status, message } = bodyValidator(req.body, { dm: "String", name: "String" });
    if (status) return res.status(status).send(message);

    if (await documentMissing(User, { "_id": req.body.dm }))
      return res.status(404).send("User with this id does not exist (DM)");

    if (req.body.characters !== undefined)
      for await (const id of req.body.characters) {
        if (await documentMissing(User, { "characters._id": id }))
          return res.status(404).send("Character with this id (" + id + ") does not exist");
      }

    if (req.body.fallen !== undefined)
      for await (const id of req.body.fallen) {
        if (await documentMissing(User, { "characters._id": id }))
          return res.status(404).send("Fallen character with this id (" + id + ") does not exist");
      }

    next();
  },
  etag: async (req, res, next) => {
    const { status, message } = etagValidator(req.headers["if-match"], await Campaign.findById(req.params.rid));
    if (status) return res.status(status).send(message);

    next();
  }
}

export const character = {
  exists: async (req, res, next) => {
    if (await documentMissing(Campaign, { "_id": req.params.rid, "characters": req.params.sid }))
      return res.status(404).send("Character with this id does not exist for this campaign");
    
    next();
  },
  addExists: async (req, res, next) => {
    const { status, message } = bodyValidator(req.body, { ids: "Array" });
    if (status) return res.status(status).send(message);
    
    if (!req.body.ids.length)
      return res.status(400).send("No id provided");

    for await (const id of req.body.ids) {
      if (await documentMissing(User, { "characters._id": id }))
        return res.status(404).send("Character with this id (" + id + ") does not exist");
    }
    
    next();
  },
  fallenExists: async (req, res, next) => {
    if (await documentMissing(Campaign, { "_id": req.params.rid, "fallen": req.params.sid }))
      return res.status(404).send("Fallen character with this id does not exist for this campaign");
    
    next();
  }
}
