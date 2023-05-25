import React, { useState, useEffect, useRef } from 'react';
import TipNaloge1 from './TipNaloge1';
import TipNaloge2 from './TipNaloge2';
import TipNaloge3 from './TipNaloge3';



export interface Exercise {
    type: string,
    sentence: string;
    availableWords: string[];
    pageURL?: string
}

const Exercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const generateExercises = async () => {
      try {
        const exercisePromises = [];
        const numExercises = 10;
    
        for (let i = 0; i < numExercises; i++) {
          let exercisePromise;
    
          const random = Math.random();
    
          if (random < 0.33) {
            exercisePromise = fetchStavekExercise();
          } else if (random < 0.66) {
            exercisePromise = fetchStavek2Exercise();
          } else {
            exercisePromise = fetchStavek3Exercise();
          }
    
          exercisePromises.push(exercisePromise);
        }
    
        const generatedExercises = await Promise.all(exercisePromises);
        setExercises(generatedExercises);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    generateExercises();
  }, []);

  const fetchStavekExercise = async () => {
    const response = await fetch('http://localhost:4000/generate');
    if (!response.ok) {
      throw new Error('Failed to fetch exercises');
    }

    const data = await response.json();
    const wordsResponse = await fetch('http://localhost:4000/generateWord');
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

  const fetchStavek2Exercise = async () => {
    const response = await fetch('http://localhost:4000/generateWordOne');
    if (!response.ok) {
      throw new Error('Failed to fetch exercises');
    }

    const data = await response.json();
    const wordsResponse = await fetch('http://localhost:4000/generateWord');
    if (!wordsResponse.ok) {
      throw new Error('Failed to fetch words');
    }

    const prevodResponse = await fetch(`http://localhost:4000/prevedi/${data.randomWord}`);
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

  const fetchStavek3Exercise = async () => {
    const response = await fetch('http://localhost:4000/slika');
    if (!response.ok) {
      throw new Error('Failed to fetch exercises');
    }

    const data = await response.json();
    const wordsResponse = await fetch('http://localhost:4000/generateWord');
    if (!wordsResponse.ok) {
      throw new Error('Failed to fetch words');
    }

    const prevodResponse = await fetch(`http://localhost:4000/prevedi/${data.beseda}`);
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



const handleNextExercise = () => {
    setCurrentExerciseIndex((prevIndex) => prevIndex + 1);
  };


  const onRemoveAvailable1 = (word: string) => {
    setExercises((prevExercises) =>
    prevExercises.map((exercise, index) =>
      index === currentExerciseIndex
        ? {
            ...exercise,
            availableWords: exercise.availableWords.filter((w) => w !== word),
          }
        : exercise
    )
  );
};

 const onRemoveSelected1 = (word: string) => {
  setExercises((prevExercises) =>
  prevExercises.map((exercise, index) =>
    index === currentExerciseIndex
    ? {
      ...exercise,
      availableWords: [...exercise.availableWords, word]
    }
    :exercise
  )
  )
 }


 const onAddExercise = (exerciseData: Exercise) => {
  console.log("2x")
  setExercises(prevExercises => [...prevExercises, exerciseData]);
 }


  const currentExercise = exercises[currentExerciseIndex];
const currentIndex = exercises.indexOf(currentExercise);

const isLastExercise = currentExerciseIndex === exercises.length - 1;

if (isLoading) {
  return <p>Loading exercises...</p>;
}

return (
  <div>
    <h2>Naloga {currentIndex + 1}/{exercises.length}</h2>
    {currentExercise.type === "stavek" ? (
      <TipNaloge1
        exercise={currentExercise}
        onRemoveAvailable1={onRemoveAvailable1}
        onRemoveSelected1={onRemoveSelected1}
        onAddExercise={onAddExercise}
      />
    ) : currentExercise.type === "beseda" ? (
      <TipNaloge2 exercise={currentExercise} />
    ) : currentExercise.type === "slika" ? (
      <TipNaloge3 exercise={currentExercise} />
    ) : null}
    {isLastExercise ? (
      <p>Zadnja naloga.</p>
    ) : (
      <button type="button" onClick={handleNextExercise}>
        Naslednja naloga
      </button>
      
    )}
  </div>
);

}
export default Exercises;

