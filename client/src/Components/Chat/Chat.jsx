import React, { useState } from "react";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../../Config/firebase";
import Signin from "../Prijava/Signin/Signin";
import ChatRoom from "./ChatRoom/ChatRoom";
import ChatRoomGer from "./ChatRoom/ChatRoomGer";
import './Chat.css';

function Chat() {
    const [selectedChat, setSelectedChat] = useState("general");

    const handleChatChange = (event) => {
        setSelectedChat(event.target.value);
    };

    let selectedChatComponent;

    if (selectedChat === "general") {
        selectedChatComponent = <ChatRoom />;
    } else if (selectedChat === "german") {
        selectedChatComponent = <ChatRoomGer />;
    }

    return (
        <div className="App">
            <header>
                <h1>
          <span role="img" aria-label="speech balloon">
            General Chat 💬
          </span>
                </h1>
            </header>

            <section>
                <div className="chat-container">
                    <div className="chat-selection">
                        <label htmlFor="chat-select">Select Chat Room: </label>
                        <select id="chat-select" value={selectedChat} onChange={handleChatChange}>
                            <option value="general">General</option>
                            <option value="german">German</option>
                        </select>
                    </div>

                    {selectedChatComponent}
                </div>
            </section>
        </div>
    );
}

export default Chat;
