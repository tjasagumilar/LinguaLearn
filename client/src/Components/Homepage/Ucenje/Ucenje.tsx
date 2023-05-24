import { Container, Row, Col } from "react-bootstrap";
import ucenje from "../../../Assets/ucenje.png"

const Ucenje = () => {

    return (
        <Container className="homepage">
            <Row>
                <Col className="vsebina">
                    <img src={ucenje}></img>
                </Col>
                <Col className="vsebina">
                <h3 className="naslov-vsebina">
                    Individualno prilagojeno učenje
                </h3>
                <div className="opis-vsebina">
                    Naučite se novega jezika ali izboljšajte svoje znanje s personaliziranim pristopom.
                    Naša aplikacija vam nudi različne vrste vsebine in aktivnosti za učenje jezika,
                    ki jih prilagajamo vašemu napredku in ciljem.
                </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Ucenje;