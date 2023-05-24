import { Container, Row, Col } from "react-bootstrap";
import napredek from "../../../Assets/napredek.png"

const Napredek = () => {

    return (
        <Container className="homepage">
            <Row>
                <Col className="vsebina">
                    <img src={napredek}></img>
                </Col>
                <Col className="vsebina">
                    <h3 className="naslov-vsebina">
                        Spremljanje napredka
                    </h3>
                    <div className="opis-vsebina">
                        Z našo aplikacijo lahko enostavno spremljaš svoj
                        napredek pri učenju jezika, da lahko vedno veš,
                        kako daleč si že prišel in kje se lahko še izboljšaš.
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Napredek;