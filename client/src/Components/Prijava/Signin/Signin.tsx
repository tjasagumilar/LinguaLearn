import React, {useState} from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Button, FormGroup, Input } from 'reactstrap';
import { auth } from '../../../Config/firebase';
import logging from '../../../Config/logging';
import ErrorText from "../../ErrorText/ErrorText";


const Signin = () => {
    const [authenticating, setAuthenticating] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const history = useNavigate();

    const signInWithEmailAndPassword = () => {
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



    return (
        <div className="login-form">
            <div className="prijavise">
                Prijava
            </div>
            <div className="login-inputs">
                <div className="vnosna-polja">
                    <input type="email" placeholder="Email" onChange={event => setEmail(event.target.value)} value={email}/>
                    <input type="password" placeholder="Geslo" onChange={event => setPassword(event.target.value)} value={password}/>
                </div>
                <div className="login-button">
                    <button disabled={authenticating} onClick={() => signInWithEmailAndPassword()}>Prijava</button>
                </div>
                <div className="pozabljeno">
                    Pozabljeno geslo
                </div>
                <ErrorText error={error} />
            </div>
        </div>
    );
}

export default Signin;