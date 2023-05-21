import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';
import config from '../Config/config';

const Firebase = firebase.initializeApp(config.firebase);

export const Providers = {
    google: new firebase.auth.GoogleAuthProvider()
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const analytics = firebase.analytics();
export default Firebase;

