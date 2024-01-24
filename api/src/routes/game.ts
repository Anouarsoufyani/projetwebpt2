import express from "express";
import passport from "passport";
import { GameController } from "../controllers/game/gameController";

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  GameController.createGame
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  GameController.getAllGames
);

router.get(
  "/my-games",
  passport.authenticate("jwt", { session: false }),
  GameController.getMyGames
);

router.post(
  "/join",
  passport.authenticate("jwt", { session: false }),
  GameController.joinGame
);

router.post(
  "/start",
  passport.authenticate("jwt", { session: false }),
  GameController.startGame
);

export default router;
