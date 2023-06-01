import React, { useState } from 'react';
import ErrorText from "../../ErrorText/ErrorText";
import { auth } from "../../../Config/firebase";
import logging from "../../../Config/logging";
import './Forgot.css';

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
                logging.info('Poslana e-pošta.');
                setSent(true);
                setSending(false);
            })
            .catch((error: { message: React.SetStateAction<string> }) => {
                logging.error(error);
                setError('Prosim, vnesite vaš elektronski naslov.');
                setSending(false);
            });
    };

    return (
        <div className="forgot-container">
            <div className="forgot-content">
                {sent ? (
                    <p>V vaše e-poštno sporočilo je bila poslana povezava z navodili.</p>
                ) : (
                    <>
                        <p>Vnesite svoj e-poštni naslov.</p>
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Elektronski naslov"
                                className="form-control"
                                onChange={(event) => setEmail(event.target.value)}
                                value={email}
                            />
                        </div>
                        <button
                            disabled={sending}
                            className="btn btn-primary"
                            onClick={resetPasswordRequest}
                        >
                            Send Reset Link
                        </button>
                        <ErrorText error={error} />
                    </>
                )}
            </div>
        </div>
    );
};

export default Forgot;
