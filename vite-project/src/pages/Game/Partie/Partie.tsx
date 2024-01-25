/* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState, useEffect, useRef } from 'react';
// import { io } from 'socket.io-client';
// import './Partie.css';
// import { useGetAllGames } from '../../../hooks/game.hooks';
// import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
// import { useParams } from 'react-router-dom';

// const Partie: React.FC = () => {
//     const socket = io('http://localhost:5000/');
//     const [message, setMessage] = useState('');
//     const [messages, setMessages] = useState<{ username: string; message: string }[]>([]);
//     const inputRef = useRef<HTMLInputElement | null>(null);

//     const { code } = useParams<any>();


//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         const user = JSON.parse(localStorage.getItem('user') || '{}');
//         localStorage.setItem('Message', message);
//         socket.emit('send_message', { username: user.username, message });
//         if (inputRef.current) {
//             inputRef.current.value = '';  // Réinitialise la valeur de l'input à une chaîne vide
//         }
//     };

//     useEffect(() => {
//         socket.on('receive_message', (data) => {
//             console.log('Nouveau message reçu:', data);
//             setMessages((prevMessages) => [...prevMessages, data]);
//             setMessage('');  // Met à jour l'état pour vider l'input
//         });

//         return () => {
//             socket.off('receive_message');
//         };
//     }, [socket]);

//     const getAllGamesQuery = useGetAllGames();
//     const allGames = getAllGamesQuery.data?.data.games;

//     // Filtrer les jeux avec le statut "unstarted"
//     const game = allGames ? allGames.filter((game: any) => game.code === code) : [];


//     return (
//         <>
//             <section id="game_container">
//                 <div className="game">
//                 {getAllGamesQuery.isLoading ? (
//                 <div>Loading</div>
//             ) : (
//                 <TableContainer component={Paper}>
//                     <Table sx={{ minWidth: 650 }} aria-label="simple table">
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell align="left">Game Number</TableCell>
//                                 <TableCell align="left">Owner</TableCell>
//                                 <TableCell align="left">NbPlayers</TableCell>
//                                 <TableCell align="left">Status</TableCell>
//                                 <TableCell align="left">Join</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {game.map((game : any) => (
//                                 <TableRow key={game.code}>
//                                     <TableCell align="left">{game.code}</TableCell>
//                                     <TableCell align="left">{game.owner}</TableCell>
//                                     <TableCell align="left">{game.players.length}/10</TableCell>
//                                     <TableCell align="left">{game.status}</TableCell>
//                                     <TableCell align="left">{game.gameHands}</TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             )}
//                 </div>
//                 <div className="hand_container">
//                     <div className="card"></div>
//                     <div className="card"></div>
//                     <div className="card"></div>
//                     <div className="card"></div>
//                     <div className="card"></div>
//                     <div className="card"></div>
//                 </div>
//             </section>
//             <section id="chat">
//                 <div id='messages'>
//                     {messages.map((messageData, index) => (
//                         <p key={index} className={messageData.username === JSON.parse(localStorage.getItem('user') || '{}').username ? 'own-message' : ''}>
//                             <span><strong className="message-owner">{messageData.username}</strong> :</span> <span>{messageData.message}</span>
//                         </p>
//                     ))}
//                 </div>
//                 <form onSubmit={handleSubmit}>
//                     <hr />
//                     <input
//                         type='text'
//                         minLength={6}
//                         name='username'
//                         id='username'
//                         className='username__input'
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                         ref={inputRef}  // Associe la référence à l'input
//                     />
//                     <button>Send</button>
//                 </form>
//             </section>
//         </>
//     );
// };

// export default Partie;


import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './Partie.css';
import { useGetGame } from '../../../hooks/game.hooks';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useParams } from 'react-router-dom';


const socket = io('http://localhost:5000/');


const Partie: React.FC = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<{ username: string; message: string }[]>([]);
    const [main, setMain] = useState<{ main: any[] }>({ main: [] });

    const inputRef = useRef<HTMLInputElement | null>(null);

    const { code } = useParams<{ code?: string }>();



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('Message', message);
        socket.emit('send_message', { username: user.username, message });
        if (inputRef.current) {
            inputRef.current.value = '';  // Réinitialise la valeur de l'input à une chaîne vide
        }
    };

    useEffect(() => {
        socket.on('receive_message', (data) => {
            console.log('Nouveau message reçu:', data);
            setMessages((prevMessages) => [...prevMessages, data]);
            setMessage('');  // Met à jour l'état pour vider l'input
        });

        return () => {
            socket.off('receive_message');
        };
    }, []);

    useEffect(() => {
        // Émettez la demande de la main lorsque le composant est monté
        socket.emit("request_main");

        // Écoutez la réponse de la main
        socket.on('main', (data) => {
            console.log('Main reçue:', data);
            setMain(data);
        });

        return () => {
            // Retirez l'écouteur lors du démontage du composant
            socket.off('main');
        };
    }, []);




    // eslint-disable-next-line react-hooks/rules-of-hooks
    const getGameQuery = useGetGame({ code: code || '' });

    const game = getGameQuery.data?.data.game;
    // console.log({test0 : getGameQuery.data?.data.games});
    // console.log({test2 : getGameQuery.data});


    // // Filtrer les jeux avec le statut "unstarted"
    // const game = queryGame ? queryGame.filter((game: any) => game.code === code) : [];
    // console.log(game);



    return (
        <>
            <section id="game_container">
                <img src="/pages/Game/Partie/src/cartes/1.svg" alt="" height={500} width={500} />
                <div className="game">
                    {getGameQuery.isLoading ? (
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
                                    {/* Utilisez directement les données de queryGame */}
                                    <TableRow key={game.code}>
                                        <TableCell align="left">{game.code}</TableCell>
                                        <TableCell align="left">{game.owner}</TableCell>
                                        <TableCell align="left">{game.players.length}/10</TableCell>
                                        <TableCell align="left">{game.status}</TableCell>
                                        <TableCell align="left">{game.gameHands}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </div>
                <div className="hand_container">
                    {main.main && main.main.map((card: any, index: number) => (
                        <div key={index} className="card">
                            {/* Affichez les informations de la carte, par exemple : */}
                            <img src={`./src/cartes/${card.identifiant}.svg`} alt={`Card ${card.identifiant}`} />
                            <p>Identifiant: {card.identifiant}</p>
                            <p>Boeuf: {card.nbBoeuf}</p>
                            {/* Ajoutez d'autres informations si nécessaire */}
                        </div>
                    ))}
                </div>


            </section>
            <section id="chat">
                <div id='messages'>
                    {messages.map((messageData, index) => (
                        <p key={index} className={messageData.username === JSON.parse(localStorage.getItem('user') || '{}').username ? 'own-message' : ''}>
                            <span><strong className="message-owner">{messageData.username}</strong> :</span> <span>{messageData.message}</span>
                        </p>
                    ))}
                </div>
                <form onSubmit={handleSubmit}>
                    <hr />
                    <input
                        type='text'
                        minLength={6}
                        name='username'
                        id='username'
                        className='username__input'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        ref={inputRef}  // Associe la référence à l'input
                    />
                    <button>Send</button>
                </form>
            </section>
        </>
    );


};

export default Partie;
