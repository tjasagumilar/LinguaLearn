import { useEffect, useState } from "react";
import { auth } from "../../../Config/firebase";
import { useLocation } from "react-router";
import "./Progress.css"

const Progress = () => {
    const [xp, setXp] = useState(0);
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const language = queryParams.get('language');

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                fetch(`${process.env.REACT_APP_BACKEND_URL}/pridobiXp?uid=${user.uid}&language=${language}`)
                    .then(response => response.json())
                    .then(data => {
                        setXp(data.xp);
                        
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        });
    }, []);
    
    return (
    <div className="xp-box">
        {xp} XP
    </div>);
}

export default Progress;