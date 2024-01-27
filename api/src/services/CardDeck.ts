// import { ObjectId } from "@mikro-orm/mongodb";
// import { User } from "../entities/User";
// import { GameType } from "../entities/GameType";
// import { Hand } from "../entities/Hand";
import { Card } from "./CardInterface";

export class CardDeck {

    deck: Card[] = [];



    generationPaquet = () => {
        const paquet: Card[] = [];

        for (let i = 1; i <= 104; i++) { // Supposons que vous commencez par 1 et allez jusqu'à 104 inclus
            if (i === 55) {
                paquet.push({
                    identifiant: i,
                    isUsable: true,
                    user: undefined,
                    nbBoeuf: 7
                });
            } else if (i % 11 === 0) {
                paquet.push({
                    identifiant: i,
                    isUsable: true,
                    user: undefined,
                    nbBoeuf: 5
                });
            } else if (i % 10 === 0) {
                paquet.push({
                    identifiant: i,
                    isUsable: true,
                    user: undefined,
                    nbBoeuf: 3
                });
            } else if (i % 5 === 0) {
                paquet.push({
                    identifiant: i,
                    isUsable: true,
                    user: undefined,
                    nbBoeuf: 2
                });
            } else {
                // Ajouter une carte standard si aucune des autres conditions n'est remplie
                paquet.push({
                    identifiant: i,
                    isUsable: true,
                    user: undefined,
                    nbBoeuf: 1 // ou une autre valeur appropriée pour nbBoeuf
                });
            }
        }

        return paquet;
    }

    shuffleDeck = (paquet: Card[]) => {
        let currentIndex = paquet.length;
        while (currentIndex > 0) {
            const randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [paquet[currentIndex], paquet[randomIndex]] = [paquet[randomIndex], paquet[currentIndex]];
        }

        return paquet;
    }

    // getCard = (identifiant :number, symbole: "Coeur" | "Trefle" | "Carreau" | "Pique") => {
    //     for (let i = 0; i < this.deck.length; i++) {
    //         if (identifiant == this.deck[i].identifiant && symbole == this.deck[i].symbole) {
    //             return this.deck[i];
    //         }
    //     }
    // }

    // getCardByIndex = (i: number) => {
    //     return this.deck[i];
    // }

    // removeCard = (identifiant, symbole) => {
    //     for (let i = 0; i < this.deck.length; i++) {
    //         if (identifiant == this.deck[i].identifiant && symbole == this.deck[i].symbole) {
    //             delete this.deck[i];
    //         }
    //     }
    // }

    removeCard = () => {
        this.deck.pop();
    }


    constructor() {
        this.deck = this.generationPaquet();
    }





}