// import { ObjectId } from "@mikro-orm/mongodb";
// import { User } from "../entities/User";
// import { GameType } from "../entities/GameType";
// import { Hand } from "../entities/Hand";
import { Card } from "./CardInterface";

export class CardDeck {

    deck: Card[] = [];



    generationPaquet = () => {

        const paquet: Card[] = [];

        for (let i = 0; i < 104; i++) {
            if (i == 55) {
                paquet.push({
                    identifiant: i,
                    isUsable: true,
                    user: undefined,
                    nbBoeuf: 7
                },)

            }

            if ((i % 10) == 0) {
                paquet.push({
                    identifiant: i,
                    isUsable: true,
                    user: undefined,
                    nbBoeuf: 3
                },)
            }
            if ((i % 5) == 0) {
                paquet.push({
                    identifiant: i,
                    isUsable: true,
                    user: undefined,
                    nbBoeuf: 2
                },)
            }
            if ((i % 11) == 0) {
                paquet.push({
                    identifiant: i,
                    isUsable: true,
                    user: undefined,
                    nbBoeuf: 5
                },)
            }
        }

        return paquet
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