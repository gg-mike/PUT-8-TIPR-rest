import { Router } from "express";
import * as controller from "../controllers/users.controller.js";
import { wrapper } from "../controllers/utils.js";

const router = Router();

router.get("/", (req, res) => wrapper(req, res, controller.all));
router.post("/", (req, res) => wrapper(req, res, controller.add));

router.get("/:uid", (req, res) => wrapper(req, res, controller.info));
router.put("/:uid", (req, res) => wrapper(req, res, controller.replace));
router.patch("/:uid", (req, res) => wrapper(req, res, controller.update));
router.delete("/:uid", (req, res) => wrapper(req, res, controller.remove));

router.get("/:uid/characters", (req, res) => wrapper(req, res, controller.allCharacters));
router.post("/:uid/characters", (req, res) => wrapper(req, res, controller.addCharacter));
router.get("/:uid/characters/:cid", (req, res) => wrapper(req, res, controller.infoCharacter));
router.put("/:uid/characters/:cid", (req, res) => wrapper(req, res, controller.replaceCharacter));
router.patch("/:uid/characters/:cid", (req, res) => wrapper(req, res, controller.updateCharacter));
router.delete("/:uid/characters/:cid", (req, res) => wrapper(req, res, controller.removeCharacter));

export default router;