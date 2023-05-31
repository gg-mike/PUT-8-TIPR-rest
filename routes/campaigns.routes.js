import { Router } from "express";
import * as ctrl from "../controllers/campaigns.controller.js";
import { campaign as c, character as k } from "../middleware/campaigns.middleware.js";
import { wrapper } from "../utils/helpers.js";

const router = Router();

router.get(   "/",                                 (req, res) => wrapper(req, res, ctrl.all));
router.post(  "/",     [c.addAuth, c.add],         (req, res) => wrapper(req, res, ctrl.add));
router.get(   "/:rid", [c.exists],                 (req, res) => wrapper(req, res, ctrl.info));
router.put(   "/:rid", [c.auth, c.exists, c.etag], (req, res) => wrapper(req, res, ctrl.replace));
router.patch( "/:rid", [c.auth, c.exists, c.etag], (req, res) => wrapper(req, res, ctrl.update));
router.delete("/:rid", [c.auth, c.exists],         (req, res) => wrapper(req, res, ctrl.remove));

router.get(   "/:rid/characters",      [c.exists],                      (req, res) => wrapper(req, res, ctrl.allCharacters));
router.post(  "/:rid/characters",      [c.auth, c.exists, k.addExists], (req, res) => wrapper(req, res, ctrl.addCharacter));
router.get(   "/:rid/characters/:sid", [c.exists, k.exists],            (req, res) => wrapper(req, res, ctrl.infoCharacter));
router.put(   "/:rid/characters/:sid", [c.auth, c.exists, k.exists],    (req, res) => wrapper(req, res, ctrl.redirect));
router.patch( "/:rid/characters/:sid", [c.auth, c.exists, k.exists],    (req, res) => wrapper(req, res, ctrl.redirect));
router.delete("/:rid/characters/:sid", [c.auth, c.exists, k.exists],    (req, res) => wrapper(req, res, ctrl.kill));

router.get(   "/:rid/fallen",      [c.exists],                         (req, res) => wrapper(req, res, ctrl.allFallen));
router.post(  "/:rid/fallen",      [c.auth, c.exists, k.addExists],    (req, res) => wrapper(req, res, ctrl.addFallen));
router.get(   "/:rid/fallen/:sid", [c.exists, k.fallenExists],         (req, res) => wrapper(req, res, ctrl.infoCharacter));
router.delete("/:rid/fallen/:sid", [c.auth, c.exists, k.fallenExists], (req, res) => wrapper(req, res, ctrl.resurrect));

export default router;