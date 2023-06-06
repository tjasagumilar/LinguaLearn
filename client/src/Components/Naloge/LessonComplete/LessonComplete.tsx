import { Button, Col, Row } from "react-bootstrap";
import "./LessonComplete.css"
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import { auth } from "../../../Config/firebase";
import slika from "../../../Assets/win.jpg"
import { BASE_URL } from "../../../api";

const LessonComplete = () => {
  const [xp, setXp] = useState(0);
  const [pravilne, setPravilne] = useState(0);
  const [nivo, setNivo] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const uid = queryParams.get('uid');
  const document = queryParams.get('document');
  const lang = queryParams.get('language');


  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        //setUid(user.uid);

        fetch(`${BASE_URL}/lessoncomplete?uid=${uid}&document=${document}&language=${lang}`)
          .then(response => response.json())
          .then(data => {
            setXp(data.xp);
            setPravilne(data.solvedRight);
            setNivo(data.nivo);

          })
          .catch(error => {
            console.log(error);
          });
      }
    });
  }, []);


  return (
    <div className="complete-box">
      <Row className="col-12 col-sm-10 col-md-8 col-lg-5">
        <Col>
          <img src={slika}></img>
        </Col>
      </Row>
      <Row>
        <Col className="bravo col-12"><h3>Bravo!<span className="uspesno"> Uspešno ste rešili nalogo!</span></h3> </Col>
      </Row>
      <Row className="col-12">
        <Col className="xp col-12 col-sm-3">{xp} xp</Col>
        <Col className="pravilne col-12 col-sm-3">{pravilne} / 10</Col>
      </Row>
      <Row>
        <Col>
          <a href={`/vec?language=${lang}&nivo=${nivo}`}><Button>Nadaljuj</Button></a>
        </Col>
      </Row>
    </div>

  );
}

export default LessonComplete;

