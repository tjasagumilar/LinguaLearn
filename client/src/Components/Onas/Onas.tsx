import "./Onas.css";
import onas from "../../Assets/onas.jpg"
import vizija from "../../Assets/vizija.jpg"

const Onas = () => {
    return (
        <div className="onas-box col-12">
            <div className="onas-vsebina col-10">
                <div className="slika-onas col-md-12 col-lg-5 col-xl-4">
                    <img src={onas}></img>
                </div>
                <div className="besedilo-onas col-10 col-md-10 col-lg-6 col-xl-4">
                    <h3 className="onas-naslov">
                        O nas
                    </h3>
                    <div className="onas-besedilo">
                        Pri LinguaLearnu smo strastni jezikovni navdušenci, ki verjamemo v
                        moč učenja jezikov. Naša spletna aplikacija omogoča učinkovito in prijetno
                        učenje tujih jezikov, ne glede na starost, izobrazbo ali poklic.
                    </div>
                </div>
            </div>
            <div className="onas-vsebina col-10">
                <div className="slika-onas col-md-12 col-lg-5 col-xl-4">
                    <img src={vizija}></img>
                </div>
                <div className="besedilo-onas col-10 col-md-10 col-lg-6 col-xl-4">
                    <h3 className="onas-naslov" >
                        Naša vizija
                    </h3>
                    <div className="onas-besedilo">
                        Naša vizija je ustvariti večjezično skupnost, kjer se uporabniki medsebojno
                        povezujejo, izmenjujejo izkušnje in se podpirajo pri svojem učnem procesu. Verjamemo,
                        da je učenje jezikov več kot le pridobivanje znanja - gre za razumevanje drugih kultur,
                        odpiranje novih priložnosti in razširjanje obzorij.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Onas;