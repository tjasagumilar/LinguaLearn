import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorText from "../../ErrorText/ErrorText";
import "./Signup.css";
import { BASE_URL } from '../../../api';

const Signup = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirm, setConfirm] = useState<string>('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({
        username: '',
        email: '',
        password: '',
        confirm: ''
    });


    const navigate = useNavigate();

    const handleSubmit = () => {
        const newErrors: { [key: string]: string } = {};

        if (username.trim() === '') {
            newErrors.username = 'Vnesite uporabniško ime.';
        }

        if (email.trim() === '') {
            newErrors.email = 'Prosimo, vnesite e-pošto.';
        }

        if (password.trim() === '') {
            newErrors.password = 'Vnesite geslo.';
        }

        if (confirm.trim() === '') {
            newErrors.confirm = 'Potrdite geslo.';
        } else if (password !== confirm) {
            newErrors.confirm = 'Geslo se ne ujemajo.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        const formData = {
            email: email,
            password: password,
            username: username,
            slika: 'avatar1.png'
        };

        fetch(`${BASE_URL}/signup`, {
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
                    {errors.username && <span className="error">{errors.username}</span>}
                    <input type="email" placeholder="Email" onChange={event => setEmail(event.target.value)} value={email} />
                    {errors.email && <span className="error">{errors.email}</span>}
                    <input type="password" placeholder="Geslo" onChange={event => setPassword(event.target.value)} value={password} />
                    {errors.password && <span className="error">{errors.password}</span>}
                    <input type="password" placeholder="Ponovite geslo" onChange={event => setConfirm(event.target.value)} value={confirm} />
                    {errors.confirm && <span className="error">{errors.confirm}</span>}
                </div>
                <div className="login-button">
                    <button onClick={() => handleSubmit()}>Ustvari</button>
                </div>
                <ErrorText error={errors.main} />
            </div>
        </div>
    );
}

export default Signup;
