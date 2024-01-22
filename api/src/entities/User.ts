import {
  Entity,
  // Collection,
  OneToMany,
  //ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { Game } from "./Game";
import { Hand } from "./Hand";

@Entity()
@Unique({ properties: ["username", "email"] })
export class User {
  @PrimaryKey()
  _id: ObjectId | undefined;

  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property()
  username!: string;

  @Property()
  email!: string;

  @Property()
  password!: string;

  @Property()
  score: number = 0;

  @OneToMany(() => Game, (game) => game.owner)
  ownedGames: Game[] | undefined;

  @OneToMany(() => Hand, (hand) => hand.owner)
  userHands: Hand[] = [];

}
