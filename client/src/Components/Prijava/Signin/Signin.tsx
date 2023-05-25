import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import ErrorText from "../../ErrorText/ErrorText";
import { auth, firestore } from "../../../Config/firebase";
import logging from "../../../Config/logging";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';
import Nav from "react-bootstrap/Nav";



const Signin = () => {
    const [authenticating, setAuthenticating] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

/*
    const navigate = useNavigate();

    const handleSubmit = () => {

        const formData = {
            email: email,
            password: password,
        };

        fetch('http://localhost:5000/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (response.status === 200) {
                    navigate('/');
                }
            })
            .catch(error => {
                console.log(error);
            });

    };
*/

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
                setError(error.message);
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
                    <button onClick={() => handleSubmit()}>Prijava</button>
                </div>
                <div className="login-button">
                    <button onClick={signInWithGoogle}>Google Prijava</button>
                </div>
                <div className="login-button">
                    <Nav.Link href="/forgot">
                        <button>Pozabljeno geslo</button>
                    </Nav.Link>
                </div>
                <ErrorText error={error} />
            </div>
        </div>
    );
}

export default Signin;