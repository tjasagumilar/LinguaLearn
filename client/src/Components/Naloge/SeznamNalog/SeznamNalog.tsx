import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import './SeznamNalog.css';
import { FaLanguage, FaImages, FaRandom } from 'react-icons/fa';

const SeznamNalog = () => {
  const [selectedDifficulty, setSelectedDifficulty] = React.useState('Začetnik');


  const handleDifficultyChange = (eventKey: any) => {
    setSelectedDifficulty(eventKey || 'Začetnik');
  };

  const naloge = [
    { title: 'Prevajanje fraz', icon: <FaLanguage size="2em" />, link: '/generirajNaloge/poved', difficulty: ['Začetnik', 'Raziskovalec', 'Pustolovec', 'Prvak'] },
    { title: 'Prevajanje posameznih besed', icon: <FaLanguage size="2em" />, link: '/generirajNaloge/beseda', difficulty: ['Začetnik', 'Raziskovalec', 'Pustolovec', 'Prvak'] },
    { title: 'Prepoznavanje slik', icon: <FaImages size="2em" />, link: '/generirajNaloge/slika', difficulty: ['Začetnik', 'Raziskovalec', 'Pustolovec', 'Prvak'] },
    { title: 'Naključna naloga', icon: <FaRandom size="2em" />, link: '/generirajNaloge/random', difficulty: ['Začetnik', 'Raziskovalec', 'Pustolovec', 'Prvak'] },
  ];

  const difficultyTypes = ['Začetnik', 'Raziskovalec', 'Pustolovec', 'Prvak'];

  return (
    <div>

      <DropdownButton
        id="difficulty-dropdown"
        title={selectedDifficulty}
        onSelect={handleDifficultyChange}
        className="dropdown-btn"
      >
        {difficultyTypes.map((difficulty, index) => (
          <Dropdown.Item key={index} eventKey={difficulty}>
            {difficulty}
          </Dropdown.Item>
        ))}
      </DropdownButton>

      <Container fluid className="py-5">
        <Row className="justify-content-center card-container">
          {naloge.map((nalog, index) => {
            if (nalog.difficulty.includes(selectedDifficulty)) {
              const updatedNalog = {
                ...nalog,
                difficulty: selectedDifficulty,
              };

              return (
                <Col md={3} key={index}>
                  <Card className="mb-4 h-100">
                    <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                      <a href={`${updatedNalog.link}`} className="text-decoration-none text-reset">
                        <div className="mb-2">
                          <div>{updatedNalog.icon}</div>
                        </div>     
                        <Card.Title className="text-center">{updatedNalog.title}</Card.Title>
                        <div className="text-center">Težavnost: {selectedDifficulty}</div>
                      </a>
                    </Card.Body>
                  </Card>
                </Col>
              );
            }
            return null;
          })}
        </Row>
      </Container>
    </div>
  );
};

export default SeznamNalog;
