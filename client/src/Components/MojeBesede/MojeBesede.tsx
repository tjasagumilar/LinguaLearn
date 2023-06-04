import React, { useState, useEffect } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../Config/firebase';

export interface Word{
    word: string
    slovenskiPrevod:string
}



const MojeBesede = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [uid, setUid] = useState('');

  const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const language = queryParams.get('language');

useEffect(() => {
    auth.onAuthStateChanged(user => {
        if (user) {
            setUid(user.uid);
            naloziBesede(user.uid)
        }
    });
}, []);
  
  const naloziBesede = (uid: string) => {
    fetch(`http://localhost:4000/getWords?uid=${uid}&language=${language}`) 
      .then(response => response.json())
      .then(data => setWords(data))
      .catch(error => console.error(error));
  }



  return (
    <Container>
      <ListGroup>
        {words.map((item, index) => (
          <ListGroup.Item key={index}>
            {item.word} - {item.slovenskiPrevod}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default MojeBesede;