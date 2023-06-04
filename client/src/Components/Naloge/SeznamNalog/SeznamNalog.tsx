import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container, Row, Col, ProgressBar } from 'react-bootstrap';
import './SeznamNalog.css';
import { FaLanguage, FaImages, FaRandom } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import slika1 from './1.svg';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { auth } from '../../../Config/firebase';

const SeznamNalog = () => {

  const [rank, setRank] = useState('Raziskovalec');  
  const [uid, setUid] = useState('');
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
 //  const language = "de"

 /*
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/generirajNaloge');
  };

  const naloziTezavnost = (uid: string) => {
    fetch(`http://localhost:4000/getRank?uid=${uid}&language=${"de"}`) 
      .then(response => response.json())
      .then(data => setRank(data.rank))
      .catch(error => console.error(error));
  }

  useEffect(() => {
    auth.onAuthStateChanged(user => {
        if (user) {
            setUid(user.uid);
            naloziTezavnost(user.uid)
            console.log(rank)
        }
    });
  }, []);

  useEffect(() => {
    console.log(rank); // This will log whenever rank changes
}, [rank]);
*/
  return (
    <div style={{ paddingTop: '20px' }}>
      <Container>
        <Row className="mb-5 justify-content-center">
          <Col xs={12} sm={10} md={8} lg={8}>
            <Card>
              <Card.Header className={`CardS text-white text-left py-3`}>TEŽAVNOST:  {rank}</Card.Header>
              <Card.Img variant="top" src={slika1} style={{ maxHeight: '400px', objectFit: 'cover' }} className="mx-auto d-block" />
              <Card.Footer className="p-3">
                <Container className={`ConS rounded p-3 text-center`}>
                  <ProgressBar now={60} className="mb-2"  />
                  <br></br>
                  <button className="btn first" >
                    Začni
                  </button>
                </Container>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SeznamNalog;