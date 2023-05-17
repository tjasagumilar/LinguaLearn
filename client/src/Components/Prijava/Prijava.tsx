import { Link } from "react-router-dom";
import Obrazec from "./Obrazec/Obrazec";
import "./Prijava.css";

const Prijava = () => {
    return (
        <div className="loginBox">
            <div className="login">
                <Obrazec/>
                <div className="dobrodosliBox">
                    <div className="dobrodosli">
                        Dobrodošli nazaj!
                    </div>
                    <div className="pridruzitev">
                        Prijavite se in nadaljujte svoje jezikovno potovanje z LinguaLearn.
                    </div>
                    <div className="brezRacuna">
                        <div>Še nimate računa?</div>
                        <div className="ustvariButton">
                            <Link to="/registracija"><button>Ustvari račun</button></Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Prijava;