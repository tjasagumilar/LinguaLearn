import React, { useEffect, useRef, useState } from 'react';
import './TipNaloge2.css';
import { Container, Row, Col, Button, Modal, Badge } from 'react-bootstrap';
import { Exercise } from '../Exercises/Exercises';
import { useLocation } from 'react-router-dom';
import jsonIcon from '../Tip1/female-avatar.json';

import Lottie from 'lottie-react';
import { BsFillVolumeUpFill } from 'react-icons/bs';
import { BASE_URL } from '../../../api';
import { FaCheckCircle } from 'react-icons/fa';
import { FaTimesCircle } from 'react-icons/fa';
import { Word } from '../../MojeBesede/MojeBesede';
interface TipNaloge2Props {
  exercise: Exercise;
  uid: string;
  document: string;
  onCheck: () => void;
}

const TipNaloge2 = ({ exercise, uid, document, onCheck }: TipNaloge2Props) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const language = queryParams.get('language');
  
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [translation, setTranslation] = useState<string>();
  const [availableWords, setAvailableWords] = useState<string[]>(exercise.availableWords)
  const [words, setWords] = useState<Word[]>([]);
  const [isSentenceInWords, setIsSentenceInWords] = useState(false);
  
  const naloziBesede = (uid: string) => {
    fetch(`${BASE_URL}/getWords?uid=${uid}&language=${language}`)
      .then((response) => response.json())
      .then((data) => {
        setWords(data);
        setIsSentenceInWords(data.some((word: string) => word === exercise.sentence));
      })
      .catch((error) => console.error(error));
  };


  useEffect(() => {
    setAvailableWords(exercise.availableWords);
    naloziBesede(uid)
  }, [exercise.availableWords]);

  const handleWordClickAvailable = (index: number) => {
    setSelectedWordIndex(index);
  };

  const updateCorrectSolved = async (uid: string, document: string) => {
    try {
      const response = await fetch(`${BASE_URL}/solvedCorrect`, {
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

 const updateYourWords = async (uid: string, newWord: string, slovenskiPrevod: string) => {
  const type = "beseda"
    try {
      const response = await fetch(`${BASE_URL}/yourWords`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: uid, newWord: newWord,language: language, slovenskiPrevod: slovenskiPrevod, type: type}),
      });


      if (!response.ok) {
        throw new Error('Error: ' + response.status);
      }
    } catch (error) {
      console.error('Error' + error)
    }
  }

  const updateYourMistakes = async (uid: string, newWord: string, slovenskiPrevod: string) => {
    const type = "beseda"
      try {
        const response = await fetch(`${BASE_URL}/yourMistakes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid: uid, newWord: newWord,language: language, slovenskiPrevod: slovenskiPrevod, type: type}),
        });
  
  
        if (!response.ok) {
          throw new Error('Error: ' + response.status);
        }
      } catch (error) {
        console.error('Error' + error)
      }
    }

  


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if(selectedWordIndex == null){
      return null;
    }
  
    const selectedWord = availableWords[selectedWordIndex]
  
    if (!selectedWord) {
      return;
    }
  
    if (exercise.resitve == null) {
      return null;
    }
  
    let element = availableWords.indexOf(selectedWord)
    let elementEng = exercise.resitve[element]
    let slovenskiPrevod: string;
  
    fetch(`${BASE_URL}/prevedi/sl/${elementEng}`)
    .then((response) => response.json())
    .then(async (data) => {
      slovenskiPrevod = data.translation;
      return fetch(`${BASE_URL}/prevedi/${language}/${elementEng}`)
    })
    .then((response) => response.json())
    .then(async (data) => {
      const translation = data.translation;
      console.log(translation)
      console.log(exercise.sentence)
  
      const isAnswerCorrect = exercise.sentence === translation;
      setSelectedWordIndex(null)
  
      if (isAnswerCorrect) {
        await updateCorrectSolved(uid, document)
        await updateYourWords(uid, exercise.sentence, slovenskiPrevod)
      }else{
        await updateYourMistakes(uid, exercise.sentence, selectedWord)
      }
    
      console.log(isAnswerCorrect)
      setIsCorrect(isAnswerCorrect);
      setShowModal(true);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  const handleSkip = () => {
    setShowModal(true);

  };

  const handleCloseModal = () => {
    setShowModal(false);
    onCheck()
  };
  const [showTranslation, setShowTranslation] = useState(false);
  return (
    <form onSubmit={handleSubmit}>

      


<Container className="p-3 rounded bg-white text-dark w-100 d-flex flex-column justify-content-center align-items-center" style={{ maxWidth: '900px', minHeight: '70vh' }}>
{isSentenceInWords ? (
      <div></div>
    ) : (
      <i style={{ fontSize: '19px', color: 'purple' }}>Nova beseda!</i>
    )}
<Row className="align-items-center justify-content-center w-100 " style={{ marginBottom: '40px' }}>
    <Col md={6} xl={12} className="text-center">
    <div className="text-container">
    
    <div
className={`tooltip-container ${isSentenceInWords ? 'hoverable' : ''}`}
onMouseEnter={() => setShowTranslation(true)}
onMouseLeave={() => setShowTranslation(false)}
>
<h4 className={` ${!isSentenceInWords ? 'purple-text' : ''}`} > 
Kako se reče:  "{exercise.sentence}"
</h4>

{!isSentenceInWords && showTranslation && (
<div className="custom-tooltip">
  Prevod: {exercise.resitev}
</div>
)}
</div>
    </div>
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



<div className="fixed-bottom my-padding-sm">
        <div className="container-fluid">
          <div className="upper-line"></div>
          <Row className="align-items-center">
          <Col xs={2} sm={2} md={2} lg={2} xl={2} className="text-center mb-2 mb-sm-2"></Col>
                        <Col xs={2} sm={2} md={2} lg={2} xl={2} className="text-center mb-2 mb-sm-0">
              <Button onClick={handleSkip} className="btn first1p w-60 d-flex align-items-center justify-content-center mb-2">
                <span className="btn-text">Preskoči</span>
              </Button>
            </Col>
            <Col xs={2} sm={2} md={4} lg={4} xl={4} className="text-center mb-2 mb-sm-2 "></Col>
                        <Col xs={2} sm={2} md={2} lg={2} xl={2} className="text-center mb-2 mb-sm-2">
            <Button 
type="submit"
  className="btn first1 w-60 d-flex align-items-center justify-content-center"
  disabled={selectedWordIndex == null}
>
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
                <Modal.Header closeButton style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Modal.Title>{isCorrect ? 'Pravilen odgovor!' : 'Napačen odgovor! '}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
  {isCorrect ? (
    <>
      <FaCheckCircle size={70} color="green" /> <br/><br/>
      <span>Čestitke za pravilen odgovor</span>
    </>
  ) : (
    <>
     <FaTimesCircle size={70} color="red" /> <br/><br/>
     <span>Pravilen odgovor je "{exercise.resitev}"</span>

  </>
  )}
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