import React, { useState } from "react";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import './Chat.css';

function ChatNavigation() {
    const [currentChatRoom, setCurrentChatRoom] = useState(""); // Track the current chat room

    const handleChatRoomChange = (chatRoom) => {
        setCurrentChatRoom(chatRoom); // Update the current chat room
    };

    return (
        <nav className="ChatNavigation">
            <ul>
                <li>
                    <button onClick={() => handleChatRoomChange("room1")}>Room 1</button>
                </li>
                <li>
                    <button onClick={() => handleChatRoomChange("room2")}>Room 2</button>
                </li>
                <li>
                    <button onClick={() => handleChatRoomChange("room3")}>Room 3</button>
                </li>
            </ul>
        </nav>
    );
}

export default ChatNavigation;
