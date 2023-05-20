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
            <Ucenje />
            <Skupnost />
            <Napredek />
            <Footer />
        </div>
    );
}

export default Homepage;

