import { Router } from "express";
import * as ctrl from "../controllers/users.controller.js";
import { user as u, character as c } from "../middleware/users.middleware.js";
import { wrapper } from "../utils/helpers.js";

const router = Router();

router.get(   "/",                                            (req, res) => wrapper(req, res, ctrl.all));
router.post(  "/",     [u.auth, u.add],                       (req, res) => wrapper(req, res, ctrl.add));
router.get(   "/:rid", [u.exists],                            (req, res) => wrapper(req, res, ctrl.info));
router.put(   "/:rid", [u.auth, u.exists, u.replace, u.etag], (req, res) => wrapper(req, res, ctrl.replace));
router.patch( "/:rid", [u.auth, u.exists, u.update, u.etag],  (req, res) => wrapper(req, res, ctrl.update));
router.delete("/:rid", [u.auth, u.exists],                    (req, res) => wrapper(req, res, ctrl.remove));

router.get(   "/:rid/characters",       [u.exists],                                      (req, res) => wrapper(req, res, ctrl.allCharacters));
router.post(  "/:rid/characters",       [u.auth, u.exists, c.add],                       (req, res) => wrapper(req, res, ctrl.addCharacter));
router.get(   "/:rid/characters/:sid",  [u.exists, c.exists],                            (req, res) => wrapper(req, res, ctrl.infoCharacter));
router.put(   "/:rid/characters/:sid",  [u.auth, u.exists, c.exists, c.replace, c.etag], (req, res) => wrapper(req, res, ctrl.replaceCharacter));
router.patch( "/:rid/characters/:sid",  [u.auth, u.exists, c.exists, c.update, c.etag],  (req, res) => wrapper(req, res, ctrl.updateCharacter));
router.delete("/:rid/characters/:sid",  [u.auth, u.exists, c.exists],                    (req, res) => wrapper(req, res, ctrl.removeCharacter));

router.post("/:rid/characters/transfer", [u.auth, u.exists], (req, res) => wrapper(req, res, ctrl.transferCharacters));

export default router;