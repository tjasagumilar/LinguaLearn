import "./Prijava.css";
import Signin from "./Signin/Signin";
import Dobrodosli from "./Dobrodosli/Dobrodosli";
import { useLocation } from "react-router-dom";
import Signup from "./Signup/Signup";


const Prijava = () => {

    const isLoginPage = useLocation().pathname === '/prijava';

    return (
        <div className="login-box">
            <div className="login">
                {isLoginPage ? <Signin /> : <Signup/>}
                <Dobrodosli/>
            </div>

        </div>
    );
}

export default Prijava;