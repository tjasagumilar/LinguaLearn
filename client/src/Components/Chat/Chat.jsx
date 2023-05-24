import React from "react";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth} from "../../Config/firebase";
import Signin from "../Prijava/Signin/Signin";
import ChatRoom from "./ChatRoom/ChatRoom";
import './Chat.css';


function Chat() {
    return (
        <div className="App">
            <header>
                <h1>
                  <span role="img" aria-label="speech balloon">
                    💬
                  </span>
                </h1>
            </header>

            <section>
                <ChatRoom/>
            </section>
        </div>
    );
}

export default Chat;