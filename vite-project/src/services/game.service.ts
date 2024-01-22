/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { http } from "../utils";

interface userDto {
    id: string,
    email: string
}

interface joinGameRequestDto {
    gameCode: string;
    user: any; // type user
}

interface joinGameRequestDto {
    game: any;
}

enum GameStatus {
    UNSTARTED = 'unstarted',
    STARTED = 'started',
    PAUSED = 'paused',
    COMPLETED = 'completed',
}

interface gameResponseDto {
    type: string,
    code: string,
    owner: userDto,
    players: userDto[],
    status: GameStatus
}


// interface startGameRequestDto {
//     gameCode: string;
//     user: any; // type user
// }





export const GameService = {
    getAllGames: async (): Promise<AxiosResponse<any>> => {
        return http.get(`/game`);
    },

    createGame: async (): Promise<AxiosResponse<gameResponseDto>> => {
        return http.post("/game");
    },

    joinGame: async (
        data: joinGameRequestDto
    ): Promise<AxiosResponse<any>> => {
        return http.post(`/game/join`, data);
    },

    startGame: async (
        data: any
    ): Promise<AxiosResponse<any>> => {
        return http.post("/game/start", data);
    },
};