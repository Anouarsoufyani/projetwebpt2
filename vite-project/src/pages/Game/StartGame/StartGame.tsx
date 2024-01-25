/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useStartGameMutation } from "../../../hooks/game.hooks";


const StartGame = () => {

    //SI USER CONNECTE ET PAS PROPRIETAIRE DE LA PARTIE => RETURN JOIN BUTTON
    //SI USER CONNECTE ET PROPRIETAIRE DE LA PARTIE => RETURN JOIN BUTTON

    const startGameMutation = useStartGameMutation()


    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form data before submission:", e); // Ajoutez cette ligne pour déboguer

        // Utilisez directement le code de la partie extrait de l'URL
        await startGameMutation.mutateAsync({ gameCode: code });
    };

    const { code } = useParams<any>();

    return (
        <div>
            <h1>Starting : {code} </h1>
            <form onSubmit={onSubmit}>
                <button type="submit" className="btn btn-primary" disabled={startGameMutation.isLoading}>
                    Start game
                </button>
            </form>
        </div>
    )

}

export default StartGame