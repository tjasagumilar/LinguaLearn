import napredek from "../../../Assets/napredek.png"

const Napredek = () => {
    return (
        <div className="vsebina">
            <div className="slika-vsebina">
                <img src={napredek}></img>
            </div>
            <div className="besedilo-vsebina">
                <div className="naslov-vsebina">
                    Spremljanje napredka
                </div>
                <div className="opis-vsebina">
                    Z našo aplikacijo lahko enostavno spremljaš svoj
                    napredek pri učenju jezika, da lahko vedno veš,
                    kako daleč si že prišel in kje se lahko še izboljšaš.
                </div>
            </div>
        </div>
    );
}

export default Napredek;