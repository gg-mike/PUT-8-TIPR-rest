import jwt from "jsonwebtoken";

export const wrapper = async (req, res, callback) => {
  try {
    await callback(req, res);
  } catch (err) {
    res.status(500).send(`[ERROR] ${err.message}`);
  }
}

export const addValidator = async (token, res, collection) => {
  const id = jwt.verify(token, process.env.SECRET_KEY)?._id;
  if (!id)
    return { res: res.status(400).send("Provided token is invalid"), valid: false };
  const doc = await collection.findById(id);
  if (doc)
    return { res: res.status(400).send("Provided token was already used"), valid: false };
  return { id, valid: true };
}

export const userAuthValidator = (uid, authUser, res) => {
  if (!authUser)
    return { res: res.status(401).send("Unauthenticated"), valid: false };
  else if (authUser.id !== uid && !authUser.isAdmin)
    return { res: res.status(403).send("Forbidden"), valid: false };
  return { valid: true };
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
