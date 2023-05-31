import User from "../models/user.model.js";
import { documentMissing, getCharacter } from "../utils/collection.js";
import { addValidator, authValidator, bodyValidator, etagValidator } from "../utils/validators.js";

export const user = {
  exists: async (req, res, next) => {
    if (await documentMissing(User, { "_id": req.params.rid }))
      return res.status(404).send("User with this id does not exist");
    
    next();
  },
  auth: async (req, res, next) => {
    const { status, message } = authValidator(req.params.rid, req.authUser);
    if (status) return res.status(status).send(message);
    
    next();
  },
  add: async (req, res, next) => {
    const { id, status, message } = await addValidator(req.query.token, User, "_id");
    if (status) return res.status(status).send(message);
    req.newId = id;

    next();
  },
  replace: async (req, res, next) => {
    const { status, message } = bodyValidator(req.body, { name: "String", login: "String", password: "String", isAdmin: "Boolean" });
    if (status) return res.status(status).send(message);
    
    next();
  },
  update: async (req, res, next) => {
    const { status, message } = bodyValidator(req.body, { oldPassword: "String", newPassword: "String" });
    if (status) return res.status(status).send(message);
    if (!req.body.newPassword)
      return res.status(400).send("Body attribute 'newPassword' is empty");
    
    next();
  },
  transfer: async (req, res, next) => {
    const { status, message } = bodyValidator(req.body, { dest: "String", ids: "Array" });
    if (status) return res.status(status).send(message);
    if (!req.body.ids.length)
      return res.status(400).send("No id provided");
    
    next();
  },
  etag: async (req, res, next) => {
    const { status, message } = etagValidator(req.headers["if-match"], await User.findById(req.params.rid));
    if (status) return res.status(status).send(message);

    next();
  }
}

export const character = {
  exists: async (req, res, next) => {
    if (await documentMissing(User, { "_id": req.params.rid, "characters._id": req.params.sid }))
      return res.status(404).send("Character with this id does not exist for this user");
    
    next();
  },
  add: async (req, res, next) => {
    const { id, status, message } = await addValidator(req.query.token, User, "characters._id");
    if (status) return res.status(status).send(message);
    req.newId = id;

    next();
  },
  replace: async (req, res, next) => {
    const { status, message } = bodyValidator(req.body, { name: "String", className: "String", race: "String", level: "Number", hitPoints: "Number" });
    if (status) return res.status(status).send(message);
    
    next();
  },
  update: async (req, res, next) => {
    const { status, message } = bodyValidator(req.body, { hitPoints: "Number" });
    if (status) return res.status(status).send(message);
    
    next();
  },
  etag: async (req, res, next) => {
    const { status, message } = etagValidator(req.headers["if-match"], await getCharacter(req.params.sid));
    if (status) return res.status(status).send(message);
  
    next();
  },
}
