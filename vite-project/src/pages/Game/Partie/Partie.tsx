/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './Partie.css';


const socket = io('http://localhost:5000/');


const Partie: React.FC = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<{ username: string; message: string }[]>([]);
    const [main, setMain] = useState<any>({ cards: [] });



    const inputRef = useRef<HTMLInputElement | null>(null);

    // const { code } = useParams<{ code?: string }>();


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
            setMessages((prevMessages) => [...prevMessages, data]);
            setMessage('');  // Met à jour l'état pour vider l'input
        });

        return () => {
            socket.off('receive_message');
        };
    }, []);

    useEffect(() => {
        const userId = JSON.parse(localStorage.getItem('user') || '{}').id;

        socket.emit("request_main");

        const handleMainUpdate = (data: any) => {
            console.log(data);

            console.log('Main reçue:', data.main[0].owner);
            const mainUser = data.main.filter((item: any) => item.owner == userId)
            console.log('Main currentUser : ', mainUser[0]);

            setMain(mainUser[0]);
        };

        socket.on('main', handleMainUpdate);

        return () => {
            socket.off('main', handleMainUpdate);
        };
    }, []);

    // Utilisez un autre useEffect pour observer les changements dans `main` et émettre l'événement 'updateHand'
    useEffect(() => {
        if (main && main.cards.length > 0) {
            const userId = JSON.parse(localStorage.getItem('user') || '{}').id;


            socket.emit("updateHand", { hand: main, userId: userId });
            console.log({ updatedHand: main });
        }


    }, [main]);

    const submitCard = (card: any) => {
        console.log({ card: card });

        socket.emit('sendCard', { card });

        setMain((prevMain: any) => {
            // Filtrer la carte du tableau des cartes
            const updatedCards = prevMain.cards.filter((c: any) => c !== card);

            // Retourner un nouvel objet "main" avec les cartes mises à jour
            return { ...prevMain, cards: updatedCards };
        });
    };


    // useEffect(() => {
    //     const userId = JSON.parse(localStorage.getItem('user') || '{}').id;

    //     // Émettez la demande de la main lorsque le composant est monté
    //     socket.emit("request_main");

    //     // Écoutez la réponse de la main
    //     socket.on('main', (data) => {
    //         console.log('Main reçue:', data.main[0].owner);
    //         const mainUser = data.main.filter((item : any) => item.owner == userId)

    //         setMain(mainUser[0].cards);

    //     });

    //     return () => {
    //         // Retirez l'écouteur lors du démontage du composant
    //         socket.off('main');
    //     };
    // }, []);

    // const submitCard = (card: any) => {
    //     console.log({ card: card });

    //     // Émettez la carte au serveur
    //     socket.emit('sendCard', { card });

    //     // Mettez à jour la liste main en excluant la carte sur laquelle vous avez cliqué
    //     setMain((prevMain) => prevMain.filter((c) => c !== card));

    //     // Utilisez la valeur passée par la fonction de rappel de setMain
    //     setMain((updatedMain) => {
    //         // Maintenant, console.log(updatedMain) devrait afficher la valeur mise à jour
    //         console.log(updatedMain);

    //         // Émettre l'événement 'updateHand' avec la valeur mise à jour
    //         socket.emit("updateHand", updatedMain);

    //         // Retournez la nouvelle valeur de main
    //         return updatedMain;
    //     });
    // };





    return (
        <>
            <section id="game_container">
                <div className="game">
                    <div className="cartesPosees"></div>
                    {/* JEU */}
                    <div id='miseEnJeu'>
                        <div className="listes">
                            <div className="card"></div>
                            <div className="card"></div>
                            <div className="card"></div>
                            <div className="card"></div>
                            <div className="card"></div>
                        </div>
                        <div className="listes">
                            <div className="card"></div>
                            <div className="card"></div>
                            <div className="card"></div>
                            <div className="card"></div>
                            <div className="card"></div>
                        </div>
                        <div className="listes">
                            <div className="card"></div>
                            <div className="card"></div>
                            <div className="card"></div>
                            <div className="card"></div>
                            <div className="card"></div>
                        </div>
                        <div className="listes">
                            <div className="card"></div>
                            <div className="card"></div>
                            <div className="card"></div>
                            <div className="card"></div>
                            <div className="card"></div>
                        </div>
                    </div>

                </div>
                {/* MAIN */}
                <div className="hand_container">
                    {main.cards.map((card: any, index: number) => (
                        <div key={index} className="card cardInHand" onClick={() => submitCard(card)}>
                            <img className="images" src={`/cards/${card.identifiant}.svg`} alt={`Card ${card.identifiant}`} />
                            <p>Identifiant: {card.identifiant}</p>
                            <p>Boeuf: {card.nbBoeuf}</p>
                        </div>
                    ))}
                </div>


            </section>
            {/* CHAT */}
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
                        ref={inputRef}
                    />
                    <button>Send</button>
                </form>
            </section>
        </>
    );


};

export default Partie;
