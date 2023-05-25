import React, { useState, useEffect } from 'react';
import './TipNaloge2.css'
import { Exercise } from './Exercises';

interface TipNaloge2Props {
  exercise: Exercise
}


const TipNaloge2 = ({exercise}: TipNaloge2Props) => {

  const [selectedWord, setSelectedWord] = useState<string>();

  const handleToggleButton = (word: string) => {
    setSelectedWord(word);
  };




const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  fetch(`http://localhost:4000/prevedi/${selectedWord}`)
    .then(response => response.json())
    .then(data => {
      const translation = data.translation;
      if (exercise.sentence === translation) {
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
      <h1>Kaj je na sliki: <div>
       
        <img src={exercise.pageURL} alt="Generated Image" />
     </div></h1>
      <br />
      ------------------------------------------
      <br />
      <h3>Razpoložljive besede: </h3>
      {exercise.availableWords.map((word, index) => (
        <span
        key={index}
        className={`available-word ${word === selectedWord ? 'selected' : ''}`}
        onClick={() => handleToggleButton(word)}
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

export default TipNaloge2;