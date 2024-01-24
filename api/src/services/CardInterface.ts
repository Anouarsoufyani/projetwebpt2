import { User } from "../entities";

export interface Card {
    identifiant: number
    user: User | undefined,
    nbBoeuf: number,
    isUsable: boolean
}