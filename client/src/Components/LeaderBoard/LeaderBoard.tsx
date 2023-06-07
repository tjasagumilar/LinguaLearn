import React, { useState, useEffect } from 'react';
import './LeaderBoard.css';
import { useLocation } from 'react-router-dom';
import { auth, firestore } from "../../Config/firebase";
import { BASE_URL } from '../../api';

interface LeaderboardEntry {
    username: string;
    xp: number;
}

const LeaderBoard = () => {
    const [xp, setXP] = useState(0);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [photoURL, setPhotoURL] = useState('');
    const [username, setUsername] = useState('');
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const language = queryParams.get('language');

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setCurrentUser(user);
                fetch(`${BASE_URL}/uporabnik?uid=${user.uid}`)
                    .then(response => response.json())
                    .then(data => {
                        setPhotoURL(require(`../../Assets/${data.slika}`));
                        setUsername(data.username);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        });
    }, []);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                fetch(`${BASE_URL}/pridobiXpDummy?uid=${user.uid}&language=${language}`)
                    .then(response => response.json())
                    .then(data => {
                        setXP(data.xpDummy);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        });
    }, [language]);

    useEffect(() => {
        if (language) {
            const leaderboardRef = firestore.collection(`leaderboard${language}`);

            leaderboardRef.orderBy('xp', 'desc')
                .get()
                .then(snapshot => {
                    const data: LeaderboardEntry[] = [];
                    snapshot.forEach(doc => {
                        const entry = doc.data() as LeaderboardEntry;
                        data.push(entry);
                    });
                    setLeaderboardData(data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [language]);

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
        if (currentUser && language) {
            const leaderboardRef = firestore.collection(`leaderboard${language}`);

            leaderboardRef
                .doc(currentUser.uid)
                .set({
                    username: username,
                    xp: xp
                })
                .then(() => {
                    console.log("User data added to leaderboard collection.");
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [currentUser, username, xp, language]);

    return (
        <div className="leaderboard-container">
            <h1 className="leaderboard">Vodilna Lestvica</h1>
            <div>
                <h2>Vodilna lestvica: {getLanguageName(language)}</h2>
                {Array.isArray(leaderboardData) && leaderboardData.length > 0 ? (
                    <table>
                        <thead>
                        <tr>
                            <th>Username</th>
                            <th>XP</th>
                        </tr>
                        </thead>
                        <tbody>
                        {leaderboardData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.username}</td>
                                <td>{item.xp}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-data">No leaderboard data available.</p>
                )}
            </div>
        </div>
    );
}

export default LeaderBoard;
