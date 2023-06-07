import React, { useEffect, useRef, useState } from 'react';
import './TipNaloge1.css';
import { Exercise } from '../Exercises/Exercises';
import { Container, Row, Col, Button, Modal, Badge, Card } from 'react-bootstrap';
import jsonIcon from './female-avatar.json';
import Lottie from 'lottie-react';
import { BsFillVolumeUpFill } from 'react-icons/bs';
import { useLocation } from 'react-router-dom';
import { BASE_URL } from '../../../api';
import { FaCheckCircle } from 'react-icons/fa';
import { FaTimesCircle } from 'react-icons/fa';
import { Word } from '../../MojeBesede/MojeBesede';

interface TipNaloge1Props {
  exercise: Exercise;
  uid: string;
  document: string;
  onCheck: () => void;
}

const TipNaloge1 = ({ exercise, uid, document, onCheck }: TipNaloge1Props) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const language = queryParams.get('language');

  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [translation, setTranslation] = useState<string>();
  const [audioSource, setAudioSource] = useState<string>(`${BASE_URL}/tts?tts=${exercise.sentence}&language=${language}`);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [availableWords, setAvailableWords] = useState<string[]>(exercise.availableWords)
  const [isSentenceInWords, setIsSentenceInWords] = useState(false);

  const [words, setWords] = useState<Word[]>([]);


  useEffect(() => {
    setAvailableWords(exercise.availableWords)
    naloziBesede(uid);
  }, [exercise.sentence])

  const naloziBesede = (uid: string) => {
    fetch(`${BASE_URL}/getWords?uid=${uid}&language=${language}`)
      .then((response) => response.json())
      .then((data) => {
        setWords(data);
        setIsSentenceInWords(data.some((word: string) => word === exercise.sentence));
      })
      .catch((error) => console.error(error));
  };

  console.log(words)

  useEffect(() => {
    setAudioSource(prevAudioSource => {
      const newAudioSource = `${BASE_URL}/tts?tts=${exercise.sentence}&language=${language}`;
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

  const handleCheck = async () => {
    const selectedSentence = selectedWords.join(' ');
    console.log(selectedSentence)



        setSelectedWords([]);

        console.log(exercise.sentence)
        const isAnswerCorrect = exercise.resitev === selectedSentence;

        if (isAnswerCorrect && exercise.resitev != null) {
          await updateCorrectSolved(uid, document)
          await updateYourWords(uid, exercise.sentence, exercise.resitev)
        }else{
          await updateYourMistakes(uid, exercise.sentence, selectedSentence)
        }
        setIsCorrect(isAnswerCorrect);
        setShowModal(true);
   
   
  };

  const updateYourMistakes = async (uid: string, newWord: string, slovenskiPrevod: string) => {
    const type = "stavek"
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

  const updateYourWords = async (uid: string, newWord: string, slovenskiPrevod: string) => {
    const type = "stavek"
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

const handleCloseModal = () => {
  setShowModal(false);
  onCheck();
};

const handleSkip = () => {
  setShowModal(true);
};
const [showTranslation, setShowTranslation] = useState(false);
return (
  <form onSubmit={(e) => e.preventDefault()}>
    <div>
   <Container className="p-3 pb-100 rounded text-dark col-sm-md-lg-6" style={{ maxWidth: '900px', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
    <Row className="align-items-center mt-3 mb-4">
        <Col md={6}>
        {isSentenceInWords ? (
      <div></div>
    ) : (
      <i style={{ fontSize: '19px', color: 'purple' }}>Nova poved!</i>
    )}
          <h4 className="mb-0 font-weight-bold">Napiši poved v Slovenščini</h4>
        </Col>
      </Row>
      <Row className="align-items-center">
        <Col xs={5} md={3} lg={3} xl={3}>
          <Lottie animationData={jsonIcon} loop={true} autoplay={true} style={{ width: "100%", height: "100%" }} />
        </Col>
        <Col xs={7} md={9} lg={9} xl={9}>
        <div className="bubble11">
            <Button
              onClick={() => audioRef.current && audioRef.current.play()}
              className="buttonZvok mb-3 custom-button"
            >
              <BsFillVolumeUpFill style={{ fontSize: '50px', color: 'blue' }} />
            </Button>
            <div className="text-container">
    
            <div
      className={`tooltip-container ${isSentenceInWords ? 'hoverable' : ''}`}
      onMouseEnter={() => setShowTranslation(true)}
      onMouseLeave={() => setShowTranslation(false)}
    >
      <h4 className={`mb-0 font-weight-bold ${!isSentenceInWords ? 'purple-text' : ''}`}>
        {exercise.sentence}
      </h4>
      {!isSentenceInWords && showTranslation && (
        <div className="custom-tooltip">
          Prevod: {exercise.resitev}
        </div>
      )}
    </div>
            </div>
          </div>
        </Col>
      </Row>




      <audio ref={audioRef} style={{ display: 'none' }}>
        <source src={audioSource} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="border-bottom my-3"></div>

<Row className="mt-2 justify-content-left min-height-div">
  <Col >
    <div className="d-flex flex-wrap">
      {selectedWords.map((word, index) => (
        <Badge
          pill
          key={index}
          onClick={() => handleWordClickSelected(word)}
          className="my-badge-tip-naloge1Ts"
        >
          <h5 className="mb-0"> {word}</h5>
        </Badge>
      ))}
    </div>
  </Col>
</Row>

<div className="border-bottom my-3"></div>



      <Row className="mt-2">
  <h5 className="mb-0">Razpoložljive besede:</h5>
  <br /><br />
  <Col >
    <div className="d-flex flex-wrap">
      {availableWords.map((word, index) => (
        <Badge
          pill
          key={index}
          onClick={() => handleWordClickAvailable(word)}
          className="my-badge-tip-naloge1Ts"
        >
          <h5 className="mb-0"> {word}</h5>
        </Badge>
      ))}
    </div>
  </Col>
 
</Row>


    </Container>

    <div className="fixed-bottom pb-3">
       <div className="container-fluid">
    <div className="upper-line"></div>
    <Row className="align-items-center">
    <Col xs={2} sm={2} md={2} lg={2} xl={2} className="text-center mb-2 mb-sm-2"></Col>
                        <Col xs={2} sm={2} md={2} lg={2} xl={2} className="text-center mb-2 mb-sm-0">
  <Button onClick={handleSkip} className="btn first1p w-60 d-flex align-items-center justify-content-center">
    <span className="btn-text">Preskoči</span>
  </Button>
</Col>
<Col xs={2} sm={2} md={4} lg={4} xl={4} className="text-center mb-2 mb-sm-2 "></Col>
                        <Col xs={2} sm={2} md={2} lg={2} xl={2} className="text-center mb-2 mb-sm-2">
        <Button 
          onClick={handleCheck} 
          className="btn first1 w-60 d-flex align-items-center justify-content-center"
          disabled={selectedWords.length === 0}
        >
          <span className="btn-text">Preveri</span>
        </Button>
      </Col>
      <Col xs={2} sm={2} md={2} lg={2} xl={2} className="text-center mb-2 mb-sm-0"></Col>
    </Row>
  </div>
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

export default TipNaloge1;