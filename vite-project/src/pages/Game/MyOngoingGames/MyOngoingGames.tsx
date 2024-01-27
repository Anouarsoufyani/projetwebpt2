/* eslint-disable @typescript-eslint/no-explicit-any */
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useGetMyOngoingGames } from "../../../hooks/game.hooks"
import { Link } from "react-router-dom";
// import { io } from "socket.io-client";


const MyGames = () => {

    const getMyOngoingGames = useGetMyOngoingGames()

    const games = getMyOngoingGames.data?.data.games;

    const startedGames = games ? games.filter((game: any) => game.status === "started") : [];


    return (
        <>
            {getMyOngoingGames.isLoading ? (
                <div>Loading</div>
            ) : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Game Number</TableCell>
                                <TableCell align="left">NbPlayers</TableCell>
                                <TableCell align="left">Status</TableCell>
                                <TableCell align="left">Start</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {startedGames.map((game: any) => (
                                <TableRow>
                                    <TableCell align="left">{game.code}</TableCell>
                                    <TableCell align="left">{game.players.length}/10</TableCell>
                                    <TableCell align="left">{game.status}</TableCell>
                                    {game.players.length > 1 ? (
                                        <TableCell align="left">
                                            <Link to={`/partie/${game.code}`}>Join the game</Link>
                                        </TableCell>
                                    ) : (
                                        <TableCell align="left">Il n'y a pas assez de joueurs dans la partie</TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer >
            )}


        </>
    )
}

export default MyGames