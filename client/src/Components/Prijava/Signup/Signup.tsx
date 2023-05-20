import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorText from "../../ErrorText/ErrorText";

const Signup = () => {
    const [registering, setRegistering] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirm, setConfirm] = useState<string>('');
    const [error, setError] = useState<string>('');

    const navigate = useNavigate();

    const handleSubmit = () => {

        if (password !== confirm) {
            setError('Please make sure your passwords match.');
            return;
        }

        if (error !== '') setError('');


        const formData = {
            email: email,
            password: password,
            username: username
        };

        fetch('http://localhost:5000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (response.status === 200) {
                    navigate('/prijava');
                } 
            })
            .catch(err => {
                console.log(err);
            });

    };

    return (
        <div className="login-form">
            <div className="prijavise">
                Ustvarite račun
            </div>
            <div className="login-inputs">
                <div className="vnosna-polja">
                    <input type="text" placeholder="Uporabniško ime" onChange={event => setUsername(event.target.value)} value={username} />
                    <input type="email" placeholder="Email" onChange={event => setEmail(event.target.value)} value={email} />
                    <input type="password" placeholder="Geslo" onChange={event => setPassword(event.target.value)} value={password} />
                    <input type="password" placeholder="Ponovite geslo" onChange={event => setConfirm(event.target.value)} value={confirm} />
                </div>
                <div className="login-button">
                    <button onClick={() => handleSubmit()}>Ustvari</button>
                </div>
                <ErrorText error={error} />
            </div>
        </div>
    );
}

export default Signup;
