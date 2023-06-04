import { Button, Col, Modal, Row } from "react-bootstrap";
import { useLocation, useNavigate } from 'react-router-dom';
import "./Vec.css";
import { auth } from "../../../Config/firebase";
import { useState } from "react";
import Progress from "../Progress/Progress";

const Vec = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const language = queryParams.get('language');
    const nivo = queryParams.get('nivo');
    const path = require(`../../../Assets/${language}.jpg`);

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

    const handleOdstrani = () => {

        auth.onAuthStateChanged(user => {
            if (user) {

                const formData = {
                    jezik: language,
                    uid: user.uid,
                };

                fetch('http://localhost:4000/odstranijezik', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                })
                    .then(response => {
                        if (response.status === 200) {
                            navigate('/jeziki');
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        });


    }

    return (
        <div>
            <div className="podatki-container">
                <Row>
                    <Col md>
                        <div>
                            <img src={path} />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md>
                        <div className="podatki-jezik">
                            <div> {getLanguageName(language)} <br /> {nivo} </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md>
                        <div>
                            <Button className="odstrani-jezik" onClick={handleShow}>Odstrani</Button>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="napredek-container">

                <Progress/>

            </div>

            <Modal show={show} onHide={handleClose} animation={false} >
                <Modal.Header closeButton>
                    <Modal.Title>Ali ste prepričani, da želite odstraniti jezik?</Modal.Title>
                </Modal.Header>
                <Modal.Body>Ves dosedanji napredek bo izgubljen.</Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose} className="modal-zapri">
                        Zapri
                    </Button>
                    <Button onClick={handleOdstrani} className="modal-odstrani">
                        Odstrani
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>


    );
}

export default Vec;