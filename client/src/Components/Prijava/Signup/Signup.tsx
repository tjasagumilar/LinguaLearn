const Signup = () => {
    return (
        <div className="loginForm">
        <div className="prijavise">
            Ustvarite račun
        </div>
        <div className="loginInputs">
            <div className="vnosnaPolja">
                <input type="text" placeholder="Uporabniško ime"/>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Geslo" />
                <input type="password" placeholder="Ponovite geslo" />
            </div>
            <div className="loginButton">
                <button>Ustvari</button>
            </div>
        </div>
    </div>
    );
}

export default Signup;