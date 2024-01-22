import { User } from "../entities";
import { CardIdentifiers } from "./CardType";

export interface Card {
    symbole: "Coeur" | "Trefle" | "Carreau" | "Pique",
    identifiant: CardIdentifiers,
    user: User | undefined,
    isUsable: boolean
}