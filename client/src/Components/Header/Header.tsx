import "./Header.css"
import slika from "../../Assets/languages.png"
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../../Config/firebase";
import logging from "../../Config/logging";
import { Button, Container } from "react-bootstrap";
import { Col } from "reactstrap";
import Row from 'react-bootstrap/Row';


const Header = () => {

    const [uporabnik, setUporabnik] = useState<boolean>(false);
    const [displayName, setDisplayName] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                logging.info('User detected.');
                setDisplayName(user.displayName || 'upime');
                setUporabnik(true);
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
                            <a href="/registracija"><Button>Začni</Button></a>
                        </Col>
                        <Col><img src={slika}></img></Col>
                    </Row>
                </Container>
            </div>
        );
    }
};


export default Header;