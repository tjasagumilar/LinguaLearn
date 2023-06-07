import React, { useState, useEffect, useRef } from 'react';
import { Exercise } from '../Exercises/Exercises';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Badge, Image } from 'react-bootstrap';
import './TipNaloge3.css';
import { BASE_URL } from '../../../api';
import { FaCheckCircle } from 'react-icons/fa';
import { FaTimesCircle } from 'react-icons/fa';

interface TipNaloge3Props {
  exercise: Exercise;
  uid: string;
  document: string;
  onCheck: () => void;
}


const TipNaloge3 = ({exercise,  uid, document, onCheck}: TipNaloge3Props) => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const language = queryParams.get('language');


  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [availableWords, setAvailableWords] = useState<string[]>(exercise.availableWords)
  const [url, seturl] = useState<string| undefined>(exercise.pageURL)
 const [audioSource, setAudioSource] = useState<string>(`${BASE_URL}/tts?tts=${encodeURIComponent(availableWords[0])}&language=${language}`);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setAvailableWords(exercise.availableWords);
    seturl(exercise.pageURL)
  }, [exercise.availableWords]);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play();
    }
  }
  

  useEffect(() => {
    if (selectedWordIndex === null || !availableWords[selectedWordIndex]) return;

    const word = availableWords[selectedWordIndex];
    const newAudioSource = `${BASE_URL}/tts?tts=${encodeURIComponent(word)}&language=${language}`;

    setAudioSource(newAudioSource);
    playAudio();
  }, [selectedWordIndex, language, availableWords]);





  const handleWordClickAvailable = (index: number) => {
    setSelectedWordIndex(index);
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




  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(selectedWordIndex == null){
      return null;
    }
  
    const selectedWord = availableWords[selectedWordIndex]
  
    fetch(`${BASE_URL}/prevedi/${language}/${selectedWord}`)
      .then(response => response.json())
      .then(async data => {
        const translation = data.translation;
  
        const isAnswerCorrect = exercise.sentence === translation;
        setSelectedWordIndex(null)
  
        if (isAnswerCorrect) {
      
          const slovenianTranslationResponse = await fetch(`${BASE_URL}/prevedi/sl/${exercise.sentence}`);
          const slovenianData = await slovenianTranslationResponse.json();
          const slovenianTranslation = slovenianData.translation;
          await updateCorrectSolved(uid, document)
          await updateYourWords(uid, exercise.sentence, slovenianTranslation)
        } else{
          await updateYourMistakes(uid, exercise.sentence, selectedWord)
        }
        console.log(isAnswerCorrect)
        setIsCorrect(isAnswerCorrect);
        setShowModal(true);
  
      })
      .catch(error => {
        console.error(error);
      });
  };
  


  const handleSkip = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    onCheck()
  };

  

return (
    <form onSubmit={handleSubmit}>

      <audio ref={audioRef} style={{ display: 'none' }}>
        <source src={audioSource} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

<Container className="p-3 rounded bg-white text-dark w-100 d-flex flex-column justify-content-center align-items-center" style={{ maxWidth: '1200px', minHeight: '70vh' }}>
  <Row className="align-items-center justify-content-center w-100" style={{ marginBottom: '40px' }}>
    <Col md={8} xl={12} sm={8} lg={8} className="text-center">
      <div className="myHeading2">Kaj je na sliki?</div>
    </Col>
  </Row>

  <Row className="justify-content-center w-100 mb-4">
  <Col md={12} xl={7} sm={9} lg={9} className="text-center">
    <Image src={url} alt="Generated Image" className="image-styled" style={{ width: '35%', maxWidth: '300px' }} />
  </Col>
</Row>

      {availableWords.map((word, index) => (
        <Row className="justify-content-center w-100 mb-4 mt-3" key={index}>
          <Col md={5} xl={5} sm={5} lg={5} className="text-center">
            <span
              onClick={() => handleWordClickAvailable(index)}
              className={`btnfirst3  ${selectedWordIndex === index ? 'isSelected' : ''}`}
              style={{display: 'flex', justifyContent: 'center', width: '100%', position: 'relative'}}
            >
              <div className="index-box" style={{position: 'absolute', left: '15px'}}>{index + 1}</div>
              {word}
            </span>
          </Col>
        </Row>
      ))}
    </Container>
<br></br><br></br><br></br><br></br>


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
              <Button type="submit" className="btn first1 w-60 d-flex align-items-center justify-content-center"
              disabled={selectedWordIndex == null}>
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
     <span>Pravilen odgovor je "{exercise.sentence}"</span>

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

export default TipNaloge3;