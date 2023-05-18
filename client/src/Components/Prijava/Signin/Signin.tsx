const Signin = () => {
    return (
        <div className="login-form">
            <div className="prijavise">
                Prijava
            </div>
            <div className="login-inputs">
                <div className="vnosna-polja">
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Geslo" />
                </div>
                <div className="login-button">
                    <button>Prijava</button>
                </div>
                <div className="pozabljeno">
                    Pozabljeno geslo
                </div>
            </div>
        </div>
    );
}

export default Signin;