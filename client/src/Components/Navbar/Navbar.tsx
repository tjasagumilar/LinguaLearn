import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Navbar.css";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="nav">
                <div className="lingualearn">
                    <Link to="/" >LinguaLearn</Link>
                </div>
                <div className="right-links">
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
export default Navbar;