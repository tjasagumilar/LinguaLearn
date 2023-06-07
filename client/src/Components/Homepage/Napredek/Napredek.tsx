import { Container, Row, Col } from "react-bootstrap";
import napredek from "../../../Assets/napredek.png"

const Napredek = () => {

    return (
        <div className="vsebina col-12">
            <Row className="col-10">
                <Col className=" col-12 col-lg-6 col-xl-5">
                    <img src={napredek} alt="napredek"></img>
                </Col>
                <Col className=" col-12 col-lg-6 col-xl-5">
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
        </div>
    );

}

export default Napredek;