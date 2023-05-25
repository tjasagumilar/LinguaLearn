import React, { useState } from 'react';
import { Button, FormGroup, Input } from 'reactstrap';
import ErrorText from "../../ErrorText/ErrorText";
import { auth, firestore } from "../../../Config/firebase";
import logging from "../../../Config/logging";

const Forgot: React.FunctionComponent = () => {
    const [sending, setSending] = useState<boolean>(false);
    const [sent, setSent] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');

    const resetPasswordRequest = () => {
        if (error !== '') setError('');

        setSending(true);

        auth.sendPasswordResetEmail(email)
            .then(() => {
                logging.info('Email sent.');
                setSent(true);
                setSending(false);
            })
            .catch((error: { message: React.SetStateAction<string>; }) => {
                logging.error(error);
                setError(error.message);
                setSending(false);
            });
    }

    return (
        <div className="login-form">
            <div className="prijavise">
                {sent ?
                    <p>A link has been sent to your email with instructions.</p>
                    :
                    <>
                        <p>Please enter your email.</p>
                        <FormGroup>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Email Address"
                                onChange={event => setEmail(event.target.value)}
                                value={email}
                            />
                        </FormGroup>
                        <Button
                            disabled={sending}
                            color="success"
                            block
                            onClick={() => resetPasswordRequest()}
                        >
                            Send Reset Link
                        </Button>
                        <ErrorText error={error} />
                    </>
                }
            </div>
        </div>
    );
}

export default Forgot;
