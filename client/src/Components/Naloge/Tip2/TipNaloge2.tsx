import React, { useEffect, useRef, useState } from 'react';
import './TipNaloge2.css';
import { Container, Row, Col, Button, Modal, Badge } from 'react-bootstrap';
import { Exercise } from '../Exercises/Exercises';
import { useLocation } from 'react-router-dom';
import jsonIcon from '../Tip1/female-avatar.json';

import Lottie from 'lottie-react';
import { BsFillVolumeUpFill } from 'react-icons/bs';

interface TipNaloge2Props {
  exercise: Exercise;
  uid: string;
  document: string;
  onCheck: () => void;
}

const TipNaloge2 = ({ exercise, uid, document, onCheck }: TipNaloge2Props) => {
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [translation, setTranslation] = useState<string>();
  const [availableWords, setAvailableWords] = useState<string[]>(exercise.availableWords)
  const [audioSource, setAudioSource] = useState<string>(`http://localhost:4000/tts?tts=${exercise.sentence}`);
  const audioRef = useRef<HTMLAudioElement>(null);



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

  useEffect(() => {
    setAvailableWords(exercise.availableWords);
  }, [exercise.availableWords]);

  const handleWordClickAvailable = (index: number) => {
    setSelectedWordIndex(index);
  };

  const updateCorrectSolved = async (uid: string, document: string) => {
    try {
      const response = await fetch('http://localhost:4000/solvedCorrect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: uid, document: document, language: language }),
      });

      if (response.ok) {
      } else {
        throw new Error('Error: ' + response.status);
      }
    } catch (error) {
      console.error('Error: ' + error);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if(selectedWordIndex == null){
      return null;
    }

    const selectedWord = availableWords[selectedWordIndex]

    if (!selectedWord) {
      alert();
      return;
    }

    if (exercise.resitve == null) {
      return null;
    }

    let element = availableWords.indexOf(selectedWord)
    let elementEng = exercise.resitve[element]


    fetch(`http://localhost:4000/prevedi/${language}/${elementEng}`)
      .then((response) => response.json())
      .then(async (data) => {
        const translation = data.translation;
        console.log(translation)
        console.log(exercise.sentence)

        const isAnswerCorrect = exercise.sentence === translation;
        setSelectedWordIndex(null)

        if (isAnswerCorrect) {
          await updateCorrectSolved(uid, document)
        }
        console.log(isAnswerCorrect)
        setIsCorrect(isAnswerCorrect);
        setShowModal(true);
      })
      .catch((error) => {
        console.error(error);
      });


    const isAnswerCorrect = exercise.sentence === translation;
    setIsCorrect(isAnswerCorrect);
    setShowModal(true);
    onCheck()
  }

  const handleSkip = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <form onSubmit={handleSubmit}>

<Container className="p-3 rounded bg-white text-dark w-100 d-flex flex-column justify-content-center align-items-center" style={{ maxWidth: '900px', minHeight: '70vh' }}>

<Row className="align-items-center justify-content-center w-100 " style={{ marginBottom: '40px' }}>
    <Col md={6} xl={12} className="text-center">
        <div className="myHeading2 ">Kako se reče "{exercise.sentence}"?</div>
    </Col>
</Row>

   
{availableWords.map((word, index) => (
    <Row className="justify-content-center w-100 mb-4 mt-3" key={index}>
        <Col md={8} xl={8} className="text-center">
            <span
                onClick={() => handleWordClickAvailable(index)}
                className={`btnfirst2  ${selectedWordIndex === index ? 'isSelected' : ''}`}
                style={{display: 'flex', justifyContent: 'center', width: '100%', position: 'relative'}}
            >
                <div className="index-box" style={{position: 'absolute', left: '15px'}}>{index + 1}</div>
                {word}
            </span>
        </Col>
    </Row>
))}




</Container>



      <div className="fixed-bottom">
        <div className="container-fluid">
          <div className="upper-line"></div>
          <Row className="align-items-center">
            <Col xs={2} sm={2} md={2} lg={2} xl={2} className="text-center mb-2 mb-sm-2"></Col>
            <Col xs={2} sm={2} md={2} lg={2} xl={2} className="text-center">
              <Button onClick={handleSkip} className="btn first w-60 d-flex align-items-center justify-content-center">
                <span className="btn-text">Preskoči</span>
              </Button>
            </Col>
            <Col xs={2} sm={2} md={4} lg={4} xl={4} className="text-center mb-2 mb-sm-0 "></Col>
            <Col xs={2} sm={2} md={2} lg={2} xl={2} className="text-center">
              <Button type="submit" className="btn first w-60 d-flex align-items-center justify-content-center">
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

export default TipNaloge2;