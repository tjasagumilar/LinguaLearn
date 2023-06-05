import { Button, Col, Row } from "react-bootstrap";
import "./LessonComplete.css"
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import { auth } from "../../../Config/firebase";
import slika from "../../../Assets/win.jpg"

const LessonComplete = () => {
  const [xp, setXp] = useState(0);
  const [pravilne, setPravilne] = useState(0);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const uid = queryParams.get('uid');
  const document = queryParams.get('document');
  const lang = queryParams.get('language');
/*
  useEffect(() => {
    auth.onAuthStateChanged(user => {
        if (user) {
            //setUid(user.uid);
            
            fetch(`${process.env.REACT_APP_BACKEND_URL}/lessoncomplete?uid=${uid}&document=${document}&language=${lang}`)
                .then(response => response.json())
                .then(data => {
                  setXp(data.xp);
                  setPravilne(data.solvedRight);
                  
                })
                .catch(error => {
                    console.log(error);
                });
        }
    });
}, []);
*/
  return (
    <div className="complete-box">
      <Row className="col-12 col-sm-10 col-md-8 col-lg-5">
        <Col>
        <img src={slika}></img>
        </Col>
      </Row>
      <Row>
        <Col className="bravo">Bravo!</Col>
      </Row>
      <Row >
        <Col>{xp} xp</Col>
        <Col>{pravilne} / 10</Col>
      </Row>
     <Row>
      <Col>
      <Button>Nadaljuj</Button>
      </Col>
     </Row>
    </div>

  );
}

export default LessonComplete;

