import React, { useRef, useState, useEffect } from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, firestore } from "../../../Config/firebase";
import '../Chat.css';

function ChatRoom({ languageCode }) {
    const dummy = useRef(null);
    const messagesRef = firestore.collection(`messages${languageCode}`);
    const query = messagesRef.orderBy('createdAt').limit(25);

    const [messages] = useCollectionData(query, { idField: 'id' });

    const [formValue, setFormValue] = useState('');
    const [currentUser, setCurrentUser] = useState(null); // Added state variable

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setCurrentUser(user); // Set the current user
            }
        });

        return () => unsubscribe(); // Cleanup the event listener
    }, []);

    const sendMessage = async (e) => {
        e.preventDefault();

        const { uid, photoURL } = currentUser; // Use the current user

        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL
        });

        setFormValue('');
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <main>
                {messages && messages.map(msg => (
                    <ChatMessage
                        key={msg.id}
                        message={msg}
                        currentUser={currentUser} // Pass the current user to ChatMessage
                    />
                ))}
                <span ref={dummy}></span>
            </main>
            <form onSubmit={sendMessage}>
                <input
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    placeholder="say something nice..."
                />
                <button type="submit" disabled={!formValue}>✉️</button>
            </form>
        </>
    );
}

function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;
    const { currentUser } = props; // Get the current user from props
    const messageClass = uid === currentUser.uid ? 'sent' : 'received';

    return (
        <>
            <div className={`message ${messageClass}`}>
                <img
                    className={'chatimg'}
                    src={photoURL || currentUser.photoURL || 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png'}
                    alt="👤"
                />
                <p>{text}</p>
            </div>
        </>
    );
}

export default ChatRoom;
