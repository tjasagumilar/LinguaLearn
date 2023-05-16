import "./Header.css"
import slika from "../../Assets/languages.png"
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div className="header">
            <div className="glava">
                <div className="besedilo">
                    <div className="naslov">
                        Vstopi v svet večjezičnosti!
                    </div>
                    <div className="podnaslov">
                    Pridruži se naši skupnosti učenja jezikov!
                    </div>
                    <div className="zacni">
                    <Link to="/registracija"><button>Začni</button></Link>
                    </div>
                </div>
                <div className="slika-languages">
                    <img src={slika}  ></img>
                </div>
            </div>
        </div>
    );
}

export default Header;