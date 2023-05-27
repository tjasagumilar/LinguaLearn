import { Button, Col, Container, Row } from "react-bootstrap";
import { auth } from "../../Config/firebase";
import "./Profil.css"
import { useEffect, useState } from "react";

const Profil = () => {
    const [username, setUsername] = useState('');
    const [ime, setIme] = useState('');
    const [priimek, setPriimek] = useState('');
    const [slika, setSlika] = useState('');
    const [path, setPath] = useState('');
    const [opis, setOpis] = useState('');

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
                        setOpis(data.opis);
                        setPath(require(`../../Assets/${data.slika}`));
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }

        });
    }, []);

    return (
        <div className="profil-container">
            <Row>
                <Col md>
                    <div>
                        <img src={path} />
                    </div>
                </Col>
            </Row>
            <Row>
                <Col md>
                    <div className="profil-podatki">
                        <div>{username}<br /> {ime} {priimek} <br/> {opis}</div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col md>
                    <div>
                        <a href="/uredi"><Button className="uredi-profil">Uredi profil</Button></a>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Profil;