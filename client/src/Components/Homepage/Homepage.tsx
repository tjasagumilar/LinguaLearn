import Napredek from "./Napredek/Napredek";
import Skupnost from "./Skupnost/Skupnost";
import Ucenje from "./Ucenje/Ucenje";
import Header from "../Header/Header";
import "./Homepage.css"
import Footer from "../Footer/Footer";


const Homepage = () => {

    return (
        <div>
            <Header />
            <div className="home">
                <Ucenje />
                <Skupnost />
                <Napredek />
            </div>
            <Footer/>
        </div>
    );
}

export default Homepage;

