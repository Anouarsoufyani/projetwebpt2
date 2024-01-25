/* eslint-disable @typescript-eslint/no-explicit-any */
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useGetAllGames } from "../../../hooks/game.hooks";
import { Link } from "react-router-dom";

const AllGames = () => {
    const getAllGamesQuery = useGetAllGames();
    const allGames = getAllGamesQuery.data?.data?.games;  // Ajoutez une vérification ici

    // Filtrer les jeux avec le statut "unstarted"
    const unstartedGames = allGames ? allGames.filter((game: any) => game.status === "unstarted") : [];

    return (
        <>
            {getAllGamesQuery.isLoading ? (
                <div>Loading</div>
            ) : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Game Number</TableCell>
                                <TableCell align="left">Owner</TableCell>
                                <TableCell align="left">NbPlayers</TableCell>
                                <TableCell align="left">Status</TableCell>
                                <TableCell align="left">Join</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {unstartedGames.map((game: any) => (
                                <TableRow key={game.code}>
                                    <TableCell align="left">{game.code}</TableCell>
                                    <TableCell align="left">{game.owner}</TableCell>
                                    <TableCell align="left">{game.players.length}/10</TableCell>
                                    <TableCell align="left">{game.status}</TableCell>
                                    <TableCell align="left">
                                        <Link to={`/join-game/${game.code}`}>Join the game</Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
    );
};

export default AllGames;

