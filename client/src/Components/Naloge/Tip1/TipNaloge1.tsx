import React, { useEffect, useRef, useState } from 'react';
import './TipNaloge1.css';
import { Exercise } from '../Exercises/Exercises';
import { Container, Row, Col, Button, Modal, Badge, Card } from 'react-bootstrap';
import jsonIcon from './female-avatar.json';
import Lottie from 'lottie-react';
import { BsFillVolumeUpFill } from 'react-icons/bs';

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
  const [initial, setInitial] = useState(exercise.availableWords);
  const [divs, setDivs] = useState(initial.map((_, index) => index));



  
  
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

    fetch(`http://localhost:4000/prevedi/${selectedSentence}`)
      .then((response) => response.json())
      .then(async (data) => {
        const translation = data.translation;
        setTranslation(translation)
        setSelectedWords([]);
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
        body: JSON.stringify({ uid: uid, document: document }),
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

  const handleHalfSpeed = () => {
    if (audioRef.current) {
      audioRef.current.playbackRate = 0.5;
      audioRef.current.play();

      audioRef.current.onended = () => {
        if(audioRef.current){
        audioRef.current.playbackRate = 1.0;
        }
      };
    }
  };




  return (
    <form onSubmit={(e) => e.preventDefault()}>
    <Container className="p-3 rounded bg-white text-dark w-100" style={{ maxWidth: '600px' }}>
    <Row className="align-items-center">
  <Col md={6}>
    <h5 className="mb-0 font-weight-bold">Napiši poved v Slovenščini</h5>
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
        className="mb-3 custom-button" 
      >
        <BsFillVolumeUpFill style={{ fontSize: '36px', color: 'blue' }} />
      </Button>
      <div className="text-container">
        <span>{exercise.sentence}</span>
      </div>
    </div>
  </Col>
</Row>




<audio ref={audioRef} style={{ display: 'none' }}>
      <source src={audioSource} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
    <div className="border-bottom my-3"></div>

    <Row className="mt-2 justify-content-center">
      <Col md={8}>
        {selectedWords.map((word, index) => (
          <Badge pill key={index} onClick={() => handleWordClickSelected(word)} className="m-1 p-1 rounded">
            {word}
          </Badge>
        ))}
      </Col>
    </Row>


    <div className="border-bottom my-3"></div>

    <Row className="mt-2 justify-content-center">
      <Col md={8}>
        <div className="p-1 rounded">
          {divs.map((div, index) => (
           <div 
           style={{
             display: 'inline-flex', 
             justifyContent: 'center',
             alignItems: 'center',
             border: '1px solid #ccc', 
             borderRadius: '15px', 
             margin: '5px', 
             padding: '8px', 
             boxSizing: 'border-box',
             minWidth: '60px'
           }} 
           key={index}
         >
           {availableWords.includes(initial[div]) && (
             <Badge pill onClick={() => handleWordClickAvailable(initial[div])} className="my-badge-tip-naloge1_1 m-1 p-1 rounded">
               {initial[div]}
             </Badge>
           )}
         </div>
          ))}
        </div>
      </Col>
    </Row>

  </Container>



      <div className="fixed-bottom">
        <div className="container-fluid">
          <div className="upper-line"></div>
          <Row className="align-items-center">
            <Col xs={4} md={4} className="text-end">

              <Button className="custom-button1 btn-sm">
                Preskoči
              </Button>
            </Col>
            <Col xs={4} md={4}></Col>
            <Col xs={4} md={4} className="text-start">
              <Button onClick={handleCheck} className="custom-button1 btn-sm flex-grow-0">
                Preveri rešitev
              </Button>
            </Col>
          </Row>
        </div>
      </div>





      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isCorrect ? 'Pravilen odgovor!' : 'Napačen odgovor! '}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isCorrect ? 'Pravilno!' : `Pravilen odgovor je "${translation}"`}
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