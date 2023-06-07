import { Row, Col } from "react-bootstrap";
import ucenje from "../../../Assets/ucenje.png"

const Ucenje = () => {

    return (
        <div className="vsebina col-12">
            <Row className="col-10">
                <Col className=" col-12 col-lg-6 col-xl-5">
                    <img src={ucenje} alt="ucenje"></img>
                </Col>
                <Col className=" col-12 col-lg-6 col-xl-5">
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
        </div>
    );

}

export default Ucenje;