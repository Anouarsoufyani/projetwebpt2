import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './Partie.css';

const Partie: React.FC = () => {
    const socket = io('http://localhost:5000/');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<{ username: string; message: string }[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('Message', message);
        socket.emit('send_message', { username: user.username, message });
    };

    useEffect(() => {
        socket.on('receive_message', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.off('receive_message');
        };
    }, [socket]);

    return (
        <>
            <section id="game_container">

            </section>
            <section id="chat">
                <div id='messages'>
                    {messages.map((messageData, index) => (
                        <p key={index}>
                            <span className="message-owner">{messageData.username}:</span> {messageData.message}
                        </p>
                    ))}
                </div>
                <form className='home__container' onSubmit={handleSubmit}>
                    <h2 className='home__header'>Sign in to Open Chat</h2>
                    <input
                        type='text'
                        minLength={6}
                        name='username'
                        id='username'
                        className='username__input'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button>Send</button>
                </form>
            </section>
        </>
    );
};

export default Partie;
