import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, FormGroup, Input } from 'reactstrap';
import { auth } from '../../../Config/firebase';
import logging from '../../../Config/logging';
import ErrorText from "../../ErrorText/ErrorText";

const Signup = () => {
    const [registering, setRegistering] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirm, setConfirm] = useState<string>('');
    const [error, setError] = useState<string>('');

    const history = useNavigate();

    const signUpWithEmailAndPassword = () => {
        if (password !== confirm)
        {
            setError('Please make sure your passwords match.');
            return;
        }

        if (error !== '') setError('');

        setRegistering(true);

        auth.createUserWithEmailAndPassword(email, password)
            .then(result => {
                logging.info(result);
                history('/prijava');
            })
            .catch(error => {
                logging.error(error);

                if (error.code.includes('auth/weak-password'))
                {
                    setError('Please enter a stronger password.');
                }
                else if (error.code.includes('auth/email-already-in-use'))
                {
                    setError('Email already in use.');
                }
                else
                {
                    setError('Unable to register.  Please try again later.')
                }

                setRegistering(false);
            });
    }

    return (
        <div className="login-form">
            <div className="prijavise">
                Ustvarite račun
            </div>
            <div className="login-inputs">
                <div className="vnosna-polja">
                    <input type="text" placeholder="Uporabniško ime"/>
                    <input type="email" placeholder="Email" onChange={event => setEmail(event.target.value)} value={email}/>
                    <input type="password" placeholder="Geslo" onChange={event => setPassword(event.target.value)} value={password}/>
                    <input type="password" placeholder="Ponovite geslo" onChange={event => setConfirm(event.target.value)} value={confirm}/>
                </div>
                <div className="login-button">
                    <button disabled={registering} onClick={() => signUpWithEmailAndPassword()}>Ustvari</button>
                </div>
                <ErrorText error={error} />
            </div>
        </div>
    );
}

export default Signup;