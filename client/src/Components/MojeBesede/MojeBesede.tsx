import React, { useState, useEffect } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../Config/firebase';
import { BASE_URL } from '../../api';

export interface Word{
    word: string
    slovenskiPrevod:string
}



const MojeBesede = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [mistakes, setMistakes] = useState<Word[]>([])
  const [uid, setUid] = useState('');

  const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const language = queryParams.get('language');

useEffect(() => {
    auth.onAuthStateChanged(user => {
        if (user) {
            setUid(user.uid);
            naloziBesede(user.uid)
            naloziNapake(user.uid)
        }
    });
}, []);
  
  const naloziBesede = (uid: string) => {
    fetch(`${BASE_URL}/getWords?uid=${uid}&language=${language}`) 
      .then(response => response.json())
      .then(data => setWords(data))
      .catch(error => console.error(error));
  }

  const naloziNapake = (uid: string) => {
    fetch(`${BASE_URL}/getMistakes?uid=${uid}&language=${language}`) 
      .then(response => response.json())
      .then(data => setMistakes(data))
      .catch(error => console.error(error));
  }



  return (
    <Container>
      <h3 className="mt-4">Vaš slovar besed:</h3>
      <ListGroup className="mb-4">
        {words.map((item, index) => (
          <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
            <span>{item.word}</span>
            <span className="text-secondary">{item.slovenskiPrevod}</span>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <h3 className="mt-4">Vaše napake:</h3>
      <ListGroup>
        {mistakes.map((item, index) => (
          <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
            <span>{item.word}</span>
            <span className="text-secondary">{item.slovenskiPrevod}</span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default MojeBesede;