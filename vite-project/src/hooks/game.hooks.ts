import { useMutation, useQuery } from "react-query"
import { GameService } from "../services/game.service"

export const useCreateGameMutation = () => {
    return useMutation({
        mutationFn: () => {
            return GameService.createGame()
        },
    })
}

export const useGetAllGames = () => {
    return useQuery({
        queryFn: () => { return GameService.getAllGames() },
        queryKey: 'get-all-games'
    })

}

export const useGetMyGames = () => {
    return useQuery({
        queryFn: () => { return GameService.getMyGames() },
        queryKey: 'get-my-games'
    })
}

export const useGetMyOngoingGames = () => {
    return useQuery({
        queryFn: () => { return GameService.getMyOngoingGames() },
        queryKey: 'get-my-ongoing-games'
    })
}

// export const useGetGame = () => {
//     return useQuery({
//         queryFn: () => { return GameService.getGame() },
//         queryKey: 'get-game'
//     })

// }

export const useGetGame = ({ code }: { code: string }) => {
    const query = useQuery(['getGame', code], () => GameService.getGame(code));

    return query;
};

export const useJoinGameMutation = () => {
    return useMutation({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mutationFn: (game: any) => {
            return GameService.joinGame(game)
        },
    })
}

export const useStartGameMutation = () => {
    return useMutation({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mutationFn: (game: any) => {
            return GameService.startGame(game)
        },
    })
}