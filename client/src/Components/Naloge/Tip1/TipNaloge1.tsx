import React, { useState, useEffect } from 'react';
import './TipNaloge1.css'
import { Exercise } from './Exercises';

interface TipNaloge1Props {
  exercise: Exercise
  onRemoveAvailable1: (newState: string) => void;
  onRemoveSelected1: (newState: string) => void;
  onAddExercise: (newState: Exercise) => void;
}


const TipNaloge1 = ({onRemoveAvailable1, onRemoveSelected1, onAddExercise, exercise}: TipNaloge1Props) => {

  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  
// zbriše možno besedo, doda na selected
  const handleWordClickAvailable = (word: string) => {
    onRemoveAvailable1(word)
    setSelectedWords((prevSelected) => [...prevSelected, word]);
};

// zbriše selected besedo, doda na mozne besede

const handleWordClickSelected = (word: string) => {
  onRemoveSelected1(word)
    setSelectedWords((prevWords) => prevWords.filter((w) => w !== word));

};




const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const currentExercise = exercise
  const selectedSentence = selectedWords.join(' ');

  fetch(`http://localhost:4000/prevedi/${selectedSentence}`)
    .then(response => response.json())
    .then(data => {
      const translation = data.translation;
      setSelectedWords([])
      if (currentExercise.sentence === translation) {
        alert('Pravilno!');
      } else {
        alert('Napačno!');
      }
    })
    .catch(error => {
      console.error(error);
    });
};



return (
  <form onSubmit={handleSubmit}>
    <div>
      <h1>Prevedite ta stavek</h1>
      <div>{exercise.sentence}</div>
      <br />
      ------------------------------------------
      <br />
      {selectedWords.map((word, index) => (
        <span
          key={index}
          onClick={() => handleWordClickSelected(word)}
          className="selected-word"
        >
          {word}
        </span>
      ))}
      <br />
      ------------------------------------------
      <br />
      <h3>Razpoložljive besede: </h3>
      {exercise.availableWords.map((word, index) => (
        <span
          key={index}
          onClick={() => handleWordClickAvailable(word)}
          className="available-word"
        >
          {word}
        </span>
      ))}
      <br />
    </div>
    <br/>
    <button type="submit">Preveri</button>
    
  </form>
);
};

export default TipNaloge1;