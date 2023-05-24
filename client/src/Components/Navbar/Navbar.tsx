import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Navbar.css";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../../Config/firebase";
import logging from "../../Config/logging";

const Navbar = () => {

    const [uporabnik, setUporabnik] = useState<boolean>(false);
    const [displayName, setDisplayName] = useState<string>('');


    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                logging.info('User detected.');
                setDisplayName(user.displayName || 'upime');
                setUporabnik(true);
            } else {
                logging.info('No user detected.');
                setUporabnik(false);
            }
        });
    }, []);

    const history = useNavigate();

    const handleLogout = () => {
        auth.signOut()
            .then(() => history('/prijava'))
            .catch(error => logging.error(error));
    };

    if (uporabnik) {
        return (
            <div className="navbar">
                <div className="nav">
                    <div className="lingualearn">
                        <Link to="/" >LinguaLearn</Link>
                    </div>
                    <div className="right-links">
                        <div className="domov">
                            <Link to="/">Domov</Link>
                        </div>
                        <div className="onas">
                            <Link to="/onas">O nas</Link>
                        </div>
                        <div className="onas">
                            <Link to="/jeziki">Moji jeziki</Link>
                        </div>
                        <div className="odjava">
                            <button onClick={handleLogout}>Odjava</button>
                        </div>
                        <div className="prijava">
                            <div><Link to="/profil">{displayName}</Link></div>
                            <div className="user-icon"><FontAwesomeIcon icon={faCircleUser} /></div>
                        </div>
                    </div>
                </div>
            </div>
        );

    } else {
        return (
            <div className="navbar">
                <div className="nav">
                    <div className="lingualearn">
                        <Link to="/" >LinguaLearn</Link>
                    </div>
                    <div className="right-links">
                        <div className="domov">
                            <Link to="/">Domov</Link>
                        </div>
                        <div className="onas">
                            <Link to="/onas">O nas</Link>
                        </div>
                        <div className="prijava">
                            <div><Link to="/prijava">Prijava</Link></div>
                            <div className="user-icon"><FontAwesomeIcon icon={faCircleUser} /></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}
export default Navbar;