import etag from "etag";
import jwt from "jsonwebtoken";

export const addValidator = async (token, collection, key) => {
  if (!token)
    return { status: 400, message: "Missing query param 'token'" };
  try {
    const id = jwt.verify(token, process.env.SECRET_KEY)?._id;
    if (!id)
      return { status: 400, message: "Provided token is invalid"};
  
    const doc = await collection.findOne({ [key]: id });
    if (doc)
      return { status: 400, message: "Provided token was already used" };
    return { id };
  } catch (e) {
    return { status: 400, message: "Provided token is expired"};
  }
}

export const authValidator = (rid, authUser) => {
  if (!authUser)
    return { status: 401, message: "Unauthenticated" };
  else if (authUser.id !== rid && !authUser.isAdmin)
    return { status: 403, message: "Forbidden"};
  return {};
}

export const etagValidator = (ifMatch, data) => {
  if (ifMatch === undefined)
    return { status: 428, message: "Missing attribute 'if-match'" };
  if (ifMatch !== etag(Buffer.from(JSON.stringify(data)), { weak: true }))
    return { status: 412, message: "Attempted to work on old version of the document" };
  return {};
}

export const bodyValidator = (body, attrs) => {
  let message = Object.keys(attrs).map(k => {
    if (body[k] === undefined)
      return `Missing body attribute '${k}'`;
    else if (body[k].constructor.name !== attrs[k])
      return `Body attribute '${k}' is wrong type (expected: '${attrs[k]}', got: '${body[k].constructor.name}')`;
    return ""
  }).filter(elem => elem !== "").join("\n");
  if (message)
    return { status: 400, message };
  return {};
}
