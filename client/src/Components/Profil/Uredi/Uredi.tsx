import { Button, Container, Form } from "react-bootstrap";
import { auth } from "../../../Config/firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Uredi = () => {
    const [username, setUsername] = useState('');
    const [ime, setIme] = useState('');
    const [priimek, setPriimek] = useState('');
    const [uid, setUid] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setUid(user.uid);
                fetch(`http://localhost:4000/uporabnik?uid=${user.uid}`)
                    .then(response => response.json())
                    .then(data => {
                        setIme(data.ime);
                        setPriimek(data.priimek);
                        setUsername(data.username);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        });
    }, []);


    const handleSubmit = () => {

        const data = {
            uid: uid,
            username: username,
            ime: ime,
            priimek: priimek
        }

        fetch('http://localhost:4000/uredi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (response.status === 200) {
                    navigate('/profil');
                } else {
                    throw new Error('Error: ' + response.status);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <div>
            <Container>
                <h2>Uredi profil</h2>
                <Form>
                    <Form.Group className="mb-4">
                        <Form.Control type="text" placeholder="Vnesite uporabniško ime" onChange={event => setUsername(event.target.value)} value={username} />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Control type="text" placeholder="Vnesite ime" onChange={event => setIme(event.target.value)} value={ime} />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Control type="text" placeholder="Vnesite priimek" onChange={event => setPriimek(event.target.value)} value={priimek} />
                    </Form.Group>
                    <Button type="submit" onClick={handleSubmit}>Potrdi</Button>
                </Form>
            </Container>
        </div>
    );
}

export default Uredi;