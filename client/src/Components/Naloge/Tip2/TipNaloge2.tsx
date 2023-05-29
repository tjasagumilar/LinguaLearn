import React, { useState } from 'react';
import './TipNaloge2.css';
import { Container, Row, Col, Button, Modal, Badge } from 'react-bootstrap';
import { Exercise } from '../Exercises/Exercises';

interface TipNaloge2Props {
  exercise: Exercise;
  onCheck: () => void;
}

const TipNaloge2 = ({ exercise , onCheck}: TipNaloge2Props) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [translation, setTranslation] = useState<string>();

  const handleWordClickAvailable = (word: string) => {
    setSelectedWord(word);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedWord) {
      alert('No word selected!');
      return;
    }

    fetch(`http://localhost:4000/prevedi/${selectedWord}`)
      .then(response => response.json())
      .then(data => {
        const translation = data.translation;
        setTranslation(translation);
        const isAnswerCorrect = exercise.sentence === translation;
        setIsCorrect(isAnswerCorrect);
        setShowModal(true);
        onCheck()
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Container className="my-component mx-auto">
      <form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <h2>Pomen besede:</h2>
            <div className="bubble">{exercise.sentence}</div>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <h3>Razpoložljive besede:</h3>
        
            {exercise.availableWords.map((word, index) => (
  <span
    key={index}
    onClick={() => handleWordClickAvailable(word)}
    className={`my-badge-tip-naloge2 ${selectedWord === word ? 'isSelected' : ''}`}
  >
    {word}
  </span>
))}
          </Col>
        </Row>
        <br />
        <Row>
          <Col className="d-flex justify-content-end">
            <Button type="submit">Preveri</Button>
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>{isCorrect ? 'Pravilen odgovor!' : 'Napačen odgovor!'}</Modal.Title>
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

export default TipNaloge2;
