import ucenje from "../../../Assets/ucenje.png"

const Ucenje = () => {
    return (
        <div className="ucenje">
            <div className="slika-ucenje">
                <img src={ucenje}></img>
            </div>
            <div className="besedilo-ucenje">
                <div className="naslov-ucenje">
                    Individualno prilagojeno učenje

                </div>
                <div className="opis-ucenje">
                    Naučite se novega jezika ali izboljšajte svoje znanje s personaliziranim pristopom.
                    Naša aplikacija vam nudi različne vrste vsebine in aktivnosti za učenje jezika,
                    ki jih prilagajamo vašemu napredku in ciljem.
                </div>
            </div>
        </div>
    );
}

export default Ucenje;