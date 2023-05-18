import ucenje from "../../../Assets/ucenje.png"

const Ucenje = () => {
    return (
        <div className="vsebina">
            <div className="slika-vsebina">
                <img src={ucenje}></img>
            </div>
            <div className="besedilo-vsebina">
                <div className="naslov-vsebina">
                    Individualno prilagojeno učenje

                </div>
                <div className="opis-vsebina">
                    Naučite se novega jezika ali izboljšajte svoje znanje s personaliziranim pristopom.
                    Naša aplikacija vam nudi različne vrste vsebine in aktivnosti za učenje jezika,
                    ki jih prilagajamo vašemu napredku in ciljem.
                </div>
            </div>
        </div>
    );
}

export default Ucenje;