const Obrazec = () => {
    return (
        <div className="loginForm">
            <div className="prijavise">
                Prijava
            </div>
            <div className="loginInputs">
                <div className="vnosnaPolja">
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Geslo" />
                </div>
                <div className="loginButton">
                    <button>Prijava</button>
                </div>
                <div className="pozabljeno">
                    Pozabljeno geslo
                </div>
            </div>
        </div>
    );
}

export default Obrazec;