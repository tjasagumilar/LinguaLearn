import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container, Row, Col, ProgressBar } from 'react-bootstrap';
import './SeznamNalog.css';
import { FaLanguage, FaImages, FaRandom } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import slika1 from './1.svg';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


interface ExerciseCardProps {
  difficulty: string;
  imageSrc: string;
}



const ExerciseCard: React.FC<ExerciseCardProps> = ({ difficulty, imageSrc }) => {

  const navigate = useNavigate();



  const handleClick = () => {
    navigate('/generirajNaloge');
  };

  return (
    <Row className="mb-5 justify-content-center">

      <Col xs={12} sm={10} md={8} lg={8}>
        <Card>
          <Card.Header className={`CardS text-white text-left py-3`}>TEŽAVNOST:  {difficulty}</Card.Header>
          <Card.Img variant="top" src={imageSrc} style={{ maxHeight: '400px', objectFit: 'cover' }} className="mx-auto d-block" />
          <Card.Footer className="p-3">
          <Container className={`ConS rounded p-3 text-center`}>

              <ProgressBar now={60} className="mb-2"  />
            <br></br>

              <button className="btn first" onClick={handleClick} >
              Začni
                </button>
             
            </Container>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
};



const SeznamNalog = () => {

  const [rank, setRank] = useState('Raziskovalec')  


  const { transcript, resetTranscript } = useSpeechRecognition();

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    console.log("Browser doesn't support speech recognition.");
    return null;
  }

  const startListening = (): void => SpeechRecognition.startListening({ continuous: true, language: 'de-DE' });

  console.log(transcript);
  return (
    <div style={{ paddingTop: '20px' }}>
      <Container>

        {rank === 'Začetnik' && 
          <ExerciseCard difficulty={"Začetnik"} imageSrc={slika1}  />}
        {rank === 'Raziskovalec' && 
          <ExerciseCard difficulty={"Raziskovalec"} imageSrc={slika1}  />}
        {rank === 'Pustolovec' && 
          <ExerciseCard difficulty={"Pustolovec"} imageSrc={slika1}  />}
        {rank === 'Prvak' && 
          <ExerciseCard difficulty={"Prvak"} imageSrc={slika1} />}

       
      </Container>
    </div>
  );
};

export default SeznamNalog;