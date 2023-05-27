import { auth } from "../../Config/firebase";
import "./Profil.css"
import { useEffect, useState } from "react";

const Profil = () => {
    const [username, setUsername] = useState('');
    const [ime, setIme] = useState('');
    const [priimek, setPriimek] = useState('');
    const [slika, setSlika] = useState('');
    const [path, setPath] = useState('');

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                //setUid(user.uid);
                fetch(`http://localhost:4000/uporabnik?uid=${user.uid}`)
                    .then(response => response.json())
                    .then(data => {
                        setIme(data.ime);
                        setPriimek(data.priimek);
                        setUsername(data.username);
                        setSlika(data.slika);
                        setPath(require(`../../Assets/${data.slika}`));
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }

        });
    }, []);

    return (
        <div className="profil-box">
            <div className="profil">
                <div className="uporabnik-box">
                    <div className="uporabnik">
                        <div className="uporabnik-slika">
                        <img src={path}/>
                        </div>
                        <div className="uporabnik-podatki">
                            <span>{username}</span>
                            <span>{ime} {priimek}</span>
                        </div>
                    </div>
                    <div className="uporabnik-uredi">
                        <a href="/uredi"><button>Uredi profil</button></a>
                    </div>
                </div>
                <div className="ostalo">
                </div>
            </div>
        </div>
    );
}

export default Profil;