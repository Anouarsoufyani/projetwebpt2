// import { ObjectId } from "@mikro-orm/mongodb";
// import { User } from "../entities/User";
// import { GameType } from "../entities/GameType";
// import { Hand } from "../entities/Hand";
import { CardIdentifiers } from "./CardType";
import { Card } from "./CardInterface";
import { CARD_POWERS } from "./CardPower";

export class CardDeck {

    deck: Card[] = [];

    static getCardPower = (card: Card) => {
        return CARD_POWERS[card.identifiant]
    }

    generationPaquet = () => {

        const paquet: Card[] = [];

        Object.keys(CARD_POWERS).forEach(identifier => {
            paquet.push({
                identifiant: identifier as CardIdentifiers,
                symbole: "Coeur",
                isUsable: false,
                user: undefined
            })
            paquet.push({
                identifiant: identifier as CardIdentifiers,
                symbole: "Carreau",
                isUsable: false,
                user: undefined
            })
            paquet.push({
                identifiant: identifier as CardIdentifiers,
                symbole: "Pique",
                isUsable: false,
                user: undefined
            })
            paquet.push({
                identifiant: identifier as CardIdentifiers,
                symbole: "Trefle",
                isUsable: false,
                user: undefined
            })
        })

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

    getCard = (identifiant :CardIdentifiers, symbole: "Coeur" | "Trefle" | "Carreau" | "Pique") => {
        for (let i = 0; i < this.deck.length; i++) {
            if (identifiant == this.deck[i].identifiant && symbole == this.deck[i].symbole) {
                return this.deck[i];
            }
        }
    }

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