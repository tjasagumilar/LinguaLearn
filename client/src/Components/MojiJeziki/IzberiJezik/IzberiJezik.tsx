import { Button, Container, Form } from "react-bootstrap";
import "./IzberiJezik.css";
import { auth } from "../../../Config/firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";


const IzberiJezik = () => {
    const [jezik, setJezik] = useState('');
    const [nivo, setNivo] = useState('');
    const [uid, setUid] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setUid(user.uid);
            }
        });
    }, []);

    const handleSubmit = () => {

        const data = {
            jezik: jezik,
            nivo: nivo,
            uid: uid
        }

        fetch('http://localhost:4000/izbirajezika', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (response.status === 200) {
                    navigate('/jeziki')
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <div className="form-izbira">
            <Container className="izbira-jezika">
                <h2>Izbira jezika</h2>
                <Form>
                    <Form.Group className="mb-4">
                        <Form.Select className="select-jezik" onChange={event => setJezik(event.target.value)} value={jezik}>
                            <option>Izberi jezik</option>
                            <option value='en'>Angleščina</option>
                            <option value='de'>Nemščina</option>
                            <option value='es'>Španščina</option>
                            <option value='it'>Italijanščina</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Select className="select-nivo" onChange={event => setNivo(event.target.value)} value={nivo}>
                            <option>Izberi nivo predzanja</option>
                            <option value='zacetnik'>Začetnik</option>
                            <option value='napredni'> Napredni začetnik</option>
                            <option value='nadaljevalni'>Nadaljevalni</option>
                        </Form.Select>
                    </Form.Group>
                    <Button type="submit" onClick={handleSubmit}>Potrdi</Button>
                </Form>
            </Container>
        </div>

    );
}

export default IzberiJezik;