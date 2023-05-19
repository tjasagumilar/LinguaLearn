import Napredek from "./Napredek/Napredek";
import Skupnost from "./Skupnost/Skupnost";
import Ucenje from "./Ucenje/Ucenje";
import Header from "../Header/Header";
import "./Homepage.css"

const Homepage = () => {

    return (
        <div>
            <Header />
            <Ucenje />
            <Skupnost />
            <Napredek />
        </div>
    );
}

export default Homepage;

