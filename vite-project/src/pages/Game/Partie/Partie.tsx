import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './Partie.css';

const Partie: React.FC = () => {
    const socket = io('http://localhost:5000/');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<{ username: string; message: string }[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);

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
    }, [socket]);


    return (
        <>
            <section id="game_container">
                <div className="game"></div>
                <div className="hand_container">
                    <div className="card"></div>
                    <div className="card"></div>
                    <div className="card"></div>
                    <div className="card"></div>
                    <div className="card"></div>
                    <div className="card"></div>
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
