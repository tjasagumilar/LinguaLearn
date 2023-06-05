import React, { useState, useEffect } from 'react';
import './LeaderBoard.css';
import { Button, Col, Modal, Row } from "react-bootstrap";
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, firestore } from "../../Config/firebase";
import Progress from "../MojiJeziki/Progress/Progress";

interface LeaderboardEntry {
    username: string;
    xp: number;
}


const LeaderBoard = () => {
    const [xp, setXP] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    const [photoURL, setPhotoURL] = useState('');
    const [username, setUsername] = useState('');
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const language = queryParams.get('language');

    const navigate = useNavigate();

    function getLanguageName(shortName: string | null) {
        let languageName;

        switch (shortName) {
            case 'en':
                languageName = 'Angleščina';
                break;
            case 'es':
                languageName = 'Španščina';
                break;
            case 'fr':
                languageName = 'Francoščina';
                break;
            case 'de':
                languageName = 'Nemščina';
                break;
            case 'it':
                languageName = 'Italijanščina';
                break;
            case 'fi':
                languageName = 'Finščina';
                break;
            case 'hr':
                languageName = 'Hrvaščina';
                break;
            case 'ru':
                languageName = 'Ruščina';
                break;
        }

        return languageName;
    }


    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                // Fetch leaderboard data from the server for the specific language
                fetch(`${process.env.REACT_APP_BACKEND_URL}/leaderboard?language=${language}`)
                    .then(response => response.json())
                    .then(data => {
                        setLeaderboardData(data);
                    })
                    .catch(error => {
                        console.log(error);
                    });

                fetch(`${process.env.REACT_APP_BACKEND_URL}/uporabnik?uid=${user.uid}`)
                    .then(response => response.json())
                    .then(data => {
                        setUsername(data.username);
                        setPhotoURL(require(`../../Assets/${data.slika}`));
                    })
                    .catch(error => {
                        console.log(error);
                    });

                fetch(`${process.env.REACT_APP_BACKEND_URL}/pridobiXp?uid=${user.uid}&language=${language}`)
                    .then(response => response.json())
                    .then(data => {
                        setXP(data.xp);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        });
    }, [language]);


    return (
        <div className="leaderboard-container">
            <h1 className="leaderboard">Vodilna Lestvica</h1>
            {/* Render leaderboard */}
            <div>
                <h2>Vodilna lestvica: {getLanguageName(language)}</h2>
                {Array.isArray(leaderboardData) && leaderboardData.length > 0 ? (
                    <ul>
                        {leaderboardData.map((item, index) => (
                            <li key={index}>
                                {item.username} - XP: {item.xp}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No leaderboard data available.</p>
                )}
            </div>
        </div>
    );
}
export default LeaderBoard;
