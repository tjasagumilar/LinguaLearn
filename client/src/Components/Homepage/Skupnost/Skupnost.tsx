import skupnost from "../../../Assets/skupnost.png"

const Skupnost = () => {
    return (
        <div className="skupnost">
            <div className="besedilo-skupnost">
                <div className="naslov-skupnost">
                    Povezovanje med uporabniki
                </div>
                <div className="opis-skupnost">
                Povezujte se z drugimi uporabniki, ki se učijo 
                istega jezika kot vi, in izboljšajte svoje veščine 
                z interaktivnimi izzivi, klepeti in skupinskim delom.
                </div>
            </div>
            <div className="slika-skupnost">
                <img src={skupnost} ></img>
            </div>

        </div>
    );
}

export default Skupnost;