import React, { useState } from "react";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../../Config/firebase";
import Signin from "../Prijava/Signin/Signin";
import ChatRoom from "./ChatRoom/ChatRoom";
import ChatRoomGer from "./ChatRoom/ChatRoomGer";
import ChatRoomSpa from "./ChatRoom/ChatRoomSpa";
import ChatRoomFre from "./ChatRoom/ChatRoomFre";
import ChatRoomAf from "./ChatRoom/ChatRoomAf";
import ChatRoomAlb from "./ChatRoom/ChatRoomAlb";
import ChatRoomAmh from "./ChatRoom/ChatRoomAmh";
import ChatRoomAra from "./ChatRoom/ChatRoomAra";
import ChatRoomArm from "./ChatRoom/ChatRoomArm";
import ChatRoomAze from "./ChatRoom/ChatRoomAze";
import ChatRoomBel from "./ChatRoom/ChatRoomBel";
import './Chat.css';

function Chat() {
    const [selectedChat, setSelectedChat] = useState("general");

    const handleChatChange = (event) => {
        setSelectedChat(event.target.value);
    };

    const chatComponents = {
        general: { component: <ChatRoom />, name: "General Chat 💬" },
        german: { component: <ChatRoomGer />, name: "German Chat 🇩🇪" },
        french: { component: <ChatRoomFre />, name: "French Chat 🇫🇷" },
        spanish: { component: <ChatRoomSpa />, name: "Spanish Chat 🇪🇸" },
        af: { component: <ChatRoomAf />, name: "Afrikaans Chat 🇿🇦" },
        sq: { component: <ChatRoomAlb />, name: "Albanian Chat 🇦🇱" },
        am: { component: <ChatRoomAmh />, name: "Amharic Chat 🇪🇹" },
        ar: { component: <ChatRoomAra />, name: "Arabic Chat 🇦🇪" },
        hy: { component: <ChatRoomArm />, name: "Armenian Chat 🇦🇲" },
        az: { component: <ChatRoomAze />, name: "Azerbaijani Chat 🇦🇿" },
        be: { component: <ChatRoomBel />, name: "Belarusian Chat 🇧🇾" },
    };

    const selectedChatComponent = chatComponents[selectedChat].component;
    const chatName = chatComponents[selectedChat].name;

    return (
        <div className="App">
            <header>
                <h1>
                    <span role="img" aria-label="speech balloon">
                        {chatName}
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
                            <option value="french">French</option>
                            <option value="spanish">Spanish</option>
                            <option value="af">Afrikaans</option>
                            <option value="sq">Albanian</option>
                            <option value="am">Amharic</option>
                            <option value="ar">Arabic</option>
                            <option value="hy">Armenian</option>
                            <option value="az">Azerbaijani</option>
                            <option value="be">Belarusian</option>
                        </select>
                    </div>

                    {selectedChatComponent}
                </div>
            </section>
        </div>
    );
}

export default Chat;
