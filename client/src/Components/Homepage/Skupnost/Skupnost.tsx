import { Container, Row, Col } from "react-bootstrap";
import skupnost from "../../../Assets/skupnost.png"

const Skupnost = () => {
    return (
        <div className="vsebina col-12">
            <Row className="col-10">

                <Col className=" col-12 col-lg-6 col-xl-5">
                    <h3 className="naslov-vsebina">
                        Povezovanje med uporabniki
                    </h3>
                    <div className="opis-vsebina">
                        Povezujte se z drugimi uporabniki, ki se učijo
                        istega jezika kot vi, in izboljšajte<br/> svoje veščine
                        z interaktivnimi izzivi, klepeti in skupinskim delom.
                    </div>
                </Col>
                <Col className=" col-12 col-lg-6 col-xl-5">
                    <img src={skupnost}></img>
                </Col>
            </Row>
        </div>
    );

    /*
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
    */
}

export default Skupnost;