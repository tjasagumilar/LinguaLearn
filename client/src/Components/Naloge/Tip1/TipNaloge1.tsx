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
<Container className="my-component mx-auto">
      <Row>
        <Col></Col>
      </Row>
      <form onSubmit={(e) => e.preventDefault()}>
        <Row>
          <Col>
            <h1 className="my-heading">Prevedite ta stavek</h1>
           <h2> <div className="bubble">{exercise.sentence}</div></h2>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            {selectedWords.map((word, index) => (
              <Badge pill  key={index} onClick={() => handleWordClickSelected(word)} className="my-badge-tip-naloge1">
                {word}
              </Badge>
            ))}
          </Col>
          <br></br>  <br></br>
        </Row>
        <hr />
        <Row>
          <Col>
       
          <div className="bubble">
            <h3 className="my-subheading">Razpoložljive besede: </h3>
            {exercise.availableWords.map((word, index) => (
              <Badge pill key={index} onClick={() => handleWordClickAvailable(word)} className="my-badge-tip-naloge1">
                {word}
              </Badge>
            ))}
            </div>
         
          </Col>
        </Row>
        <br />
        <Row>
        <Col className="d-flex justify-content-end">
            <Button onClick={handleCheck}>Check Answer</Button>
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
          </Col>
        </Row>
      </form>
    </Container>
  );
};

export default TipNaloge1;