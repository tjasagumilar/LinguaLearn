import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import ErrorText from "../../ErrorText/ErrorText";
import { auth } from "../../../Config/firebase";
import logging from "../../../Config/logging";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

import { Button } from "react-bootstrap";

const Signin = () => {
    const [authenticating, setAuthenticating] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const history = useNavigate();

    const handleSubmit = () => {
        if (error !== '') setError('');

        setAuthenticating(true);

        auth.signInWithEmailAndPassword(email, password)
            .then(result => {
                logging.info(result);
                history('/');
            })
            .catch(error => {
                logging.error(error);
                setAuthenticating(false);
                setError('Nepravilno e-poštni naslov ali geslo. Prosimo, poskusite znova.');
            });
    }

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then((result) => {
                logging.info(result);
                history('/');
            })
            .catch((error) => {
                logging.error(error);
                setError(error.message);
            });
    };


    return (
        <div className="login-form">
            <div className="prijavise">
                Prijava
            </div>
            <div className="login-inputs">
                <div className="vnosna-polja">
                    <input type="email" placeholder="Email" onChange={event => setEmail(event.target.value)} value={email} />
                    <input type="password" placeholder="Geslo" onChange={event => setPassword(event.target.value)} value={password} />
                </div>
                <div className="login-button">
                    <Button onClick={() => handleSubmit()}>Prijava</Button>
                </div>
                <div className="login-button">
                    <Button onClick={signInWithGoogle}>Google Prijava</Button>
                </div>
                <div className="pozabljeno-button">
                    <a href="/forgot">Pozabljeno geslo</a> <br/>
                    <a href="/registracija" className="brez-racuna">Še nimaš računa?</a>
                </div>
                <ErrorText error={error} />
            </div>
        </div>
    );
}

export default Signin;