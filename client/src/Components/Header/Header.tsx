import "./Header.css"
import slika from "../../Assets/languages.png"
import { useState, useEffect } from "react";
import { auth } from "../../Config/firebase";
import logging from "../../Config/logging";
import { Button, Container } from "react-bootstrap";
import { Col } from "reactstrap";
import Row from 'react-bootstrap/Row';
import { BASE_URL } from "../../api";


const Header = () => {
    const [uporabnik, setUporabnik] = useState<boolean>(false);
    const [displayName, setDisplayName] = useState<string>('');

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                logging.info('User detected.');
                setUporabnik(true);
                setDisplayName(user.displayName || ' ');
                fetch(`${BASE_URL}/uporabnik?uid=${user.uid}`)
                    .then(response => response.json())
                    .then(data => {
                        setDisplayName(data.username);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                logging.info('No user detected.');
                setUporabnik(false);
            }
        });
    }, []);


    if (uporabnik) {
        return (
            <div className="head">
                <Container className="glava">
                    <Row>
                        <Col className="pozdravljeni">
                            <h1>Pozdravljeni, {displayName}</h1>
                            <p> Nadaljujte svoje jezikovno potovanje!</p>
                        </Col>
                        <Col><img src={slika}></img></Col>
                    </Row>
                </Container>
            </div>
        );
    } else {
        return (
            <div className="head">
                <Container className="glava">
                    <Row>
                        <Col className="pozdravljeni">
                            <h1>Vstopi v svet <br /> večjezičnosti!</h1>
                            <p>Pridruži se naši skupnosti učenja jezikov!</p>
                            <a className="zacni-button" href="/registracija"><Button>Začni</Button></a>
                        </Col>
                        <Col><img src={slika}></img></Col>
                    </Row>
                </Container>
            </div>
        );
    }
};


export default Header;