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
    const [currentUser, setCurrentUser] = useState(null);
    const [photoURL, setPhotoURL] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setCurrentUser(user);
                fetch(`http://localhost:4000/uporabnik?uid=${user.uid}`)
                    .then(response => response.json())
                    .then(data => {
                        setPhotoURL(require(`../../../Assets/${data.slika}`));
                        /*console.log('photoURL:', data.slika);*/
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (currentUser) {
            const { photoURL: avatar } = currentUser;
            if (avatar) {
                setPhotoURL(avatar);
            }
        }
    }, [currentUser]);

    const sendMessage = async (e) => {
        e.preventDefault();

        const { uid } = currentUser;

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
                        currentUser={currentUser}
                    />
                ))}
                <span ref={dummy}></span>
            </main>
            <form onSubmit={sendMessage}>
                <input
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    placeholder="povej nekaj lepega..."
                />
                <button type="submit" disabled={!formValue}>✉️</button>
            </form>
        </>
    );
}

function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;
    const { currentUser } = props;
    const messageClass = uid === currentUser?.uid ? 'sent' : 'received';

    const imageSource = photoURL || (currentUser?.photoURL) || 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png';

    /*console.log('photoURL in ChatMessage:', photoURL); // Add this console log to check the value*/

    return (
        <div className={`message ${messageClass}`}>
            <img
                className="chatimg"
                src={imageSource}
                alt={imageSource} // Modify the alt attribute to use the image source
            />
            <p>{text}</p>
        </div>
    );
}

export default ChatRoom;
