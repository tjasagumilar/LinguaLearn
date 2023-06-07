import "./Prijava.css";
import Signin from "./Signin/Signin";
import Dobrodosli from "./Dobrodosli/Dobrodosli";
import { useLocation } from "react-router-dom";
import Signup from "./Signup/Signup";
import { useEffect } from "react";


const Prijava = () => {

    useEffect(() => {
        document.body.style.backgroundColor = '#6389FA';
    }, []);

    const isLoginPage = useLocation().pathname === '/prijava';

    return (

        <div className="login-box col-12">
            <div className="login col-md-4 col-lg-3 col-xl-2">
                {isLoginPage ? <Signin /> : <Signup />}

            </div>
            <div className="dobrodosli-div col-md-4 col-lg-4 col-xl-3">
                <Dobrodosli />
            </div>
        </div>

    );
}

export default Prijava;