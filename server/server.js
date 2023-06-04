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
  const xp = 0;
  dbFire.collection('users').doc(uid).collection('jeziki')
    .add({ jezik: jezik, naziv: naziv, nivo: nivo, tezavnost: tezavnost, path: path, mojeBesede: [], xpSkupen: xp , xpDummy: xp })
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

//ODSTRANI IZBRANI JEZIK 
app.delete('/odstranijezik', (req, res) => {
  const { jezik, uid } = req.body;

  const userRef = dbFire.collection('users').doc(uid);
  const query = userRef.collection('jeziki').where('jezik', '==', jezik);

  query.get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        console.log('No matching documents found');
        return;
      }

      querySnapshot.forEach((doc) => {
        doc.ref.delete()
          .then(() => {
            // console.log('Document successfully deleted!');
            res.sendStatus(200);
          })
          .catch((error) => {
            console.error('Error deleting document: ', error);
          });
      });
    })
    .catch((error) => {
      console.error('Error getting documents: ', error);
    });

});

// -------------------------------------------------------------------------------------------
//  N A L O G E               
// -------------------------------------------------------------------------------------------

//shrani naloge v bazo
app.post('/saveExercises', async (req, res) => {
  const { exercises, uid, language } = req.body;

  const currentTime = new Date();
  const solved = false;
  const solvedRight = 0;
  const xp = 0;

  try {
    const userRef = dbFire.collection('users').doc(uid);
    const jezikiRef = userRef.collection('jeziki');
    const jezikQuery = await jezikiRef.where('jezik', '==', language).get();

    if (!jezikQuery.empty) {
      const jezikDocSnapshot = jezikQuery.docs[0];
      const nalogeRef = jezikDocSnapshot.ref.collection('naloge');
      const nalogeDocRef = await nalogeRef.add({ exercises, solved, currentTime, solvedRight, xp });
      const docId = nalogeDocRef.id;
      res.status(200).send(docId);

    } else {
      console.log('Jezik ne obstaja');
      res.status(500).send('Napaka pri shranjevanju nalog.');

    }
  } catch (error) {
    console.error('Napaka:', error);
    res.status(500).send('Napaka pri shranjevanju nalog.');
  }
});

//naloži naloge iz baze
app.get('/loadExercises', async (req, res) => {
  const uid = req.query.uid;
  const language = req.query.language;

  const jezikiRef = dbFire.collection('users').doc(uid).collection('jeziki');
  const jezikQuerySnapshot = await jezikiRef.where('jezik', '==', language).limit(1).get();

  if (jezikQuerySnapshot.empty) {
    res.send(null);
    return;
  }

  const jezikDocSnapshot = jezikQuerySnapshot.docs[0];
  const nalogeRef = jezikDocSnapshot.ref.collection('naloge');
  const querySnapshot = await nalogeRef.orderBy('currentTime', 'desc').limit(1).get();

  let nalogeData = null;
  const currentTime = new Date();
  const tenMins = new Date(currentTime.getTime() - 10 * 60 * 1000);

  querySnapshot.forEach((doc) => {
    const docData = doc.data();
    console.log(docData && currentTime > tenMins)
    if (docData.solved === false && currentTime > tenMins) {
      nalogeData = { id: doc.id, ...docData };
    }
  });


  res.send(nalogeData);
});

//spremeni reseno nalogo na true
app.post('/trueExercise', async (req, res) => {
  const { uid, exerciseId, document, language } = req.body;


  const userRef = dbFire.collection('users').doc(uid);
  const jezikiRef = userRef.collection('jeziki');
  const jezikQuerySnapshot = await jezikiRef.where('jezik', '==', language).limit(1).get();
  const jezikDocSnapshot = jezikQuerySnapshot.docs[0];
  const nalogeRef = jezikDocSnapshot.ref.collection('naloge').doc(document);

  nalogeRef.get()
    .then((doc) => {
      const data = doc.data();
      let exercises = data.exercises;
      let toUpdate = exercises.find(exercise => exercise.index === exerciseId);

      if (toUpdate) {
        toUpdate.solved = true;
        nalogeRef.update({
          exercises: exercises
        }).then(() => {
          console.log("Dokument uspešno posodobljen!");
          res.sendStatus(200);
        })
          .catch((error) => {
            console.error("Error pri updejtanju dokumenta: ", error);
            res.status(500).send('Error');
          });
      }
    })
    .catch((error) => {
      console.log('Error :', error);
    });
});

//spremeni session nalog solved na true
app.post('/trueExercises', async (req, res) => {
  const { uid, document, language } = req.body;


  const userRef = dbFire.collection('users').doc(uid);
  const jezikiRef = userRef.collection('jeziki');
  const jezikQuerySnapshot = await jezikiRef.where('jezik', '==', language).limit(1).get();
  const jezikDocSnapshot = jezikQuerySnapshot.docs[0];
  const docRef = jezikDocSnapshot.ref.collection('naloge').doc(document);

  docRef.update({
    solved: true
  }).then(() => {
    console.log("Dokument uspešno posodobljen!");
    res.sendStatus(200);
  })
    .catch((error) => {
      console.error("Error pri updejtanju dokumenta: ", error);
      res.status(500).send('Napaka');
    });
});

//spremeni število pravilno rešenih 

app.post('/solvedCorrect', async (req, res) => {
  const { uid, document, language } = req.body;

  const userRef = dbFire.collection('users').doc(uid);
  const jezikiRef = userRef.collection('jeziki');
  const jezikQuerySnapshot = await jezikiRef.where('jezik', '==', language).limit(1).get();
  const jezikDocSnapshot = jezikQuerySnapshot.docs[0];
  const docRef = jezikDocSnapshot.ref.collection('naloge').doc(document);

  docRef.get().then((doc) => {
    if (doc.exists) {
      let solvedRight = doc.data().solvedRight;
      solvedRight = solvedRight + 1;
      const xp = solvedRight * 5; // za vsako pravilno rešeno nalogo dobi 5 xp-ja

      docRef.update({
        solvedRight: solvedRight,
        xp: xp
      }).then(() => {
        console.log("Dokument uspešno posodobljen!"); 

        jezikDocSnapshot.ref.get().then((jezikDoc) => {
          if (jezikDoc.exists) {
            let xpSkupen = jezikDoc.data().xpSkupen + xp - doc.data().xp; // posodobi skupen xp
            let xpDummy = jezikDoc.data().xpDummy + xp - doc.data().xp;
            let tezavnost = jezikDoc.data().tezavnost;
            let nivo = jezikDoc.data().nivo;
            if (xpDummy >= 300) {
              tezavnost = tezavnost +1 ;
              xpDummy = xpDummy - 300;
              console.log(tezavnost)
            }
              if (tezavnost >= 90) {
                nivo = "Prvak";
              } else if (tezavnost >= 60) {
                nivo = "Pustolovec";
              } else if (tezavnost >= 30) {
                nivo = "Raziskovalec";
              }
            
            jezikDocSnapshot.ref.update({
              xpSkupen: xpSkupen,
              xpDummy: xpDummy,
              tezavnost: tezavnost,
              nivo: nivo
            }).then(() => {
              console.log("xpSkupen, xpDummy, tezavnost, and nivo updated successfully!");
              res.sendStatus(200);
            }).catch((error) => {
              console.error("Error updating xpSkupen, xpDummy, tezavnost, and nivo:", error);
              res.status(500).send('Napaka');
            });
          } else {
            console.log("No such jezik document!");
          }
        }).catch((error) => {
          console.error("Error getting jezik document:", error);
        });

      }).catch((error) => {
        console.error("Error pri updejtanju dokumenta: ", error);
        res.status(500).send('Napaka');
      });
    } else {
      console.log("No such document!");
    }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });
});

/*
app.post('/solvedCorrect', async (req, res) => {
  const { uid, document, language } = req.body;

  const userRef = dbFire.collection('users').doc(uid);
  const jezikiRef = userRef.collection('jeziki');
  const jezikQuerySnapshot = await jezikiRef.where('jezik', '==', language).limit(1).get();
  const jezikDocSnapshot = jezikQuerySnapshot.docs[0];
  const docRef = jezikDocSnapshot.ref.collection('naloge').doc(document);

  docRef.get().then((doc) => {
    if (doc.exists) {
      let solvedRight = doc.data().solvedRight;
      solvedRight = solvedRight + 1;
      xp = solvedRight * 5; // za vsako pravilno rešeno nalogo dobi 5 xp-ja

      docRef.update({
        solvedRight: solvedRight,
        xp: xp
      }).then(() => {
        console.log("Dokument uspešno posodobljen!");
        res.sendStatus(200);
      })
        .catch((error) => {
          console.error("Error pri updejtanju dokumenta: ", error);
          res.status(500).send('Napaka');
        });
    } else {
      console.log("No such document!");
    }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });
});

*/

// generiraj poved glede na težavnost 
const { spawn } = require('child_process');
const csvParser = require('csv-parser');
const { SourceTextModule } = require('vm');

app.get('/generate', async (req, res) => {
  const uid = req.query.uid;
  const language = req.query.language;
  const jezikiRef = dbFire.collection('users').doc(uid).collection('jeziki');
  const querySnapshot = await jezikiRef.get();
  let jezikiData;

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.tezavnost !== undefined) {
      jezikiData = data.tezavnost;
    }
  });

  const difficulty = jezikiData
  let selectedStatement = null;
  let count = 0;

  const stream = fs.createReadStream('output.csv')
    .pipe(csvParser())
    .on('data', (row) => {
      const prediction = parseFloat(row['Prediction'])
      if (prediction >= difficulty - 5 && prediction <= difficulty + 8) {
        count++;
        if (Math.random() < 1 / count) {
          selectedStatement = row['Statement'];
        }
      }
    })

  stream.on('end', async () => {
    if (selectedStatement != null) {
      try {
        const translationResult = await translatte(selectedStatement, { to: 'sl' });
        const result = await translatte(selectedStatement, { to: language });
        res.json({ statement: selectedStatement, translation: result.text, slovenianTranslation: translationResult.text });
      } catch (err) {
        console.error(err);
        res.status(500).send('Napaka pri prevodu');
      }
    } else {
      res.status(404).json({ error: 'Primerna poved ni najdena' });
    }
  });
});

// prevedi poved ali besedo

app.get('/prevedi/:language/:statement', (req, res) => {
  const statement = req.params.statement;
  const language = req.params.language;

  console.log(statement)
  console.log(language)

  translatte(statement, { to: language })
    .then(translationResult => {
      const translation = translationResult.text;
      console.log(translation)
      res.json({ translation });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Napaka v prevodu');
    });
});

// generiraj 3 besede random

app.get('/generateWord', async (req, res) => {
  const uid = req.query.uid;
  const language = req.query.language;

  const jezikiRef = dbFire.collection('users').doc(uid).collection('jeziki');
  const querySnapshot = await jezikiRef.get();
  let jezikiData;


  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.tezavnost !== undefined) {
      jezikiData = data.tezavnost;
    }
  });
  const difficulty = jezikiData

  const words = [];
  fs.createReadStream('words.csv')
    .pipe(csvParser())
    .on('data', (data) => {
      const dataDifficulty = Number(data.difficulty);

      if ((0 <= difficulty && difficulty <= 5) && dataDifficulty <= 20) {
        words.push(data.word);
      } else if ((6 <= difficulty && difficulty <= 10) && dataDifficulty <= 50) {
        words.push(data.word);
      } else if ((11 <= difficulty && difficulty <= 16) && dataDifficulty <= 60) {
        words.push(data.word);
      } else if ((17 <= difficulty && difficulty <= 22) && dataDifficulty <= 70) {
        words.push(data.word);
      } else if ((23 <= difficulty && difficulty <= 28) && dataDifficulty <= 80) {
        words.push(data.word);
      } else if ((29 <= difficulty && difficulty <= 34) && dataDifficulty <= 90) {
        words.push(data.word);
      } else if ((35 <= difficulty && difficulty <= 40) && dataDifficulty <= 100) {
        words.push(data.word);
      } else if ((41 <= difficulty && difficulty <= 51) && dataDifficulty <= 120) {
        words.push(data.word);
      } else if ((52 <= difficulty && difficulty <= 57) && dataDifficulty <= 130) {
        words.push(data.word);
      } else if ((58 <= difficulty && difficulty <= 63) && dataDifficulty <= 150) {
        words.push(data.word);
      } else if ((64 <= difficulty && difficulty <= 69) && dataDifficulty <= 160) {
        words.push(data.word);
      } else if ((71 <= difficulty && difficulty <= 76) && dataDifficulty <= 180) {
        words.push(data.word);
      } else if ((77 <= difficulty && difficulty <= 82) && dataDifficulty <= 190) {
        words.push(data.word);
      } else if ((83 <= difficulty && difficulty <= 88) && dataDifficulty <= 210) {
        words.push(data.word);
      } else if ((89 <= difficulty && difficulty <= 94) && dataDifficulty <= 220) {
        words.push(data.word);
      } else if ((90 <= difficulty && difficulty <= 100) && dataDifficulty <= 250) {
        words.push(data.word);
      } else if (difficulty > 100) {
        words.push(data.word)
      }
    })
    .on('end', () => {
      const randomWord = words[Math.floor(Math.random() * words.length)];
    const randomWord2 = words[Math.floor(Math.random() * words.length)];
    const randomWord3 = words[Math.floor(Math.random() * words.length)];

    Promise.all([
      translatte(randomWord, { to: language }),
      translatte(randomWord2, { to: language }),
      translatte(randomWord3, { to: language })
    ])
    .then(([translationResult1, translationResult2, translationResult3]) => {
      res.json({ 
        randomWord: randomWord, 
        randomWord2: randomWord2, 
        randomWord3: randomWord3, 
        translation1: translationResult1.text, 
        translation2: translationResult2.text, 
        translation3: translationResult3.text 
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Napaka v prevodu');
    });
  })
});

// generiraj 1 besedo 
app.get('/generateWordOne', async (req, res) => {
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
  const difficulty = jezikiData
  const words = [];

  fs.createReadStream('words.csv')
    .pipe(csvParser())
    .on('data', (data) => {
      const dataDifficulty = Number(data.difficulty);

      if ((0 <= difficulty && difficulty <= 5) && dataDifficulty <= 20) {
        words.push(data.word);
      } else if ((6 <= difficulty && difficulty <= 10) && dataDifficulty <= 50) {
        words.push(data.word);
      } else if ((11 <= difficulty && difficulty <= 16) && dataDifficulty <= 60) {
        words.push(data.word);
      } else if ((17 <= difficulty && difficulty <= 22) && dataDifficulty <= 70) {
        words.push(data.word);
      } else if ((23 <= difficulty && difficulty <= 28) && dataDifficulty <= 80) {
        words.push(data.word);
      } else if ((29 <= difficulty && difficulty <= 34) && dataDifficulty <= 90) {
        words.push(data.word);
      } else if ((35 <= difficulty && difficulty <= 40) && dataDifficulty <= 100) {
        words.push(data.word);
      } else if ((41 <= difficulty && difficulty <= 51) && dataDifficulty <= 120) {
        words.push(data.word);
      } else if ((52 <= difficulty && difficulty <= 57) && dataDifficulty <= 130) {
        words.push(data.word);
      } else if ((58 <= difficulty && difficulty <= 63) && dataDifficulty <= 150) {
        words.push(data.word);
      } else if ((64 <= difficulty && difficulty <= 69) && dataDifficulty <= 160) {
        words.push(data.word);
      } else if ((71 <= difficulty && difficulty <= 76) && dataDifficulty <= 180) {
        words.push(data.word);
      } else if ((77 <= difficulty && difficulty <= 82) && dataDifficulty <= 190) {
        words.push(data.word);
      } else if ((83 <= difficulty && difficulty <= 88) && dataDifficulty <= 210) {
        words.push(data.word);
      } else if ((89 <= difficulty && difficulty <= 94) && dataDifficulty <= 220) {
        words.push(data.word);
      } else if ((90 <= difficulty && difficulty <= 100) && dataDifficulty <= 250) {
        words.push(data.word);
      } else if (difficulty > 100) {
        words.push(data.word)
      }
    })
    .on('end', () => {
      if (words.length > 0) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        res.json({ randomWord });
      } else {
        res.status(404).json({ error: 'Primerna beseda ni najdena' });
      }
    });
});

// generira besedo za sliko

app.get('/generirajSliko', async (req, res) => {

  const difficulty = req.query.difficulty;
  const exercises = [];

  fs.createReadStream('slike.csv')
    .pipe(csv())
    .on('data', (row) => {
      if ((0 <= difficulty && difficulty <= 50) && row.difficulty === 'easy') {
        exercises.push(row.label);
      } else if ((51 <= difficulty && difficulty <= 101) && row.difficulty === 'medium') {
        exercises.push(row.label)
      } else if ((difficulty > 102) && row.difficulty === 'hard') {
        exercises.push(row.label)
      }
    })
    .on('end', () => {
      const randomIndex = Math.floor(Math.random() * exercises.length);
      const randomExercise = exercises[randomIndex];
      res.json(randomExercise);
    });
});

// generira URL za sliko

app.get('/slika', async (req, res) => {

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


  const API_KEY = '36374853-199e3fdaa90425e05a17a1fa2';

  axios
    .get('http://localhost:4000/generirajSliko', {
      params: {
        difficulty: jezikiData
      },
    })
    .then((response) => {
      const query = response.data;
      const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}`;


      axios.get(URL)
        .then(response => {
          const data = response.data;
          if (parseInt(data.totalHits) > 0) {
            const firstHit = data.hits[1];
            res.json({ pageURL: firstHit.webformatURL, beseda: query });
          } else {
            res.json({ message: 'Ni zadetkov' });
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


// text to speech 

app.get('/tts', async (req, res) => {
  const text = req.query.tts;
  const language = req.query.language;

  const url = googleTTS.getAudioUrl(text, {
    lang: language,
    slow: false,
    host: 'https://translate.google.com',
  });

  res.setHeader('Content-Type', 'audio/mpeg');

  const response = await axios({
    method: 'get',
    url: url,
    responseType: 'stream'
  });

  response.data.pipe(res);
});

// -------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------



// -------------------------------------------------------------------------------------------
// S T A T I S T I K A 
// -------------------------------------------------------------------------------------------
//dodaj besedo na seznam znanih besed
app.post('/yourWords', async (req, res) => {
  const { uid, newWord, language , slovenskiPrevod,type} = req.body;


  const userRef = dbFire.collection('users').doc(uid);
  const jezikiRef = userRef.collection('jeziki');
  const jezikQuerySnapshot = await jezikiRef.where('jezik', '==', language).limit(1).get();
  const jezikDocSnapshot = jezikQuerySnapshot.docs[0];
  console.log(jezikDocSnapshot)

  const docRef = jezikDocSnapshot.ref;

  docRef.update({
    mojeBesede: admin.firestore.FieldValue.arrayUnion({ word: newWord, slovenskiPrevod: slovenskiPrevod , type: type})
  }).then(() => {
    console.log("Dokument uspešno posodobljen!");
    res.sendStatus(200);
  })
    .catch((error) => {
      console.error("Error pri updejtanju dokumenta: ", error);
      res.status(500).send('Napaka');
    });
});

//pridobi znane besede

app.get('/getWords', async (req, res) => {
  const { uid, language } = req.query;
  console.log(uid)
  console.log(language)
  
  const userRef = dbFire.collection('users').doc(uid);
  const jezikiRef = userRef.collection('jeziki');
  const jezikQuerySnapshot = await jezikiRef.where('jezik', '==', language).limit(1).get();
  const jezikDocSnapshot = jezikQuerySnapshot.docs[0];

  const docRef = jezikDocSnapshot.ref;
  const docData = await docRef.get();

  if (!docData.exists) {
    res.status(404).send('Dokument ne obstaja!');
  } else {
    const wordsData = docData.data().mojeBesede;
    res.send(wordsData);
  }
});



// -------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------
//  P R E V E R I  T E Z A V N O S T
// -------------------------------------------------------------------------------------------


app.get('/getRank', async (req, res) => {
  const { uid, language } = req.query;
  console.log(uid)
  console.log(language)
  
  const userRef = dbFire.collection('users').doc(uid);
  const jezikiRef = userRef.collection('jeziki');
  const jezikQuerySnapshot = await jezikiRef.where('jezik', '==', language).limit(1).get();
  const jezikDocSnapshot = jezikQuerySnapshot.docs[0];

  const docRef = jezikDocSnapshot.ref;
  const docData = await docRef.get();


  if (!docData.exists) {
    res.status(404).send('Dokument ne obstaja!');
  } else {
    const wordsData = docData.data().nivo;
    console.log(wordsData)
    res.json({rank: wordsData});
  }
});











// -------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: '',
  database: 'lingualearn'
})

app.listen(4000, () => { console.log("Listening on port 4000") })