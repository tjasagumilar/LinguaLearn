import { Container, Form } from "react-bootstrap";
import "./IzberiJezik.css";


const IzberiJezik = () => {
    return (
        <div className="form-izbira">
            <Container className="izbira-jezika">
                <Form>
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                        <Form.Label>Izberi jezik</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>Nivo predzanja</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                </Form>
            </Container>
        </div>

    );
}

export default IzberiJezik;