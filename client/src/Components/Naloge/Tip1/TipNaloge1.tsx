import React, { useState } from 'react';
import './TipNaloge1.css';
import { Exercise } from '../Exercises/Exercises';
import { Container, Row, Col, Button, Modal, Badge } from 'react-bootstrap';


interface TipNaloge1Props {
  exercise: Exercise;
  onRemoveAvailable1: (newState: string) => void;
  onRemoveSelected1: (newState: string) => void;
  onAddExercise: (newState: Exercise) => void;
  onCheck: () => void;
}

const TipNaloge1 = ({ onRemoveAvailable1, onRemoveSelected1, onAddExercise, exercise, onCheck }: TipNaloge1Props) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [translation, setTranslation] = useState<string>();


  const handleWordClickAvailable = (word: string) => {
    onRemoveAvailable1(word);
    setSelectedWords((prevSelected) => [...prevSelected, word]);
  };


  const handleWordClickSelected = (word: string) => {
    onRemoveSelected1(word);
    setSelectedWords((prevWords) => prevWords.filter((w) => w !== word));
  };

  const handleCheck = () => {
    const selectedSentence = selectedWords.join(' ');

    fetch(`http://localhost:4000/prevedi/${selectedSentence}`)
      .then((response) => response.json())
      .then((data) => {
        const translation = data.translation;
        setTranslation(translation)
        setSelectedWords([]);
        const isAnswerCorrect = exercise.sentence === translation;
        setIsCorrect(isAnswerCorrect);
        setShowModal(true);
        onCheck();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };



  return (
    <form onSubmit={(e) => e.preventDefault()}>
   <Container className="p-3 rounded bg-white text-dark w-50">   
    <Row className="mt-2">
        <Col>
            <h1 className="fw-bold">Prevedite ta stavek</h1>
            <h2> <div className="p-1 rounded">{exercise.sentence}</div></h2>
        </Col>
    </Row>
    <hr />
    <Row className="bubble1_1 mt-2">
        <Col>
            {selectedWords.map((word, index) => (
              <Badge pill key={index} onClick={() => handleWordClickSelected(word)} className="my-badge-tip-naloge1_1 m-1 p-1 rounded">
                {word}
              </Badge>
            ))}
        </Col>
        <br></br>
    </Row>
    <hr />
    <Row className="bubble1_1 mt-2">
        <Col>
            <div className="p-1 rounded">
              {exercise.availableWords.map((word, index) => (
                <Badge pill key={index} onClick={() => handleWordClickAvailable(word)} className="my-badge-tip-naloge1_1 m-1 p-1 rounded">
                  {word}
                </Badge>
              ))}
            </div>
        </Col>
    </Row>
    <br />
    <Row>
        <Col className="d-flex justify-content-end">
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