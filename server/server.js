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
  const { email, password, username } = req.body;

  await createUserWithEmailAndPassword(auth, email, password)
    .then(cred => {
      
      dbFire.collection('users').doc(cred.user.uid).set({
        username: username
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


app.get('/g', (req, res) => {
  const exercises = [];

  fs.createReadStream('exercises/statements.csv')
    .pipe(csv())
    .on('data', (row) => {
      if (row.Difficulty === 'Easy') {
        exercises.push(row.Statement);
      }
    })
    .on('end', () => {
      res.json(exercises);
    });
});

const { PythonShell } = require('python-shell');

app.get('/generate', (req, res) => {
  const { spawn } = require('child_process');
  const pyProg = spawn('python', ['python/main.py']);
  let outputData = '';

  pyProg.stdout.on('data', function (data) {
    outputData += data.toString();
  });

  pyProg.stdout.on('end', function () {
    try {
      const jsonData = JSON.parse(outputData);
      const statement = jsonData.statement;

      translatte(statement, { to: 'de' })
        .then(translationResult => {
          const translation = translationResult.text;
          res.json({ translation, statement });
        })
        .catch(err => {
          console.error(err);
          res.status(500).send('Internal Server Error');
        });
    } catch (err) {
      console.error(err);
      res.status(500).send('Invalid JSON data');
    }
  });

  pyProg.stderr.on('data', function (data) {
    console.error(data.toString());
    res.status(500).send('Python Process Error');
  });
});

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
      const randomWord3= words[randomIndex3];

      res.json({randomWord, randomWord2, randomWord3});
    });
});

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

      res.json({randomWord});
    });
});

app.get('/prevediW/:word', (req, res) => {
  const { word } = req.params;

  translatte(word, { to: 'de' })
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




app.get('/text', (req, res) => {
  const url = googleTTS.getAudioUrl('Hello World', {
    lang: 'fr',
    slow: false,
    host: 'https://translate.google.com',
  });
  console.log(url);
});





const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: '',
  database: 'lingualearn'
})

app.listen(4000, () => { console.log("Listening on port 4000") })