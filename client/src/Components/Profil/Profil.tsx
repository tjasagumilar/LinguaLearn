import "./Profil.css"

const Profil = () => {
    return (
        <div className="profil-box">
            <div className="profil">
                <div className="uporabnik-box">
                    <div className="uporabnik">
                        <div className="uporabnik-slika">
                            <img src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png"></img>
                        </div>
                        <div className="uporabnik-podatki">
                           <span>uporabnisko ime</span>
                           <span>Ime Priimek</span>
                        </div>
                    </div>
                    <div className="uporabnik-uredi">
                        <button>Uredi profil</button>
                    </div>
                </div>
                
                <div className="ostalo">
                
                    
                </div>
            </div>
        </div>
    );
}

export default Profil;