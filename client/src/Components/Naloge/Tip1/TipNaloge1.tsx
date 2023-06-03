import React, { useEffect, useRef, useState } from 'react';
import './TipNaloge1.css';
import { Exercise } from '../Exercises/Exercises';
import { Container, Row, Col, Button, Modal, Badge, Card } from 'react-bootstrap';
import jsonIcon from './female-avatar.json';
import Lottie from 'lottie-react';
import { BsFillVolumeUpFill } from 'react-icons/bs';
import { useLocation } from 'react-router-dom';

interface TipNaloge1Props {
  exercise: Exercise;
  uid: string;
  document: string;
  onCheck: () => void;
}

const TipNaloge1 = ({ exercise,uid, document, onCheck }: TipNaloge1Props) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [translation, setTranslation] = useState<string>();
  const [audioSource, setAudioSource] = useState<string>(`http://localhost:4000/tts?tts=${exercise.sentence}`);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [availableWords, setAvailableWords] = useState<string[]>(exercise.availableWords)



  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const language = queryParams.get('language');
  
  
  useEffect(() => {
    setAudioSource(prevAudioSource => {
        const newAudioSource = `http://localhost:4000/tts?tts=${encodeURIComponent(exercise.sentence)}`;
        if (prevAudioSource !== newAudioSource) {
            if (audioRef.current) {
                audioRef.current.load();
            }
            return newAudioSource;
        }
        return prevAudioSource;
    });
}, [exercise.sentence]);


  const handleWordClickAvailable = (word: string) => {
    setAvailableWords((prevWords) => prevWords.filter((w) => w !== word));
    setSelectedWords((prevSelected) => [...prevSelected, word]);
  };


  const handleWordClickSelected = (word: string) => {
    setAvailableWords((prevSelected) => [...prevSelected, word]);
    setSelectedWords((prevWords) => prevWords.filter((w) => w !== word));
  };

  const handleCheck = () => {
    const selectedSentence = selectedWords.join(' ');
    console.log(selectedSentence)

    fetch(`http://localhost:4000/prevedi/${language}/${selectedSentence}`)
      .then((response) => response.json())
      .then(async (data) => {
        const translation = data;
        setTranslation(translation)
        setSelectedWords([]);
        console.log("xx")
        console.log(translation)
        console.log(exercise.sentence)
        const isAnswerCorrect = exercise.sentence === translation;

        if(isAnswerCorrect){
          await updateCorrectSolved(uid, document)
        }
        setIsCorrect(isAnswerCorrect);
        setShowModal(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const updateCorrectSolved = async (uid: string, document: string) => {
    try {
      const response = await fetch('http://localhost:4000/solvedCorrect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: uid, document: document, language: language}),
      });
  
      if (response.ok) {
      } else {
        throw new Error('Error: ' + response.status);
      }
    } catch (error) {
      console.error('Error: ' + error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    onCheck();
  };

  const handleSkip = () => {
    setShowModal(true);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
    <Container className="p-3 rounded bg-white text-dark w-100" style={{ maxWidth: '900px' }}>
    <Row className="align-items-center">
  <Col md={6}>
    <h4 className="mb-0 font-weight-bold">Napiši poved v Slovenščini</h4>
  </Col>
</Row>
<Row className="mt-3 align-items-center">
  <Col xs={6} md={3} lg={3} xl={3}>
    <Lottie animationData={jsonIcon} loop={true} autoplay={true} style={{ width: "100%", height: "100%" }} />
  </Col>
  <Col xs={6} md={9} lg={9} xl={9}>
    <div className="bubble">
      <Button
        onClick={() => audioRef.current && audioRef.current.play()}
        className="buttonZvok mb-3 custom-button" 
      >
        <BsFillVolumeUpFill style={{ fontSize: '44px', color: 'blue' }} />
      </Button>
      <div className="text-container">
      <h4 className="mb-0 font-weight-bold">{exercise.sentence}</h4>
      </div>
    </div>
  </Col>
</Row>




<audio ref={audioRef} style={{ display: 'none' }}>
      <source src={audioSource} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
    <div className="border-bottom my-3"></div>

    <Row style={{ height: '50px', overflow: 'auto' }} className="mt-2 justify-content-left">
  <Col md={8}>
    {selectedWords.map((word, index) => (
      <Badge pill key={index} onClick={() => handleWordClickSelected(word)} className="my-badge-tip-naloge1_1 m-1 p-1 rounded">
        {word}
      </Badge>
    ))}
  </Col>
</Row>


    <div className="border-bottom my-3"></div>

    <Row className="mt-2">
    <h5 className="mb-0 font-weight-bold">Razpoložljive besede:</h5>
    <br></br>  <br></br>
      <Col md={8}>

        {availableWords.map((word, index) => (
          <Badge pill key={index} onClick={() => handleWordClickAvailable(word)} className="my-badge-tip-naloge1_1 m-1 p-1 rounded">
            {word}
          </Badge>
        ))}
      </Col>
    </Row>


  </Container>

  <div className="fixed-bottom">
  <div className="container-fluid">
    <div className="upper-line"></div>
    <Row className="align-items-center">
    <Col xs={2} sm={2} md={2} lg={2} xl={2} className="text-center mb-2 mb-sm-2"></Col>
      <Col xs={2} sm={2} md={2} lg={2} xl={2} className="text-center">
        <Button onClick={handleSkip}className="btn first w-60 d-flex align-items-center justify-content-center">
          <span className="btn-text">Preskoči</span>
        </Button>
      </Col>
      <Col xs={2} sm={2} md={4} lg={4} xl={4} className="text-center mb-2 mb-sm-0 "></Col>
      <Col xs={2} sm={2} md={2} lg={2} xl={2} className="text-center">
        <Button onClick={handleCheck} className="btn first w-60 d-flex align-items-center justify-content-center">
          <span className="btn-text">Preveri</span>
        </Button>
      </Col>
      <Col xs={2} sm={2} md={2} lg={2} xl={2} className="text-center mb-2 mb-sm-0"></Col>
    </Row>
  </div>
</div>









<Modal 
    show={showModal} 
    onHide={handleCloseModal}
    dialogClassName="custom-modal-dialog"
    contentClassName={isCorrect ? "custom-modal-content-correct" : "custom-modal-content-wrong"}
>
    <Modal.Header closeButton>
        <Modal.Title>{isCorrect ? 'Pravilen odgovor!' : 'Napačen odgovor! '}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        {isCorrect ? 'Pravilno!' : `Pravilen odgovor je "${exercise.resitev}"`}
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
            Zapri
        </Button>
    </Modal.Footer>
</Modal>



    </form>



  );
};

export default TipNaloge1;