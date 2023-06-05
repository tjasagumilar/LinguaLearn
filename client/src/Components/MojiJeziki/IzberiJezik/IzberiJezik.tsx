import { Button, Container, Form } from "react-bootstrap";
import "./IzberiJezik.css";
import { auth } from "../../../Config/firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../api";


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

    function getLanguageName(shortName: string) {
        let languageName;

        switch (shortName) {
            case 'en':
                languageName = 'Angleščina';
                break;
            case 'es':
                languageName = 'Španščina';
                break;
            case 'fr':
                languageName = 'Francoščina';
                break;
            case 'de':
                languageName = 'Nemščina';
                break;
            case 'it':
                languageName = 'Italijanščina';
                break;
            case 'fi':
                languageName = 'Finščina';
                break;
            case 'hr':
                languageName = 'Hrvaščina';
                break;
            case 'ru':
                languageName = 'Ruščina';
                break;
        }

        return languageName;
    }


    const handleSubmit = () => {

        const data = {
            jezik: jezik,
            naziv: getLanguageName(jezik),
            nivo: nivo,
            uid: uid,
            path: require(`../../../Assets/${jezik}.jpg`)
        }

        fetch(`${BASE_URL}/izbirajezika`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (response.status === 200) {
                    navigate('/jeziki');
                } else {
                    throw new Error('Error: ' + response.status);
                }
            })
            .catch(error => {
                console.log(error);
            });

        navigate('/jeziki');
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
                            <option value='fi'>Finščina</option>
                            <option value='fr'>Francoščina</option>
                            <option value='hr'>Hrvaščina</option>
                            <option value='it'>Italijanščina</option>
                            <option value='de'>Nemščina</option>
                            <option value='ru'>Ruščina</option>
                            <option value='es'>Španščina</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Select className="select-nivo" onChange={event => setNivo(event.target.value)} value={nivo}>
                            <option>Izberi nivo predzanja</option>
                            <option value='Začetnik'>Začetnik</option>
                            <option value='Raziskovalec'>Raziskovalec</option>
                            <option value='Pustolovec'>Pustolovec</option>
                            <option value='Prvak'>Prvak</option>
                        </Form.Select>
                    </Form.Group>
                    <Button type="submit" onClick={handleSubmit}>Potrdi</Button>
                </Form>
            </Container>
        </div>

    );
}

export default IzberiJezik;