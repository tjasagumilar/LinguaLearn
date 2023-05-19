import "./Header.css"
import slika from "../../Assets/languages.png"
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../../Config/firebase";
import logging from "../../Config/logging";


const Header = () => {

    const [uporabnik, setUporabnik] = useState<boolean>(false);
    const [displayName, setDisplayName] = useState<string>('');


    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                logging.info('User detected.');
                setDisplayName(user.displayName || '');
                setUporabnik(true);
            } else {
                logging.info('No user detected.');
                setUporabnik(false);
            }
        });
    }, []);

    if (uporabnik) {
        return (
            <div className="header">
                <div className="glava">
                    <div className="besedilo">
                        <div className="naslov">
                            Pozdravljeni, {displayName}
                        </div>
                        <div className="podnaslov">
                            Nadaljujte svojo jezikovno potovanje!
                        </div>
                    </div>
                    <div className="slika-languages">
                        <img src={slika}  ></img>
                    </div>
                </div>
            </div>
        );
    } else {
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
}

export default Header;