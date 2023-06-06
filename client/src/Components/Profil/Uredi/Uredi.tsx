import { Button, Form } from "react-bootstrap";
import { auth } from "../../../Config/firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Uredi.css"
import avatar1 from "../../../Assets/avatar1.png";
import avatar2 from "../../../Assets/avatar2.png";
import avatar3 from "../../../Assets/avatar3.png";
import avatar4 from "../../../Assets/avatar4.png";
import avatar5 from "../../../Assets/avatar5.png";
import avatar6 from "../../../Assets/avatar6.png";
import { BASE_URL } from "../../../api";


const Uredi = () => {
    const [username, setUsername] = useState(' ');
    const [ime, setIme] = useState(' ');
    const [priimek, setPriimek] = useState(' ');
    const [uid, setUid] = useState(' ');
    const [slika, setSlika] = useState(' ');
    const [opis, setOpis] = useState(' ');
    const navigate = useNavigate();

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setUid(user.uid);
                fetch(`${BASE_URL}/uporabnik?uid=${user.uid}`)
                    .then(response => response.json())
                    .then(data => {
                        setIme(data.ime);
                        setPriimek(data.priimek);
                        setUsername(data.username);
                        setSlika(data.slika);
                        setOpis(data.opis);
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
            priimek: priimek,
            slika: slika,
            opis: opis
        }

        fetch(`${BASE_URL}/uredi`, {
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

        navigate('/profil');
    }

    return (
        <div className="zunanji-container">
            <div className="uredi-container col-xs-12 col-sm-8 col-md-6 col-lg-4">
                <h2>Uredi profil</h2>
                <Form>
                    <Form.Group className="mb-4" id="avatar">
                        <label>
                            <img src={avatar1}></img>
                            <Form.Check
                                inline
                                name="group1"
                                type="radio"
                                id="1"
                                checked={slika === 'avatar1.png'}
                                onChange={() => setSlika('avatar1.png')}
                            />
                        </label>
                        <label>
                            <img src={avatar2} ></img>
                            <Form.Check
                                inline
                                name="group1"
                                type="radio"
                                id="2"
                                checked={slika === 'avatar2.png'}
                                onChange={() => setSlika('avatar2.png')}
                            />
                        </label>
                        <label>
                            <img src={avatar3}></img>
                            <Form.Check
                                inline
                                name="group1"
                                type="radio"
                                id="3"
                                checked={slika === 'avatar3.png'}
                                onChange={() => setSlika('avatar3.png')}
                            />
                        </label>
                        <label>
                            <img src={avatar4}></img>
                            <Form.Check
                                inline
                                name="group1"
                                type="radio"
                                id="4"
                                checked={slika === 'avatar4.png'}
                                onChange={() => setSlika('avatar4.png')}
                            />
                        </label>
                        <label>
                            <img src={avatar5}></img>
                            <Form.Check
                                inline
                                name="group1"
                                type="radio"
                                id="5"
                                checked={slika === 'avatar5.png'}
                                onChange={() => setSlika('avatar5.png')}
                            />
                        </label>
                        <label>
                            <img src={avatar6}></img>
                            <Form.Check
                                inline
                                name="group1"
                                type="radio"
                                id="6"
                                checked={slika === 'avatar6.png'}
                                onChange={() => setSlika('avatar6.png')}
                            />
                        </label>
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <label>Uporabniško ime</label> <Form.Control type="text" placeholder="Vnesite uporabniško ime" onChange={event => setUsername(event.target.value)} value={username} />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <label>Ime</label> <Form.Control type="text" placeholder="Vnesite ime" onChange={event => setIme(event.target.value)} value={ime} />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <label>Priimek</label> <Form.Control type="text" placeholder="Vnesite priimek" onChange={event => setPriimek(event.target.value)} value={priimek} />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <label>Opis</label> <Form.Control type="text" placeholder="Vnesite opis" onChange={event => setOpis(event.target.value)} value={opis} />
                    </Form.Group>
                    <div className="gumb-potrdi"><Button type="submit" onClick={handleSubmit}>Potrdi</Button></div>
                </Form>
            </div>
        </div>
    );
}

export default Uredi;