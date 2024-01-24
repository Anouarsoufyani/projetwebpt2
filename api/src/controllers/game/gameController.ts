import { Request, Response } from "express";
import { DI } from "../../app";
import { Game, User } from "../../entities";
import uuid4 from "uuid4";
import startGameRequestDto from "./dtos/startGameRequestDto";
import { GameStatus } from "../../entities/GameStatus";
import { CardDeck } from "../../services/CardDeck";
import { Jboeuf, createHandForAllPlayers } from "../../services/GameService";
// import { Card } from "../../services/CardInterface";


export class GameController {
  static getAllGames = async (req: Request, res: Response) => {
    const currentUser = req.user;

    const games = await DI.gameRepository.findAll({
      owner: currentUser,
    });

    return res.json({ games });
  };






  static createGame = async (req: Request, res: Response) => {
    const currentUser = req.user;

    const newGame = DI.em.create(Game, {
      type: "buffle",
      code: uuid4(),
      owner: currentUser,
      players: [currentUser],
      status: GameStatus.UNSTARTED
    });

    await DI.em.persistAndFlush(newGame);

    return res.json({ ...newGame });
  };


  static joinGame = async (req: Request, res: Response) => {
    const currentUser = req.user as User; // type correctly
    console.log("current");

    // console.log(currentUser);


    const userEntity = await DI.userRepository.findOne({
      _id: currentUser._id
    })
    // console.log("entity");

    // console.log(userEntity);


    // console.log(req.body);

    const game = await DI.gameRepository.findOne({

      code: req.body.gameCode
    })

    // console.log(game);


    if (game && userEntity) {
      game.players = [...game.players, userEntity]
      await DI.em.persistAndFlush(game);
    } else {
      /// handle error
    }

    return res.json(game);

  }

  static startGame = async (req: Request<startGameRequestDto>, res: Response) => {
    const currentUser = req.user as User; // type correctly

    //Selectionne une game précise où userEntity/currentUser est le propriétaire
    // et sélectionne la game avec son code unique
    const game = await DI.gameRepository.findOne({
      owner: currentUser,
      code: req.body.gameCode
    })

    //   const user = await DI.userRepository.findOne({
    //     _id: game?.players[0]._id,
    // })

    // console.log({playerTest : game?.players[0]});
    // console.log({playerTestUser : user});
    // console.log(game?.players[0] == user);
    // console.log({ownerHand : game?.gameHands[0].owner});

    // console.log(game?.gameHands[0].owner == user);



    if (game && game?.owner?._id === currentUser._id && game.players.length >= 2 && game.players.length <= 10) {
      game.status = GameStatus.STARTED;

      const cardDeck = new CardDeck();
      const paquet = cardDeck.deck;
      const paquetMelange = cardDeck.shuffleDeck(paquet);
      let miseEnJeu = [];

      for (let i = 0; i < 4; i++) {
        let card = paquetMelange.pop();
        if (card !== undefined) {
          miseEnJeu.push([card]);
        }
      }


      console.log(Jboeuf(game, miseEnJeu));


      // Fonction de comparaison pour trier les cartes
      miseEnJeu.sort((a, b) => {
        let cardA = a[0]; // Première carte de la sous-liste a
        let cardB = b[0]; // Première carte de la sous-liste b

        // Remplacer 'value' par la propriété réelle de vos objets Card
        return cardA.identifiant - cardB.identifiant;
      });



      // CREER MAIN ET DISTRIB CARTES
      createHandForAllPlayers(game.players, game, paquetMelange);
      await DI.em.persistAndFlush(game);

      // const cardsTest : Card[] = [
      //   {
      //     identifiant: CardIdentifiers.AS,
      //     symbole: "Coeur",
      //     isUsable: true 
      //   },
      //   {
      //     identifiant: CardIdentifiers.DEUX,
      //     symbole: "Coeur",
      //     isUsable: true
      //   }];


      // chooseCard(
      //   {
      //     identifiant: 4,
      //     isUsable: true,
      //     user: game.players[0]
      //   }, miseEnJeu
      // );

      // chooseCard(
      //   {
      //     identifiant: 8,
      //     isUsable: true,
      //     user: game.players[1]
      //   }, miseEnJeu
      // );

      // const addScore = async (card: Card, players: User[]) => {
      //   const user = await DI.userRepository.findOne({
      //     _id: card.user?._id,
      //   })

      //   let tabscore = [];
      //   for (let i = 0; i < players.length; i++) {
      //     tabscore.push({ id: players[i]._id, score: 0 });
      //   }


      //   for (let j = 0; j < players.length; j++) {
      //     if (user) {
      //       // DI.em.persistAndFlush(user);

      //       if (tabscore[j].id == user?._id) {
      //         tabscore[j].score++;
      //       }
      //       console.log(tabscore[j].id);
      //       console.log(tabscore[j].score);
      //     }
      //   }
      //   return tabscore;
      // }


      // console.log(addScore(await play(miseEnJeu, game), game.players));




    } else {
      return res.json("Joueurs insuffisants")
    }



    // if (game && userEntity) {
    //   game.players = [...game.players, userEntity]
    //   await DI.em.persistAndFlush(game);
    // } else {
    //   /// handle error
    // }

    return res.json(game);

  }


}

