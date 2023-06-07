import { Button, Col, Modal, Row } from "react-bootstrap";
import { useLocation, useNavigate } from 'react-router-dom';
import "./Vec.css";
import { auth } from "../../../Config/firebase";
import { useState, useEffect } from "react";
import Progress from "../Progress/Progress";
import { BASE_URL } from "../../../api";
import { ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'


const Vec = () => {
    const [show, setShow] = useState(false);
    const [xp, setXP] = useState(0); // State to store the xp value
    const [jeziki, setJeziki] = useState([]);
    const [xpDummy, setXpDummy] = useState<number>(0);
    const [difficulty, setDifficulty] = useState<string>()


    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                fetch(`${BASE_URL}/mojijeziki?uid=${user.uid}`)
                    .then(response => response.json())
                    .then(data => {
                        setJeziki(data);
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
                        setXpDummy(data.xpDummy);
                        setDifficulty(data.tezavnost)
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        });
    }, [xpDummy, difficulty])


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
            default:
                languageName = '';
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

                fetch(`${BASE_URL}/odstranijezik`, {
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
                            <img src={path} alt="Language" />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md>
                        <div className="podatki-jezik">
                            <div> {getLanguageName(language)} <br /> {nivo}
                                <Progress />
                                Stopnja: {difficulty}
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className="progress-container2">
                    <ProgressBar striped animated now={xpDummy} max={300} className="col-12 col-sm-6 col-md-4 col-lg-2" />
                    <br></br>
                </div>
                <Row className="gumbi-jeziki">
                    <Col className="gumbi-col-naloge">
                        <a href={`/generirajNaloge?language=${language}`}><Button className="gumb-naloge">Naloge </Button></a>
                    </Col>
                    <Col className="gumbi-col-besede">
                        <a href={`/mojebesede?language=${language}`}><Button className="gumb-besede">Besede</Button></a>
                    </Col>
                </Row>
                <Row >
                    <Col md className="odstrani-ikona">
                        <FontAwesomeIcon className="ikona-odstrani" icon={faTrashCan} size="lg" style={{ color: "#fa9746", }} onClick={handleShow} />
                    </Col>
                </Row>
            </div>


            <div className="napredek-container">

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
