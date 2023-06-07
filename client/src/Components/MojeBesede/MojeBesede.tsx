import React, { useState, useEffect, useRef} from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { auth } from '../../Config/firebase';
import { BASE_URL } from '../../api';
import './MojeBesede.css';
import { BsFillVolumeUpFill } from 'react-icons/bs';

export interface Word {
  word: string;
  slovenskiPrevod: string;
}

const MojeBesede = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [mistakes, setMistakes] = useState<Word[]>([]);
  const [uid, setUid] = useState('');
  const [selectedOption, setSelectedOption] = useState('slovar');
  const [searchQuery, setSearchQuery] = useState('');
  const [translation, setTranslation] = useState<string>();
  const [audioSource, setAudioSource] = useState<string>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [selectedWord, setSelectedWord] = useState<string>();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const language = queryParams.get('language');

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid);
        naloziBesede(user.uid);
        naloziNapake(user.uid);
      }
    });
  }, []);

  
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play();
    }
  }
  

  useEffect(() => {
    if (!selectedWord) return;

    const word = selectedWord;
    const newAudioSource = `${BASE_URL}/tts?tts=${encodeURIComponent(word)}&language=${language}`;

    setAudioSource(newAudioSource);
    playAudio();
  }, [selectedWord]);





  const handleWordClickAvailable = (word: Word) => {
    setSelectedWord(word.word)
  };

  const naloziBesede = (uid: string) => {
    fetch(`${BASE_URL}/getWords?uid=${uid}&language=${language}`)
      .then((response) => response.json())
      .then((data) => setWords(data.word))
      .catch((error) => console.error(error));
  };

  const naloziNapake = (uid: string) => {
    fetch(`${BASE_URL}/getMistakes?uid=${uid}&language=${language}`)
      .then((response) => response.json())
      .then((data) => setMistakes(data))
      .catch((error) => console.error(error));
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setSearchQuery('');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filterWordsBySearchQuery = (words: Word[], query: string) => {
    return words.filter(
      (word) =>
        word.word.toLowerCase().includes(query.toLowerCase()) ||
        word.slovenskiPrevod.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filterMistakesBySearchQuery = (mistakes: Word[], query: string) => {
    return mistakes.filter(
      (mistake) =>
        mistake.word.toLowerCase().includes(query.toLowerCase()) ||
        mistake.slovenskiPrevod.toLowerCase().includes(query.toLowerCase())
    );
  };

  let filteredWords = words;
  let filteredMistakes = mistakes;

  if (searchQuery) {
    filteredWords = filterWordsBySearchQuery(words, searchQuery);
    filteredMistakes = filterMistakesBySearchQuery(mistakes, searchQuery);

    
  }

  return (
  
    <Container className="container-fluid">
      
      <audio ref={audioRef} style={{ display: 'none' }}>
        <source src={audioSource} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
  <div className="row">
  <div className="col-12 col-sm-10 col-md-8 col-lg-10 col-xl-8 offset-sm-1 offset-md-2 offset-lg-1 offset-xl-2">
      <div className="button-group">
        <button
          className={`styled-button ${selectedOption === 'slovar' ? 'active' : ''}`}
          onClick={() => handleOptionClick('slovar')}
        >
          Slovar
        </button>
        <button
          className={`styled-button ${selectedOption === 'napake' ? 'active' : ''}`}
          onClick={() => handleOptionClick('napake')}
        >
          Napake
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          className="form-control"
          placeholder="Išči..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div>
      {selectedOption === 'slovar' && (
  <>
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h3 className="heading">Vaše besede:</h3>
      <button className="btn btn-sm btn-primary" >
        Custom Button
      </button>
    </div>
    <ListGroup className="list-group">
      {filteredWords.map((item, index) => (
        <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
          <span>
            <button onClick={() => handleWordClickAvailable(item)}>
              <BsFillVolumeUpFill style={{ fontSize: '50px', color: 'orange' }} />
            </button>
            {item.word}
          </span>
          <span className="text-secondary">{item.slovenskiPrevod}</span>
        </ListGroup.Item>
      ))}
    </ListGroup>
  </>
)}


        {selectedOption === 'napake' && (
          <>
            <h3 className="heading">Vaše napake:</h3>
            <ListGroup className="list-group">
  {filteredMistakes.map((item, index) => (
    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
      <button onClick={() => handleWordClickAvailable(item)} className="volume-button">
        <BsFillVolumeUpFill style={{ fontSize: '50px', color: 'orange' }} />
      </button>
      <span>{item.word}</span>
      <span className="text-secondary">{item.slovenskiPrevod}</span>
    </ListGroup.Item>
  ))}
</ListGroup>

          </>
        )}
      </div>
    </div>
  </div>
</Container>


  );
};

export default MojeBesede;