import napredek from "../../../Assets/napredek.png"

const Napredek = () => {
    return (
        <div className="napredek">
            <div className="slika-napredek">
                <img src={napredek}></img>
            </div>
            <div className="besedilo-napredek">
                <div className="naslov-napredek">
                    Spremljanje napredka
                </div>
                <div className="opis-napredek">
                Z našo aplikacijo lahko enostavno spremljaš svoj
                napredek pri učenju jezika, da lahko vedno veš, 
                kako daleč si že prišel in kje se lahko še izboljšaš.
                </div>
            </div>
        </div>
    );
}

export default Napredek;