import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { auth } from "../../Config/firebase";
import "./MojiJeziki.css";
import { BASE_URL } from "../../api";
import plus from "../../Assets/plus.jpg";

const MojiJeziki = () => {
    const [jeziki, setJeziki] = useState([{ jezik: '', naziv: '', nivo: '', path: '' }]);

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
    /*
        return (
        <div className="jeziki-container">
            <a href="/izberijezik"><Button className="dodaj-jezik">Dodaj jezik</Button></a>
            <div>
                {jeziki.map((item) => (
                    <Row className="kartice-jezikov">
                        <Col>
                            <div className="kartica col-sm-11 col-md-8 col-lg-7 col-xxl-5">
                                <div className="zastava col-12 col-sm-6 col-lg-5">
                                    <img src={item.path} alt="zastava"></img>
                                </div>
                                <div className="podrobnosti col-12 col-sm-6 col-lg-7">
                                    <div> {item.naziv} - {item.nivo} </div>
                                    <div className="gumbi">

                                        <a href={`/vec?language=${item.jezik}&nivo=${item.nivo}`}><Button>Več</Button></a>

                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                ))}

            </div>
        </div>
    );
    */

    return (
        <div className="jeziki-container">
            <Row className="kartice-jezikov col-12 col-sm-12 col-lg-9">
                {jeziki.map((item) => (
                    <Col key={item.jezik} sm={6} md={5} lg={5} xl={4}>
                        <a href={`/vec?language=${item.jezik}&nivo=${item.nivo}`}>
                            <div className="kartica">
                                <div className="zastava">
                                    <img src={item.path} alt="zastava" />
                                </div>
                                <div className="podrobnosti">
                                    <div className="naziv">{item.naziv}</div>
                                </div>
                            </div>
                        </a>
                    </Col>
                ))}
                <Col sm={6} md={5} lg={5} xl={4}>
                    <a href="/izberijezik">
                        <div className="kartica dodaj-jezik">
                            <div className="zastava">
                                <img src={plus} alt="zastava" />
                            </div>
                        </div>
                    </a>
                </Col>
            </Row>
        </div >
    );

}

export default MojiJeziki;