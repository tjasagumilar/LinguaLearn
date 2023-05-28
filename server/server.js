const express = require('express');
const mysql = require('mysql')
const cors = require('cors')
const tf = require('@tensorflow/tfjs');
const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');
const { exec } = require('child_process');
const translatte = require('translatte');
const googleTTS = require('google-tts-api');
const { initializeApp } = require('firebase/app')
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, collection, getDocs } = require('firebase/firestore/lite');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());


var admin = require("firebase-admin");

var serviceAccount = require("./adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const firebaseConfig = {
  apiKey: "AIzaSyBveQTofx_gO7UhZ46n0jdOCFdmw1JcIGY",
  authDomain: "lingualearn-dev.firebaseapp.com",
  projectId: "lingualearn-dev",
  storageBucket: "lingualearn-dev.appspot.com",
  messagingSenderId: "169184155988",
  appId: "1:169184155988:web:c9fd4d3b25ce4ab77590c1"
};

const appFire = initializeApp(firebaseConfig);
const auth = getAuth(appFire);
const dbFire = admin.firestore();


//REGISTRACIJA UPORABNIKOV
app.post('/signup', async (req, res) => {
  const { email, password, username, slika } = req.body;

  await createUserWithEmailAndPassword(auth, email, password)
    .then(cred => {
      dbFire.collection('users').doc(cred.user.uid).set({
        username: username,
        slika: slika
      });
    }).then(() => {

      res.sendStatus(200);

    })
    .catch(error => {
      /*
      if (error.code.includes('auth/weak-password')) {
        res.status(400).json({ message: 'Please enter a stronger password.' });
      }
      else if (error.code.includes('auth/email-already-in-use')) {
        res.status(409).json({ message: 'Email already in use.' });
      }
      else {
        res.status(500).json({ message: 'Unable to register.  Please try again later.' })
      }
      */
      res.status(500).json({ message: 'Napaka' })
    });
});


//PRIJAVA UPORABNIKOV 
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  await signInWithEmailAndPassword(auth, email, password)
    .then(result => {
      res.sendStatus(200);
    })
    .catch(error => {
      res.status(500).json({ error: "Napaka" });
    });
});

//IZBIRA JEZIKA 
app.post('/izbirajezika', (req, res) => {
  const { jezik, naziv, nivo, uid, path } = req.body;
  const tezavnost = 0;
  dbFire.collection('users').doc(uid).collection('jeziki')
    .add({ jezik: jezik, naziv: naziv, nivo: nivo, tezavnost: tezavnost, path: path })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Napaka:', error);
      res.status(500).send('Napaka bi dodajanju jezika.');
    });
});

// UREJANJE PROFILA 
app.post('/uredi', (req, res) => {
  const { uid, username, ime, priimek, slika, opis } = req.body;

  dbFire.collection('users').doc(uid)
    .set({ username: username, ime: ime, priimek: priimek, slika: slika, opis: opis }, { merge: true })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Napaka:', error);
      res.status(500).send('Napaka');
    });
});

//PRIDOBITEV PODATKOV DOLOČENEGA UPORABNIKA
app.get('/uporabnik', (req, res) => {
  const uid = req.query.uid;

  dbFire.collection('users')
    .doc(uid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        res.status(200).json(data);
      } else {
        res.status(404).send('User not found');
      }
    })
    .catch((error) => {
      console.log('Error getting user:', error);
      res.status(500).send('Internal server error');
    });

});

//PRIDOBITEV IZBRANIH JEZIKOV DOLOČENEGA UPORABNIKA
app.get('/mojijeziki', async (req, res) => {
  const uid = req.query.uid;

  const jezikiRef = dbFire.collection('users').doc(uid).collection('jeziki');
  const querySnapshot = await jezikiRef.get();
  const jezikiData = [];

  querySnapshot.forEach((doc) => {
    jezikiData.push(doc.data());
  });

  res.send(jezikiData);
});

//-------------------------------------------------

async function getCities(dbFire) {
  const citiesCol = collection(dbFire, 'test');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
}



app.get('/fire', async (req, res) => {
  try {
    const cities = await getCities(dbFire);
    res.json(cities);
  } catch (error) {
    console.error('Error :', error);
    res.status(500).json({ error: 'Failed' });
  }
});


// generiraj poved glede na težavnost 
const { spawn } = require('child_process');

app.get('/generate', async (req, res) => {
  const uid = req.query.uid;
  const jezikiRef = dbFire.collection('users').doc(uid).collection('jeziki');
  const querySnapshot = await jezikiRef.get();
  let jezikiData;


  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.tezavnost !== undefined) {
      jezikiData = data.tezavnost;
    }
  });

  console.log(jezikiData)

  const difficulty = jezikiData
  console.log(difficulty)
  const pyProg = spawn('python', ['python/main.py', difficulty]);
  let outputData = '';

  pyProg.stdout.on('data', data => outputData += data.toString());

  pyProg.stdout.on('end', () => {
    const { statement, prediction, difficulty } = JSON.parse(outputData);
    translatte(statement, { to: 'de' }).then(translationResult =>
      res.json({
        translation: translationResult.text,
        statement,
        prediction,
        difficulty
      }));
  });

  pyProg.stderr.on('data', data => console.error(data.toString()));
});

// prevedi poved ali besedo

app.get('/prevedi/:statement', (req, res) => {
  const { statement } = req.params;

  translatte(statement, { to: 'de' })
    .then(translationResult => {
      const translation = translationResult.text;
      console.log(translation)
      res.json({ translation });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Translation Error');
    });
});

// generiraj 3 besede random

app.get('/generateWord', (req, res) => {
  const words = [];
  fs.createReadStream('csvBesede.csv')
    .pipe(csv())
    .on('data', (data) => {
      words.push(data.word);
    })
    .on('end', () => {
      const randomIndex = Math.floor(Math.random() * words.length);
      const randomIndex2 = Math.floor(Math.random() * words.length);
      const randomIndex3 = Math.floor(Math.random() * words.length);
      const randomWord = words[randomIndex];
      const randomWord2 = words[randomIndex2];
      const randomWord3 = words[randomIndex3];

      res.json({ randomWord, randomWord2, randomWord3 });
    });
});

// generiraj 1 besedo 

app.get('/generateWordOne', (req, res) => {
  const words = [];
  fs.createReadStream('csvBesede.csv')
    .pipe(csv())
    .on('data', (data) => {
      words.push(data.word);
    })
    .on('end', () => {
      const randomIndex = Math.floor(Math.random() * words.length);

      const randomWord = words[randomIndex];

      res.json({ randomWord });
    });
});

app.get('/generirajSliko', (req, res) => {
  const exercises = [];

  fs.createReadStream('slike.csv')
    .pipe(csv())
    .on('data', (row) => {
      if (row.difficulty === 'easy') {
        exercises.push(row.label);
      }
    })
    .on('end', () => {
      const randomIndex = Math.floor(Math.random() * exercises.length);
      const randomExercise = exercises[randomIndex];
      res.json(randomExercise);
    });
});


app.get('/slika', (req, res) => {
  const API_KEY = '36374853-199e3fdaa90425e05a17a1fa2';

  axios.get('http://localhost:4000/generirajSliko')
    .then(response => {
      const query = response.data;
      const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}`;


      axios.get(URL)
        .then(response => {
          const data = response.data;
          if (parseInt(data.totalHits) > 0) {
            const firstHit = data.hits[1];
            res.json({ pageURL: firstHit.webformatURL, beseda: query });
          } else {
            res.json({ message: 'No hits' });
          }
        })
        .catch(error => {
          res.json({ error: error.message });
        });
    })
    .catch(error => {
      res.json({ error: error.message });
    });
});





app.get('/tts', (req, res) => {
  const url = googleTTS.getAudioUrl('Hello World', {
    lang: 'en',
    slow: false,
    host: 'https://translate.google.com',
  });
  res.json({ url: url })
});





const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: '',
  database: 'lingualearn'
})

app.listen(4000, () => { console.log("Listening on port 4000") })