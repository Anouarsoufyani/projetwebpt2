/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useJoinGameMutation } from "../../../hooks/game.hooks";


const JoinGame = () => {

    //SI USER CONNECTE ET PAS PROPRIETAIRE DE LA PARTIE => RETURN JOIN BUTTON
    //SI USER CONNECTE ET PROPRIETAIRE DE LA PARTIE => RETURN JOIN BUTTON

    const joinGameMutation = useJoinGameMutation()

    const onSubmit = async (e: any) => {
        e.preventDefault();
        await joinGameMutation.mutateAsync(e);
    }

    const { code } = useParams<any>();

    return (
        <div>
            <h1>Joining : {code} </h1>
            <form onSubmit={onSubmit}>
                <button type="submit" className="btn btn-primary" disabled={joinGameMutation.isLoading}>
                    Join game
                </button>
            </form>
        </div>
    )

}

export default JoinGame