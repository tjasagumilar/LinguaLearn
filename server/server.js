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
const { getFirestore, collection, getDocs } = require('firebase/firestore/lite');

const app = express()
app.use(cors())


const firebaseConfig = {
  apiKey: "AIzaSyBveQTofx_gO7UhZ46n0jdOCFdmw1JcIGY",
  authDomain: "lingualearn-dev.firebaseapp.com",
  projectId: "lingualearn-dev",
  storageBucket: "lingualearn-dev.appspot.com",
  messagingSenderId: "169184155988",
  appId: "1:169184155988:web:c9fd4d3b25ce4ab77590c1"
};

const appFire = initializeApp(firebaseConfig);
const dbFire = getFirestore(appFire);

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
    translatte(outputData, { to: 'de' })
      .then(translationResult => {
        console.log(translationResult.text);
        res.write(translationResult.text); 
        res.end('end');
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Internal Server Error');
      });
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

app.listen(5000, () => { console.log("Listening on port 5000") })