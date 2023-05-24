import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, FormGroup, Input } from 'reactstrap';
import { auth } from '../../../Config/firebase';
import logging from '../../../Config/logging';
import ErrorText from "../../ErrorText/ErrorText";
import "../Prijava.css"

interface IPageProps {
    name: string;
}

const LogoutPage: React.FunctionComponent<IPageProps> = props => {
    const history = useNavigate();

    const Logout = () => {
        auth.signOut()
            .then(() => history('/prijava'))
            .catch(error => logging.error(error));
    }

    return (
        <div className="login-form">
            <div className="prijavise">
                Are you sure you want to logout?
            </div>
            <div className="login-inputs">
                <div className="login-button">
                    <button onClick={() => history('/')}>Cancel</button>
                    <button onClick={() => Logout()}>Logout</button>
                </div>
            </div>
        </div>
    );
}

export default LogoutPage;