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

export const useJoinGameMutation = () => {
    return useMutation({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mutationFn: (game: any) => {
            return GameService.joinGame(game)
        },
    })

}