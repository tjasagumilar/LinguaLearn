import React, { useState, useEffect, useRef } from 'react';
import TipNaloge1 from '../Tip1/TipNaloge1';
import TipNaloge2 from '../Tip2/TipNaloge2';
import TipNaloge3 from '../Tip3/TipNaloge3';
import { Container, Row, Col, Button, ProgressBar, Badge, Modal } from 'react-bootstrap';
import './Exercises.css'
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../../Config/firebase';
import { doc } from 'firebase/firestore';


export interface Exercise {
  index?: number,
  type: string,
  sentence: string;
  availableWords: string[];
  pageURL?: string;
  solved: boolean;
}



const Exercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentExercise, setCurrentExercise] = useState<Exercise>();
  const [isLoading, setIsLoading] = useState(true);
  const isFirstRender = useRef(true);
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [uid, setUid] = useState('');
  const [document, setDocument] = useState('');
  const [correct, setCorrect] = useState(0);


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const language = queryParams.get('language');

  useEffect(() => {
    console.log('exercise:', exercises[currentExerciseIndex]);
  }, [exercises, currentExerciseIndex]);


  const redirectToPage = () => {
    setShowConfirmation(true);
  };

  const handleConfirmation = async (confirmed: boolean) => {
    setShowConfirmation(false);
    if (confirmed) {
      navigate('/naloge');
      await updateExercisesSolved(uid, document)
    }
  };

  const generateExercises = async (uid: string) => {
    try {
      const exercisePromises = [];
      const numExercises = 10;

      for (let i = 0; i < numExercises; i++) {
        let exercisePromise;

        const random = Math.random();
        if (random < 0.33) {
          exercisePromise = fetchStavekExercise(uid);
        } else if (random < 0.66) {
          exercisePromise = fetchStavek2Exercise(uid);
        } else {
          exercisePromise = fetchStavek3Exercise(uid);
        }

        exercisePromises.push(exercisePromise.then(exercise => {
          return { ...exercise, index: i, solved: false };
        }));
      }

      const generatedExercises = await Promise.all(exercisePromises);
      await saveExercises(generatedExercises, uid)
      setExercises(generatedExercises);
      setCurrentExerciseIndex(0)
      setCurrentExercise(generatedExercises[0])

      setIsLoading(false);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  const saveExercises = async (exercises: Exercise[], uid: string) => {
    try {
      const response = await fetch('http://localhost:4000/saveExercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exercises, uid }),
      });

      if (response.ok) {
        const docId = await response.text()
        console.log(docId)
        setDocument(docId)
        console.log('Exercises saved successfully');
      } else {
        throw new Error('Error: ' + response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const loadExercises = async (uid: string) => {
    try {
      const response = await fetch(`http://localhost:4000/loadExercises?uid=${uid}`);
      if (response.ok) {
        console.log(response)
        const text = await response.text();
        if (text.trim().length === 0) {
          generateExercises(uid)
        } else {
          const exercises = JSON.parse(text);
          console.log(exercises)
          const exerciseFalse = exercises.exercises.find((exercise: Exercise) => exercise.solved === false);
          setDocument(exercises.id)
          setExercises(exercises.exercises);
          setCurrentExerciseIndex(exerciseFalse.index)
          setCurrentExercise(exerciseFalse)
          console.log(exercises.exercises[0])
          setIsLoading(false);
        }
      } else {
        throw new Error('Error: ' + response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const checkAuthState = () => {
    auth.onAuthStateChanged(user => {
      if (user) {
        setUid(user.uid);
        loadExercises(user.uid)
      }
    });
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    checkAuthState()
  }, []);

  const fetchStavekExercise = async (uid: string) => {
    console.log(uid)
    const response = await fetch(`http://localhost:4000/generate?uid=${uid}&language=${language}`)

    if (!response.ok) {
      throw new Error('Failed to fetch exercises');
    }

    const data = await response.json();
    const wordsResponse = await fetch(`http://localhost:4000/generateWord?uid=${uid}`)
    if (!wordsResponse.ok) {
      throw new Error('Failed to fetch words');
    }

    const wordsData = await wordsResponse.json();
    const generatedWord1 = wordsData.randomWord;
    const generatedWord2 = wordsData.randomWord2;
    const generatedWord3 = wordsData.randomWord3;

    const words = data.statement.split(' ');
    const mix = [...words].sort(() => Math.random() - 0.5);
    const random = Array.from({ length: 2 }, () => Math.floor(Math.random() * mix.length));
    const dataNew = [...mix];
    dataNew.splice(random[0], 0, generatedWord1);
    dataNew.splice(random[1], 0, generatedWord2);
    dataNew.splice(random[1], 0, generatedWord3);

    const exerciseData = {
      type: 'stavek',
      sentence: data.translation,
      availableWords: dataNew,
    };

    return exerciseData;
  };

  const fetchStavek2Exercise = async (uid: string) => {
    const response = await fetch(`http://localhost:4000/generateWordOne?uid=${uid}`)
    if (!response.ok) {
      throw new Error('Failed to fetch exercises');
    }

    const data = await response.json();
    const wordsResponse = await fetch(`http://localhost:4000/generateWord?uid=${uid}`)
    if (!wordsResponse.ok) {
      throw new Error('Failed to fetch words');
    }

    const prevodResponse = await fetch(`http://localhost:4000/prevedi/${language}/${data.randomWord}`);
    if (!prevodResponse.ok) {
      throw new Error('Failed to fetch translation');
    }

    const prevod = await prevodResponse.json();
    const wordsData = await wordsResponse.json();
    const generatedWord1 = wordsData.randomWord;
    const generatedWord2 = wordsData.randomWord2;
    const generatedWord3 = wordsData.randomWord3;
    const dataNew = [generatedWord1, generatedWord2, generatedWord3, data.randomWord];
    console.log(dataNew)

    for (let i = dataNew.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dataNew[i], dataNew[j]] = [dataNew[j], dataNew[i]];
    }
    console.log(dataNew)

    const exerciseData = {
      type: 'beseda',
      sentence: prevod.translation,
      availableWords: dataNew,
    };

    return exerciseData;
  };

  const fetchStavek3Exercise = async (uid: string) => {
    const response = await fetch(`http://localhost:4000/slika?uid=${uid}`)
    if (!response.ok) {
      throw new Error('Failed to fetch exercises');
    }

    const data = await response.json();
    const wordsResponse = await fetch(`http://localhost:4000/generateWord?uid=${uid}`)
    if (!wordsResponse.ok) {
      throw new Error('Failed to fetch words');
    }

    const prevodResponse = await fetch(`http://localhost:4000/prevedi/${language}/${data.beseda}`);
    if (!prevodResponse.ok) {
      throw new Error('Failed to fetch translation');
    }

    const prevod = await prevodResponse.json();
    const wordsData = await wordsResponse.json();
    const generatedWord1 = wordsData.randomWord;
    const generatedWord2 = wordsData.randomWord2;
    const generatedWord3 = wordsData.randomWord3;
    const dataNew = [generatedWord1, generatedWord2, generatedWord3, data.beseda];
    console.log(dataNew)

    for (let i = dataNew.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dataNew[i], dataNew[j]] = [dataNew[j], dataNew[i]];
    }
    console.log(dataNew)
    console.log(data.pageURL)

    const exerciseData = {
      type: 'slika',
      sentence: prevod.translation,
      availableWords: dataNew,
      pageURL: data.pageURL
    };

    return exerciseData;
  };

  const updateExerciseSolved = async (uid: string, exerciseId: number, document: string) => {
    try {
      const response = await fetch('http://localhost:4000/trueExercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: uid, exerciseId: exerciseId, document: document }),
      });

      if (response.ok) {
        setCorrect((prevCorrect) => prevCorrect + 1);
      } else {
        throw new Error('Error: ' + response.status);
      }
    } catch (error) {
      console.error('Error: ' + error);
    }
  };

  const updateExercisesSolved = async (uid: string, document: string) => {
    try {
      const response = await fetch('http://localhost:4000/trueExercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: uid, document: document }),
      });


      if (!response.ok) {
        throw new Error('Error: ' + response.status);
      }
    } catch (error) {
      console.error('Error' + error)
    }
  }

  if (currentExercise == null) {
    return null;
  }





  const handleNextExercise = async () => {
    if (currentExerciseIndex < exercises.length) {
      const currentExercise = exercises[currentExerciseIndex]
      if (!currentExercise.solved) {
        await updateExerciseSolved(uid, currentExerciseIndex, document)

        const updatedExercises = [...exercises];
        updatedExercises[currentExerciseIndex] = {
          ...updatedExercises[currentExerciseIndex],
          solved: true,
        };
        setExercises(updatedExercises);
      }

    }
    if (currentExerciseIndex == exercises.length - 1) {
      await updateExercisesSolved(uid, document)
      // napiši še kodo da redirecta 
    }
    setCurrentExerciseIndex((prevIndex) => prevIndex + 1);
    setCurrentExercise(exercises[currentExerciseIndex + 1])
  }








  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }




  return (
    <div>
      <Container>
        <br />
        <Row className="align-items-center justify-content-center">
          <Col xs={12} sm={12} md={12} lg={12} className="text-center">
            <div className="d-flex align-items-center justify-content-center">
              <Button
                variant="light"
                className="custom-button"
                style={{ background: 'transparent' }}
                onClick={redirectToPage}
              >
                <span className="text-gray">X</span>
              </Button>

              <ProgressBar
                striped
                variant="success"
                now={(currentExerciseIndex) * (100 / exercises.length)}
                className="custom-progress-bar ml-3 w-100"
              />
            </div>
          </Col>
        </Row>
      </Container>


      {currentExercise.type === 'stavek' ? (
        <TipNaloge1
          exercise={currentExercise}
          uid={uid}
          document={document}
          onCheck={handleNextExercise}
        />
      ) : currentExercise.type === 'beseda' ? (
        <TipNaloge2 exercise={currentExercise} onCheck={handleNextExercise} />
      ) : currentExercise.type === 'slika' ? (
        <TipNaloge3 exercise={currentExercise} onCheck={handleNextExercise} />
      ) : null}

      <Modal
        show={showConfirmation}
        onHide={() => handleConfirmation(false)}
        dialogClassName="modal-footer-sticky"
      >
        <Modal.Header closeButton>
          <Modal.Title>Ali ste prepričani, da želite zapustiti stran?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Ves napredek v tej seji bo izgubljen.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleConfirmation(false)}>
            Ne
          </Button>
          <Button variant="primary" onClick={() => handleConfirmation(true)}>
            Da
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

  );
}
export default Exercises;

