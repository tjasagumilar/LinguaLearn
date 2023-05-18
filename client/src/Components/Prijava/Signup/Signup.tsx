const Signup = () => {
    return (
        <div className="login-form">
        <div className="prijavise">
            Ustvarite račun
        </div>
        <div className="login-inputs">
            <div className="vnosna-polja">
                <input type="text" placeholder="Uporabniško ime"/>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Geslo" />
                <input type="password" placeholder="Ponovite geslo" />
            </div>
            <div className="login-button">
                <button>Ustvari</button>
            </div>
        </div>
    </div>
    );
}

export default Signup;