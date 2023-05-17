import "./Onas.css";
import onas from "../../Assets/onas.jpg"
import vizija from "../../Assets/vizija.jpg"
import knjiga from "../../Assets/knjiga.jpg"

const Onas = () => {
    return (
        <div className="onasBox">
            <div className="onasDiv">
                <div className="slika-onas">
                    <div>
                        <img src={onas}></img>
                    </div>
                </div>
                <div className="besedilo-onas">

                    <div className="onas-naslov">O NAS</div>
                    <div className="onas-besedilo">
                        Pri LinguaLearnu smo strastni jezikovni navdušenci, ki verjamemo v
                        moč učenja jezikov. Naša spletna aplikacija omogoča učinkovito in prijetno
                        učenje tujih jezikov, ne glede na starost, izobrazbo ali poklic.
                    </div>

                </div>
                <div className="slika-onas">
                    <div>
                        <img src={vizija}></img>
                    </div>
                </div>
                <div className="besedilo-onas">

                    <div className="vizija-naslov">NAŠA VIZIJA</div>
                    <div className="vizija-besedilo">
                        Naša vizija je ustvariti večjezično skupnost, kjer se uporabniki medsebojno
                        povezujejo, izmenjujejo izkušnje in se podpirajo pri svojem učnem procesu. Verjamemo,
                        da je učenje jezikov več kot le pridobivanje znanja - gre za razumevanje drugih kultur,
                        odpiranje novih priložnosti in razširjanje obzorij.
                    </div>

                </div>
                <div className="slika-onas">
                    <div>
                        <img src={knjiga}></img>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Onas;