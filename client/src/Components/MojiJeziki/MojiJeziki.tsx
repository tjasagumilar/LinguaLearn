import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { auth } from "../../Config/firebase";
import "./MojiJeziki.css";

const MojiJeziki = () => {
    const [jeziki, setJeziki] = useState([{ jezik: '', naziv: '', nivo: '', path: '' }]);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                //setUid(user.uid);
                fetch(`http://localhost:4000/mojijeziki?uid=${user.uid}`)
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

    return (
        <div className="jeziki-container">
            <a href="/izberijezik"><Button className="dodaj-jezik">Dodaj jezik</Button></a>
            <div>
                {jeziki.map((item) => (
                    <Row className="kartice-jezikov">
                        <Col>
                            <div className="kartica col-sm-11 col-md-8 col-lg-7 col-xxl-5">
                                <div className="zastava col-12 col-sm-6 col-lg-5">
                                    <img src={item.path}></img>
                                </div>
                                <div className="podrobnosti col-12 col-sm-6 col-lg-7">
                                    <div> {item.naziv} - {item.nivo} </div>
                                    <div className="gumbi">
                                        <a href={`/naloge?language=${item.jezik}`}><Button>Naloge</Button></a>
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
}

export default MojiJeziki;