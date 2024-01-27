import { Request, Response } from "express";
import { DI, io } from "../../app";
import { Game, User } from "../../entities";
import uuid4 from "uuid4";
import startGameRequestDto from "./dtos/startGameRequestDto";
import { GameStatus } from "../../entities/GameStatus";
import { CardDeck } from "../../services/CardDeck";
import { Jboeuf, createHandForAllPlayers } from "../../services/GameService";
import getMyGamesRequestDto from "./dtos/getMyGamesRequestDto";
import { ObjectId } from "@mikro-orm/mongodb";
import { Card } from "../../services/CardInterface";
// import { Card } from "../../services/CardInterface";


export class GameController {
  static getAllGames = async (req: Request, res: Response) => {
    const currentUser = req.user;

    const games = await DI.gameRepository.findAll({
      owner: currentUser,
    });

    return res.json({ games });
  };


  static getGame = async (req: Request, res: Response) => {
    const code = req.params.code;

    const game = await DI.gameRepository.findOne({
      code: code,
    });

    return res.json({ game });
  };

  static getMyGames = async (req: Request<getMyGamesRequestDto>, res: Response) => {
    const currentUser = req.user;
    console.log({ USERGETGAMES: currentUser });


    const games = await DI.orm.em.find(Game, {
      owner: currentUser,  // Assurez-vous que votre entité Game a une relation nommée 'owner' avec l'entité User
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

    const userEntity = await DI.userRepository.findOne({
      _id: currentUser._id
    })

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

    if (game && game?.owner?._id === currentUser._id && game.players.length >= 2 && game.players.length <= 10) {
      game.status = GameStatus.STARTED;

      const cardDeck = new CardDeck();
      const paquet = cardDeck.deck;
      const paquetMelange = cardDeck.shuffleDeck(paquet);
      let miseEnJeu: any[] = [];

      for (let i = 0; i < 4; i++) {
        let card = paquetMelange.pop();
        if (card !== undefined) {
          miseEnJeu.push([card]);
        }
      }


      // console.log(Jboeuf(game, miseEnJeu));


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

      const cartes: Card[] = [];
      let nbJoueursConnectes: number = 0;
      io.on("connection", (socket) => {
        nbJoueursConnectes++;
        console.log(nbJoueursConnectes);

        // Écoutez la demande de la main
        socket.on("request_main", () => {
          // Émettez la main uniquement en réponse à la demand

          socket.emit("main", { main: game.gameHands });
        });

        socket.on("sendCard", (data) => {
          console.log({ CardSent: data });
          cartes.push(data);
          if (cartes.length == nbJoueursConnectes) {
            console.log(Jboeuf(game, miseEnJeu, cartes));

          }
        })

        socket.on("updateHand", async (data) => {
          try {
            const userEntity = await DI.userRepository.findOne({
              _id: new ObjectId(data.userId)
            });

            for (const hand of game.gameHands) {
              if (hand.owner?._id && userEntity?._id && hand.owner._id.equals(userEntity._id)) {
                hand.cards = data.hand.cards;
                await DI.em.persistAndFlush(game);  // Utilisez persist au lieu de persistAndFlush pour éviter la modification de la structure
                console.log("HAND", hand);
                // Vous pouvez utiliser flush à la fin pour appliquer les modifications à la base de données
                // await DI.em.flush();
              }
            }
          } catch (error) {
            console.error("Erreur lors de la mise à jour de la main :", error);
          }

        });
      });
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

    return res.json(game);

  }


}

