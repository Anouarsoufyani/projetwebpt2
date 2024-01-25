import { DI } from "../app";
import { Game, Hand, User } from "../entities";
// import { GameStatus } from "../entities/GameStatus";
import { Card } from "./CardInterface";
// import { CARD_POWERS } from "./CardPower";





// import { Socket, Server as SocketIOServer } from 'socket.io';
// import express from 'express';
// import { io } from "socket.io";

// const app = express();
// const httpServer = app.listen(5000, () => {
//     console.log(`Serveur de jeu en cours d'exécution sur le port`);
// });

// const io = new SocketIOServer(httpServer);

// // ... Votre logique pour le serveur de jeu

// io.on('connection', (socket) => {
//     console.log("'Un client s'est connecté au serveur de jeu'");
// });

// const getCardPower = (card: Card) => {
//     return CARD_POWERS[card.identifiant]
// }





export const createHand = async (player: User, game: Game, cards: Card[]) => {

    // const user = await DI.userRepository.findOne({
    //     _id: player._id,
    // })

    cards.forEach(card => {
        card.user = player
    });



    const newHand = DI.em.create(Hand, {
        cards: cards,
        owner: player,
        game: game,

    });

    await DI.em.persistAndFlush(newHand);


    // const listeDeMain = newHand.cards;
    // io.on('connection', (socket: Socket) => {
    //     console.log("'Un client s'est connecté au serveur de jeu'");
    //     // Envoyer la liste de main au client dès la connexion
    //     io.to(socket.id).emit('mainDeCartes', listeDeMain);
    //     // Gérer l'événement 'demanderMainDeCartes' du client
    //     socket.on('demanderMainDeCartes', () => {
    //         // Vous pouvez ajouter ici une logique pour générer une nouvelle main si nécessaire
    //         // puis envoyer la nouvelle main mise à jour à tous les clients connectés
    //         io.emit('mainDeCartes', listeDeMain);
    //     });

    //     // Autres logiques de gestion des événements...

    //     socket.on('disconnect', () => {
    //         console.log("'Un client s'est déconnecté du serveur de jeu'");
    //     });
    // });


    if (game && newHand) {
        game.gameHands = [...game.gameHands, newHand as Hand];
    }

    // if (user && newHand) {
    //     user.userHands = [...user.userHands, newHand];
    //     console.log(user);
    //     await DI.em.persistAndFlush(user);
    // }

};



export const getHand = async (game: Game, user: User) => {
    const hand = await DI.orm.em.find(Hand, {
        owner: user,
        game: game  // Assurez-vous que votre entité Game a une relation nommée 'owner' avec l'entité User
    });

    return hand;
}

// creation de main pour chaque joueur
export const createHandForAllPlayers = (players: User[], game: Game, paquet: Card[]) => {
    const nbDeCarteParJoueur = paquet.length / players.length;
    let compteur = 0;
    for (let j = 0; j < players.length; j++) {

        let paquetJoueur: Card[] = [];
        if (j == 0) {
            paquetJoueur = paquet.slice(0, nbDeCarteParJoueur);
        } else {
            paquetJoueur = paquet.slice(compteur, compteur + nbDeCarteParJoueur);

        }

        createHand(players[j], game, paquetJoueur); //paquet -> liste de carte
        compteur += nbDeCarteParJoueur;

    }
}

// export const getHandbyCard = (card: Card, game: Game) => {
//     for (let j = 0; j < game.gameHands.length; j++) {
//         for (let i = 0; i + 1 < game.gameHands[j].cards.length; i++) {
//             // console.log(game.gameHands[j].miseEnJeu[i]);
//             // console.log(game.gameHands[j].miseEnJeu[i].identifiant === maxPower.identifiant && game.gameHands[j].miseEnJeu[i].symbole === maxPower.symbole)
//             // console.log(maxPower);
//             if (game.gameHands[j].cards[i].identifiant === card.identifiant && game.gameHands[j].cards[i].symbole === card.symbole) {
//                 return game.gameHands[j]
//             }
//         }
//     }
// }


// export const maxPuiss = (miseEnJeu: Card[]) => {
//     let maxPower: Card = miseEnJeu[0];
//     for (let i = 1; i < miseEnJeu.length; i++) {
//         if (getCardPower(miseEnJeu[i]) > getCardPower(maxPower)) {
//             maxPower = miseEnJeu[i];
//         }
//     }
//     return maxPower;
// }

export const chooseCard = (card: Card, miseEnjeu: Card[]) => {
    if (card.isUsable == true) {
        miseEnjeu.push(card);
        console.log({ ajoutDuneCarte: miseEnjeu });

    }
    else {
        console.log("La carte est non jouable");
    }
}

// function chooseCardForPlayer(player: User, game: Game): Card {
//     // Trouver la main du joueur dans game.gameHands
//     const playerHand = game.gameHands.find(hand => hand.owner === player);

//     if (!playerHand || playerHand.cards.length === 0) {
//         throw new Error("Aucune carte trouvée pour le joueur ou le joueur n'a pas de cartes.");
//     }

//     // Choisir une carte aléatoirement de la main du joueur
//     // console.log(playerHand);

//     const cardIndex = Math.floor(Math.random() * playerHand.cards.length);
//     console.log({ nouvelleCarteEnJeu: playerHand.cards[cardIndex] });

//     return playerHand.cards[cardIndex];
// }


// const equivalentCard = (cards: Card[]) => {
//     let eqCards: Card[] = [];
//     cards.forEach(card => {
//         // Vérifiez si une carte équivalente existe dans la liste
//         if (cards.some(otherCard => otherCard.identifiant === card.identifiant && otherCard !== card)) {
//             eqCards.push(card);
//         }
//     });
//     return eqCards;
// }

// const joueurGagnant = async (cards: Card[]) => {
//     const maxPower: Card = maxPuiss(cards);
//     console.log({ carteGagnant: maxPower });

//     return maxPower;
// }



// // Supposition: La fonction chooseCardForPlayer permet aux joueurs de choisir une nouvelle carte
// function chooseCardForPlayer(player: User): Card {
//     // Implémentation spécifique pour choisir une nouvelle carte
//     // Retourne la carte choisie
// }

// const jeu = async (miseEnJeu: Card[], game: Game) => {
//     let cartesEquivalentes: Card[] = equivalentCard(miseEnJeu);
//     let nouvellesCartesEnJeu: Card[] = [];

//     if (cartesEquivalentes.length > 0) {
//         // Il y a des cartes équivalentes, les joueurs concernés choisissent de nouvelles cartes
//         let playersInBattle: User[] = cartesEquivalentes.map(card => card.user).filter(user => user !== undefined) as User[];

//         for (const player of playersInBattle) {
//             const newCard = chooseCardForPlayer(player);
//             nouvellesCartesEnJeu.push(newCard);
//         }

//         // Appel de joueurGagnant avec les nouvelles cartes choisies
//         await joueurGagnant(nouvellesCartesEnJeu, game);
//     } else {
//         // Pas de cartes équivalentes, toutes les cartes en jeu sont considérées
//         await joueurGagnant(miseEnJeu, game);
//     }
// }

// export const play = async (miseEnJeu: Card[], game: Game): Promise<Card> => {

//     let cartesEquivalentes: Card[] = equivalentCard(miseEnJeu);
//     //SI CARTES EQ 
//     if (cartesEquivalentes.length >= 2) {
//         //BATAILLE
//         console.log("il y a bataille");

//         let nouvellesCartesEnJeu: Card[] = [];
//         let playersInBattle: User[] = cartesEquivalentes.map(card => card.user).filter(user => user !== undefined) as User[];

//         for (const player of playersInBattle) {
//             const newCard = chooseCardForPlayer(player, game);// SOCKET, ENVOIE DE LA CARTE PAS L'UTILISATEUR
//             nouvellesCartesEnJeu.push(newCard);
//             console.log({ nouvellesCartesEnJeu: nouvellesCartesEnJeu });

//         }

//         return play(nouvellesCartesEnJeu, game)

//         //COMBAT ENTRE Uif(card.identifiant )SER QUI ON DES CARTES EQ

//     } else {
//         //PAS BATAILLE, > GAGNE
//         console.log("QQUN A GAGNE");
//         // return await joueurGagnant(miseEnJeu);
//     }
// }



// // export const bataille = async (game: Game, cartesEquivalentes : Card[]) =>{
// //     const playersInBattle: User[] = [];
// //     for (let k = 1; k < cartesEquivalentes.length; k++) {
// //         for (let j = 0; j < game.gameHands.length; j++) {
// //             for (let i = 0; i + 1 < game.gameHands[j].cards.length; i++) {

// //                 if (game.gameHands[j].cards[i].identifiant === cartesEquivalentes[k].identifiant[i] && game.gameHands[j].cards[i].symbole === cartesEquivalentes[k].symbole) {
// //                     game.gameHands[j].cards[i].isUsable = false;
// //                     const user = await DI.userRepository.findOne({
// //                         _id: game.gameHands[j].owner?._id
// //                     })

// //                     if (user) {
// //                         playersInBattle.push(user)

// //                     }
// //                     return user?.score;

// //                 }
// //             }
// //         }
// //     }
// // }


// // export const fight = async (miseEnJeu: Card[], game: Game) => {
// //     //trouve la carte gagnante
// //     const maxPower : Card = maxPuiss(miseEnJeu);
// //     let cartesEquivalentes : Card[] = [maxPower];
// //     miseEnJeu.forEach(async carte => {
// //         if (maxPower == carte) {
// //             cartesEquivalentes.push(carte);
// //         }
// //     });

// //     if (cartesEquivalentes.length >= 2) {
// //         const playersInBattle: User[] = [];
// //             for (let k = 1; k < cartesEquivalentes.length; k++) {
// //                 for (let j = 0; j < game.gameHands.length; j++) {
// //                     for (let i = 0; i + 1 < game.gameHands[j].cards.length; i++) {

// //                         if (game.gameHands[j].cards[i].identifiant === cartesEquivalentes[k].identifiant[i] && game.gameHands[j].cards[i].symbole === cartesEquivalentes[k].symbole) {
// //                             game.gameHands[j].cards[i].isUsable = false;
// //                             const user = await DI.userRepository.findOne({
// //                                 _id: game.gameHands[j].owner?._id
// //                             })

// //                             if (user) {
// //                                 playersInBattle.push(user)
// //                             }
// //                             // renvoie de socket de chanque user dans playersInBattle de la carte qu'il veut jouer
// //                             return user?.score;

// //                         }
// //                     }
// //                 }
// //             }
// //     }else{
// //         for (let j = 0; j < game.gameHands.length; j++) {
// //             for (let i = 0; i + 1 < game.gameHands[j].cards.length; i++) {
// //                 // console.log(game.gameHands[j].miseEnJeu[i]);
// //                 // console.log(game.gameHands[j].miseEnJeu[i].identifiant === maxPower.identifiant && game.gameHands[j].miseEnJeu[i].symbole === maxPower.symbole)
// //                 // console.log(maxPower);
// //                 if (game.gameHands[j].cards[i].identifiant === maxPower.identifiant && game.gameHands[j].cards[i].symbole === maxPower.symbole) {
// //                     game.gameHands[j].cards[i].isUsable = false;
// //                     //addScore(game.gameHands[j].owner)
// //                     const user = await DI.userRepository.findOne({
// //                         _id: game.gameHands[j].owner?._id
// //                     })
// //                     console.log(user);


// //                     if (user) {
// //                         console.log({ score1: user.score });

// //                         user.score++;
// //                         console.log({ score2: user.score });

// //                         await DI.em.persistAndFlush(user);
// //                     }
// //                     return user?.score;

// //                 }
// //             }
// //         }
// //     }
// // }
// // export const jeu = async (game: Game) => {
// //     const scoreFin = 15;

// //     game.players[0].score != scoreFin;
// //     while (game.status != GameType.COMPLETED) {
// //         let miseEnJeu: Card[] = [];

// //         for (let i = 0; i < game.players.length; i++) {
// //             // envoie du front(joueur) la carte choisie
// //             //chooseCard(/*envoie de la socket*/, miseEnJeu);
// //         }
// //         // fight(miseEnJeu, game);

// //     }

// // }

// const calculBoeuf = (cards:Card[])=>{
//     let nbB=0;
//     for(let i=0;i<cards.length;i++){
//             nbB += cards[i].nbBoeuf
//         }
//     return nbB;
//     }



const trie = (cards: Card[]) => {
    cards.sort((a, b) => {
        let cardA = a; // Première carte de la sous-liste a
        let cardB = b; // Première carte de la sous-liste b

        // Remplacer 'value' par la propriété réelle de vos objets Card
        return cardA.identifiant - cardB.identifiant;
    });
}

export const Jboeuf = async (game: Game, miseEnJeu: Card[][]) => {
    let cartes: Card[] = []

    for (let i = 0; i < game.players.length; i++) {// io.on()
        let j = Math.floor(Math.random() * 101);
        chooseCard({
            identifiant: j,
            isUsable: true,
            user: game.players[i],
            nbBoeuf: 3
        }, cartes);
    }


    while (game.gameHands != null) {

        //des que l utilisateur a envoyer une carte la mettre dans la liste cartes     


        trie(cartes);
        for (let i = 0; i < miseEnJeu.length; i++) {
            for (let j = 0; j < miseEnJeu[i].length; j++) {
                for (let k = 0; k < cartes.length; k++) {

                    //traite les cas de la carte qui est place entre la 1ere et la 3eme ligne carte comprise dans l'intervalle 
                    if (i < 3 && miseEnJeu[i][miseEnJeu.length - 1] < cartes[i] && cartes[i] < miseEnJeu[i + 1][miseEnJeu.length - 1]) {
                        if (miseEnJeu[i].length == 5) {
                            for (let m = miseEnJeu[i].length - 1; m > 0; m--) {
                                if (cartes[k].user != undefined) {
                                    const user = await DI.userRepository.findOne({
                                        _id: cartes[k].user?._id
                                    })

                                    if (user && user.score) {
                                        user.score += miseEnJeu[i][m].nbBoeuf;
                                        miseEnJeu[i].pop()
                                    }
                                }
                            }
                        }
                        miseEnJeu[i].push(cartes[k]);
                    }

                    //traite les cas de la carte qui est place a la 4eme ligne carte superieur a la carte la plus a droite
                    else if (i == 3 && miseEnJeu[i][miseEnJeu.length - 1] < cartes[i] && cartes[i] < miseEnJeu[i + 1][miseEnJeu.length - 1]) {
                        if (miseEnJeu[i].length == 5) {
                            for (let m = miseEnJeu[i].length - 1; m > 0; m--) {
                                if (cartes[k].user != undefined) {
                                    const user = await DI.userRepository.findOne({
                                        _id: cartes[k].user?._id
                                    })

                                    if (user && user.score) {
                                        user.score += miseEnJeu[i][m].nbBoeuf;
                                        miseEnJeu[i].pop()
                                    }
                                }
                            }
                        }
                        miseEnJeu[i].push(cartes[k]);
                    }


                    // carte inferieur a la ligne correspondante
                    else {//envoie d un socket pour avertir l utilisateur qu il doit rentrer une ligne a prendre parmi les 4(input)
                        let id = 3; //recupere l id de la ligne qu il veut prendre entre la 1ere ligne et la 4eme
                        for (let m = miseEnJeu[id].length - 1; m > 0; m--) {
                            if (cartes[k].user != undefined) {
                                const user = await DI.userRepository.findOne({
                                    _id: cartes[k].user?._id
                                })

                                if (user && user.score) {
                                    user.score += miseEnJeu[i][m].nbBoeuf;
                                    miseEnJeu[i].pop()
                                }
                            }
                        }
                        miseEnJeu[i].push(cartes[k]);
                    }

                }
            }
        }
    }

    let min = game.players[0]

    for (let i = 1; i < game.players.length; i++) {
        if (game.players[i].score < min.score) {
            min = game.players[i]
        }
    }

    return min;
}
