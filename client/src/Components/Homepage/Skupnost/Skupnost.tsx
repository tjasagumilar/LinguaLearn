import skupnost from "../../../Assets/skupnost.png"

const Skupnost = () => {
    return (
        <div className="vsebina">
            <div className="besedilo-vsebina">
                <div className="naslov-vsebina">
                    Povezovanje med uporabniki
                </div>
                <div className="opis-vsebina">
                    Povezujte se z drugimi uporabniki, ki se učijo
                    istega jezika kot vi, in izboljšajte svoje veščine
                    z interaktivnimi izzivi, klepeti in skupinskim delom.
                </div>
            </div>
            <div className="slika-vsebina">
                <img src={skupnost} ></img>
            </div>

        </div>
    );
}

export default Skupnost;