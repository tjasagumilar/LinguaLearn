import { useState } from "react";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import ChatRoom from "./ChatRoom/ChatRoom";
import './Chat.css';

function Chat() {
    const [selectedChat, setSelectedChat] = useState("general");

    const handleChatChange = (event) => {
        setSelectedChat(event.target.value);
    };

    const chatComponents = {
        general: { languageCode: 'General', name: "Splošni Klepet 💬" },
        hr: { languageCode: 'Cro', name: "Hrvaščina 💬" },
        en: { languageCode: 'Eng', name: "Angleščina 💬" },
        fi: { languageCode: 'Fin', name: "Finščina 💬" },
        fr: { languageCode: 'Fre', name: "Francoščina 💬" },
        de: { languageCode: 'Ger', name: "Nemščina 💬" },
        hu: { languageCode: 'Hun', name: "Madžarščina 💬" },
        it: { languageCode: 'Ita', name: "Italijanščina 💬" },
        ja: { languageCode: 'Jap', name: "Japonščina 💬" },
        no: { languageCode: 'Nor', name: "Norveščina 💬" },
        pt: { languageCode: 'Por', name: "Portugalščina 💬" },
        ru: { languageCode: 'Rus', name: "Ruščina 💬" },
        sp: { languageCode: 'Spa', name: "Španščina 💬" },
        sv: { languageCode: 'Swe', name: "Švedščina 💬" },
    };

    const selectedChatLanguageCode = chatComponents[selectedChat].languageCode;
    const chatName = chatComponents[selectedChat].name;

    return (
        <div className="App">
            <header className="klepet">
                <h1>
                    <span role="img" aria-label="speech balloon">
                        {chatName}
                    </span>
                </h1>
            </header>

            <div className="chat-selection">
                <label htmlFor="chat-select">Izberite klepetalnico: </label>
                <select id="chat-select" value={selectedChat} onChange={handleChatChange}>
                    <option value="general">Splošni</option>
                    <option value="hr">Hrvaščina</option>
                    <option value="en">Angleščina</option>
                    <option value="fi">Finščina</option>
                    <option value="fr">Francoščina</option>
                    <option value="de">Nemščina</option>
                    <option value="hu">Madžarščina</option>
                    <option value="it">Italijanščina</option>
                    <option value="ja">Japonščina</option>
                    <option value="no">Norveščina</option>
                    <option value="pt">Portugalščina</option>
                    <option value="ru">Ruščina</option>
                    <option value="sp">Španščina</option>
                    <option value="sv">Švedščina</option>
                </select>
            </div>

            <section>
                <div className="chat-container">
                    {selectedChatLanguageCode ? (
                        <ChatRoom languageCode={selectedChatLanguageCode} />
                    ) : (
                        <ChatRoom />
                    )}
                </div>
            </section>
        </div>
    );
}

export default Chat;
