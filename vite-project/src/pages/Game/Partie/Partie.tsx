/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const Partie: React.FC = () => {

    const socket = io('http://localhost:5000/'); // Utilisez le même port que votre serveur
    // const sendMessage = () => {

    // }

    // const navigate = useNavigate();
    const [userName, setUserName] = useState('');

    const handleSubmit = (e: any) => {
        e.preventDefault();
        localStorage.setItem('userName', userName);
        socket.emit("send_message", userName)
        // navigate('/chat');
    };


    socket.on("receive_message", (data) => {
        const messagesElement = document.getElementById("messages");
        if (messagesElement) {
            const newMessage = document.createElement("p");
            if (newMessage.textContent == data) {
                return 0;
            } else {
                newMessage.textContent = data;
                messagesElement.appendChild(newMessage);
                console.log("youhou");
            }
        }
    });
    return (
        <>
            <div id='messages'>

            </div>
            <form className="home__container" onSubmit={handleSubmit}>
                <h2 className="home__header">Sign in to Open Chat</h2>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    minLength={6}
                    name="username"
                    id="username"
                    className="username__input"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <button className="home__cta">SIGN IN</button>
            </form>
        </>
    );



    // socket.emit('joueur', games.owner);

    // socket.on('mainDeCartes', (nouvelleMain) => {
    //     console.log({ main: nouvelleMain });
    // });

    // return (
    //     <div>
    //         <h1>Chat de la partie</h1>
    //         {/* <h2 style={{ color: "white" }}>{games.owner}</h2> */}
    //         <input type="text" />
    //         <button onClick={sendMessage}>Envoyer le message</button>
    //     </div>
    // );
};

export default Partie;


// const Partie: React.FC = () => {
//     const [mainDeCartes, setMainDeCartes] = useState<string[]>([]);
//     const [message, setMessage] = useState<string>('');
//     const socket = io('http://localhost:5000/game/start'); // Utilisez le même port que votre serveur

//     useEffect(() => {
//         // Écoutez l'événement 'mainDeCartes' émis par le serveur
//         socket.on('mainDeCartes', (nouvelleMain: string[]) => {
//             setMainDeCartes(nouvelleMain);
//         });

//         // Écoutez l'événement 'message' émis par le serveur
//         socket.on('message', (data: string) => {
//             setMessage(data);
//         });

//         // Nettoyez le socket lors du démontage du composant
//         return () => {
//             socket.disconnect();
//         };
//     }, [socket]);

//     const genererOptions = () => {
//         // Émettez un événement au serveur pour demander la nouvelle main
//         socket.emit('demanderMainDeCartes');
//     };

//     return (
//         <div>
//             <h1>Page de la partie</h1>

//             <label htmlFor="cartes">Choisissez vos cartes :</label>
//             <select id="cartes" name="cartes" multiple>
//                 {mainDeCartes.map((carte, index) => (
//                     <option key={index} value={carte}>
//                         {carte}
//                     </option>
//                 ))}
//             </select>

//             <button type="button" onClick={genererOptions}>
//                 Générer Options
//             </button>

//             <div>
//                 <p>Message du serveur : {message}</p>
//             </div>
//         </div>
//     );
// };

// export default Partie;