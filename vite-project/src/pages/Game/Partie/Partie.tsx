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
    const [choisi, setChoisi] = useState<any>(false);
    const [fini, setFini] = useState<any>(false);
    const [choixLigne, setChoixLigne] = useState<any>(false);
    const [compteur, setCompteur] = useState<number>(0);
    const [score, setScore] = useState<any>();
    const [winner, setWinner] = useState<any>();



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
        console.log({ nbJoueurs: data });

    });

    useEffect(() => {
        socket.on("doitChoisir", data => {
            console.log(data);
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            if (data.id == user.id) {
                setChoixLigne(true);
                console.log(choixLigne);

            }

        });

        return () => {
            socket.off('doitChoisir');
        };
    })


    useEffect(() => {
        socket.on("miseEnJeu", data => {
            setMiseEnJeu(data);
            setChoisi(false);
        });

        return () => {
            socket.off('miseEnJeu');
        };
    }, [])



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

            // data.main.forEach(main => {
            //     if (main.cards.length == 0) {
            //         socket.emit("generateNewPack", userId)
            //         setCompteur(compteur + 1);
            //         console.log(compteur);
            //     } else {
            //         setCompteur(0);
            //     }
            // });

            data.main.forEach(main => {
                if (main.cards.length == 0 && main.owner == userId) {
                    socket.emit("generateNewPack", userId)
                    setCompteur(compteur + 1);
                    console.log(compteur);
                } else {
                    setCompteur(0);
                }
            });

            if (compteur != 0) {
                // setFini(true);
                socket.emit("generateNewPack", userId)
                window.location.reload();
            }

            const mainUser = data.main.filter((item: any) => item.owner == userId)

            setMain(mainUser[0]);
        };

        socket.on('main', handleMainUpdate);

        return () => {
            socket.off('main', handleMainUpdate);
        };
    }, []);


    useEffect(() => {
        socket.on("CestFini", data => {
            setFini(true);
            setWinner(data);
            console.log({ winner: data });

        })
    })

    useEffect(() => {
        const userId = JSON.parse(localStorage.getItem('user') || '{}').id;

        socket.on("afficheScore", data => {
            if (data.userId == userId) {
                setScore(data.score);
                console.log({ score: data.score });

                if (score >= 30) {
                    socket.emit("finDeGame");
                }
            }
        })
    })

    if (score >= 30) {
        socket.emit("finDeGame");
    }

    // Utilisez un autre useEffect pour observer les changements dans `main` et émettre l'événement 'updateHand'
    useEffect(() => {
        if (main && generated) {
            const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
            setChoisi(true);

            socket.emit("updateHand", { hand: main, userId: userId });
        }
        else if (main && main.cards.length > 0) {
            const userId = JSON.parse(localStorage.getItem('user') || '{}').id;

            socket.emit("updateHand", { hand: main, userId: userId });
        }


    }, [main]);

    const submitCard = (card: any) => {
        const userId = JSON.parse(localStorage.getItem('user') || '{}').id;

        if (!choisi && !choixLigne) {
            setGenerated(true);
            console.log({ card: card });

            socket.emit('sendCard', { card: card, userId: userId });



            setMain((prevMain: any) => {
                // Filtrer la carte du tableau des cartes
                const updatedCards = prevMain.cards.filter((c: any) => c !== card);

                // Retourner un nouvel objet "main" avec les cartes mises à jour
                return { ...prevMain, cards: updatedCards };
            });
        }
    };

    const submitLigne = (index: any) => {
        if (choixLigne) {
            console.log({ index: index });
            socket.emit('choixLigne', index);
            setChoixLigne(false);
            console.log({ choixLigne: choixLigne });

        }
    };

    const reloadPage = () => {
        setCompteur(0);
        window.location.reload();
    }





    return (
        <>
            <section id="game_container">
                {fini ? (
                    <>
                        <span>La partie est finie</span>
                        <p>Le gagnant est : {JSON.stringify(winner)}</p>
                    </>
                ) : (
                    <>
                        <div className="game">
                            <span>Votre score : {score}</span>
                            {choixLigne ? (
                                <><div><span>Veuillez choisir une ligne</span></div></>
                            ) : (
                                <><span></span></>
                            )}

                            {compteur != 0 ? (
                                <>
                                    <button onClick={reloadPage}>
                                        Redistribuer des cartes
                                    </button>
                                </>

                            ) : (
                                <></>
                            )}
                            <div className="cartesPosees"></div>
                            {/* JEU */}
                            <div id='miseEnJeu'>
                                {miseEnJeu ? (miseEnJeu.map((liste: any, index: any) => (
                                    <div key={index} className="listes" onClick={() => submitLigne(index)}>
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
                    </>
                )}


            </section>
            {/* CHAT */}
            <section id="chat">
                <span>Nombre de joueurs : {nbJoueurs}</span>

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
