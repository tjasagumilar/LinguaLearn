import { Container, Row, Col } from "react-bootstrap";
import skupnost from "../../../Assets/skupnost.png"

const Skupnost = () => {
    return (
        <Container className="homepage">
            <Row>
                <Col className="vsebina">
                    <h3 className="naslov-vsebina">
                        Povezovanje med uporabniki
                    </h3>
                    <div className="opis-vsebina">
                        Povezujte se z drugimi uporabniki, ki se učijo
                        istega jezika kot vi, in izboljšajte svoje veščine
                        z interaktivnimi izzivi, klepeti in skupinskim delom.
                    </div>
                </Col>
                <Col className="vsebina">
                    <div className="slika-vsebina">
                        <img src={skupnost} ></img>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Skupnost;