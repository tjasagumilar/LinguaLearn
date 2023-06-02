import React, { useState } from 'react';
import './LeaderBoard.css';
// import Profiles from './profiles';
// import { Leaderboard, LeaderboardData } from './database';

const LeaderBoard = () => {

    const [period, setPeriod] = useState<number>(0);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const id = parseInt(e.currentTarget.dataset.id || '0');
        setPeriod(id);
    };

/*
    const filteredLeaderboard: LeaderboardData[] = between(Leaderboard, period);
*/

    return (
        <div className="leaderboard-container">
            <h1 className="leaderboard">Vodilna Lestvica</h1>
            <div className="duration">
                <button onClick={handleClick} data-id="7">
                    7 Dni
                </button>
                <button onClick={handleClick} data-id="30">
                    30 Dni
                </button>
                <button onClick={handleClick} data-id="0">
                    Vseh časov
                </button>
            </div>
{/*
            <Profiles Leaderboard={filteredLeaderboard} />
*/}
        </div>
    );
}

/*
function between(data: LeaderboardData[], between: number): LeaderboardData[] {
    const today = new Date();
    const previous = new Date(today);
    previous.setDate(previous.getDate() - (between + 1));

    const filtered = data.filter((val) => {
        const userDate = new Date(val.dt);
        if (between === 0) return true;
        return previous <= userDate && today >= userDate;
    });

    // sort with descending order
    return filtered.sort((a, b) => b.score - a.score);
}
*/


export default LeaderBoard;
