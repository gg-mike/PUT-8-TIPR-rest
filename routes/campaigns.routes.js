import { Router } from "express";
import * as controller from "../controllers/campaigns.controller.js";
import { wrapper } from "../controllers/utils.js";

const router = Router();

router.get("/", (req, res) => wrapper(req, res, controller.all));
router.post("/", (req, res) => wrapper(req, res, controller.add));

router.get("/:cid", (req, res) => wrapper(req, res, controller.info));
router.put("/:cid", (req, res) => wrapper(req, res, controller.replace));
router.patch("/:cid", (req, res) => wrapper(req, res, controller.update));
router.delete("/:cid", (req, res) => wrapper(req, res, controller.remove));

router.get("/:cid/characters", (req, res) => wrapper(req, res, controller.allCharacters));
router.post("/:cid/characters", (req, res) => wrapper(req, res, controller.addCharacter));

router.get("/:cid/characters/:kid", (req, res) => wrapper(req, res, controller.infoCharacter));
router.put("/:cid/characters/:kid", (req, res) => wrapper(req, res, controller.changeStats));
router.patch("/:cid/characters/:kid", (req, res) => wrapper(req, res, controller.changeHitPoints));
router.delete("/:cid/characters/:kid", (req, res) => wrapper(req, res, controller.kill));

router.get("/:cid/fallen", (req, res) => wrapper(req, res, controller.allFallen));

router.get("/:cid/fallen/:fid", (req, res) => wrapper(req, res, controller.infoFallen));
router.delete("/:cid/fallen/:fid", (req, res) => wrapper(req, res, controller.resurrect));

export default router;