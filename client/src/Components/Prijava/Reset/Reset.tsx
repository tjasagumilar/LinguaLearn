import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button, FormGroup, Input, Spinner } from "reactstrap";
import ErrorText from "../../ErrorText/ErrorText";
import { auth } from "../../../Config/firebase";
import logging from "../../../Config/logging";
import queryString from "querystring";


const Reset: React.FunctionComponent = () => {
    const [verifying, setVerifying] = useState<boolean>(true);
    const [verified, setVerified] = useState<boolean>(false);
    const [changing, setChanging] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [confirm, setConfirm] = useState<string>("");
    const [oobCode, setOobCode] = useState<string>("");
    const [error, setError] = useState<string>("");

    const navigate = useNavigate();
    const { search } = useLocation();
    const { oobCode: queryOobCode } = useParams<{ oobCode: string }>();

    useEffect(() => {
        logging.info("Extracting code");

        let stringParams = queryString.parse(search);

        if (stringParams) {
            let oobCode = stringParams.oobCode as string;

            if (oobCode) {
                logging.info("Code found");
                verifyPasswordResetLink(oobCode);
            } else {
                logging.error("Unable to find code");
                setVerified(false);
                setVerifying(false);
            }
        } else {
            logging.error("Unable to find code");
            setVerified(false);
            setVerifying(false);
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (queryOobCode) {
            logging.info("Code found");
            verifyPasswordResetLink(queryOobCode);
        } else {
            logging.error("Unable to find code");
            setVerified(false);
            setVerifying(false);
        }
    }, [queryOobCode]);

    const verifyPasswordResetLink = (_oobCode: string) => {
        auth
            .verifyPasswordResetCode(_oobCode)
            .then((result) => {
                logging.info(result);
                setOobCode(_oobCode);
                setVerified(true);
                setVerifying(false);
            })
            .catch((error) => {
                logging.error(error);
                setVerified(false);
                setVerifying(false);
            });
    };

    const passwordResetRequest = () => {
        if (password !== confirm) {
            setError("Make sure your passwords are matching");
            return;
        }

        if (error !== "") setError("");

        setChanging(true);

        auth
            .confirmPasswordReset(oobCode, password)
            .then(() => {
                navigate("/login");
            })
            .catch((error) => {
                logging.error(error);
                setError(error.message);
                setChanging(false);
            });
    };

    return (
        <div className="login-form">
            <div className="prijavise">
                {verifying ? (
                    <Spinner color="info" />
                ) : (
                    <>
                        {verified ? (
                            <>
                                <p>Please enter a strong password.</p>
                                <FormGroup>
                                    <Input
                                        autoComplete="new-password"
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="Enter Password"
                                        onChange={(event) => setPassword(event.target.value)}
                                        value={password}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Input
                                        autoComplete="new-password"
                                        type="password"
                                        name="confirm"
                                        id="confirm"
                                        placeholder="Confirm Password"
                                        onChange={(event) => setConfirm(event.target.value)}
                                        value={confirm}
                                    />
                                </FormGroup>
                                <Button
                                    disabled={changing}
                                    color="success"
                                    block
                                    onClick={() => passwordResetRequest()}
                                >
                                    Reset Password
                                </Button>
                                <ErrorText error={error} />
                            </>
                        ) : (
                            <p>Invalid link.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Reset;
