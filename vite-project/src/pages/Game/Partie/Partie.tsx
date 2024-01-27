/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './Partie.css';


const socket = io('http://localhost:5000/');


const Partie: React.FC = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<{ username: string; message: string }[]>([]);
    const [main, setMain] = useState<any>({ cards: [] });
    const [miseEnJeu, setMiseEnJeu] = useState<any>();
    const [nbJoueurs, setNbJoueurs] = useState<any>();
    const [generated, setGenerated] = useState<any>(false);



    const inputRef = useRef<HTMLInputElement | null>(null);

    // const { code } = useParams<{ code?: string }>();


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('Message', message);
        socket.emit('send_message', { username: user.username, message });
        setMessage('');  // Met à jour l'état pour vider l'input
    };

    socket.on("nbJoueurs", data => {
        setNbJoueurs(data);
        console.log(data);

    });




    socket.on("miseEnJeu", data => {
        setMiseEnJeu(data);
        console.log(miseEnJeu);

    })



    useEffect(() => {
        socket.on('receive_message', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.off('receive_message');
        };
    }, []);

    useEffect(() => {
        const userId = JSON.parse(localStorage.getItem('user') || '{}').id;

        socket.emit("request_main");

        const handleMainUpdate = (data: any) => {
            console.log({ data: data });

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
        if (main && generated) {
            const userId = JSON.parse(localStorage.getItem('user') || '{}').id;


            socket.emit("updateHand", { hand: main, userId: userId });
            console.log({ updatedHand: main });
        }
        else if (main && main.cards.length > 0) {
            const userId = JSON.parse(localStorage.getItem('user') || '{}').id;


            socket.emit("updateHand", { hand: main, userId: userId });
            console.log({ updatedHand: main });
        }


    }, [main]);

    const submitCard = (card: any) => {

        setGenerated(true);
        console.log({ card: card });

        socket.emit('sendCard', { card });

        setMain((prevMain: any) => {
            // Filtrer la carte du tableau des cartes
            const updatedCards = prevMain.cards.filter((c: any) => c !== card);

            // Retourner un nouvel objet "main" avec les cartes mises à jour
            return { ...prevMain, cards: updatedCards };
        });
    };






    return (
        <>
            <section id="game_container">
                <span>Nombre de joueurs : {nbJoueurs}</span>
                <div className="game">
                    <div className="cartesPosees"></div>
                    {/* JEU */}
                    <div id='miseEnJeu'>
                        {miseEnJeu ? (miseEnJeu.map((liste: any, index: any) => (
                            <div key={index} className="listes">
                                {liste.map((carte: any, carteIndex: any) => (
                                    <div key={carteIndex} className="card">
                                        <img className="images" src={`/cards/${carte.identifiant}.svg`} alt={`Card ${carte.identifiant}`} />
                                    </div>
                                ))}
                            </div>
                        ))) : (<span>pas de miseEnJeu</span>)}
                    </div>

                </div>
                {/* MAIN */}
                <div className="hand_container">
                    {main.cards.map((card: any, index: number) => (
                        <div key={index} className="card cardInHand" onClick={() => submitCard(card)}>
                            <img className="images" src={`/cards/${card.identifiant}.svg`} alt={`Card ${card.identifiant}`} />
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
