import React, { useState } from "react";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../../Config/firebase";
import Signin from "../Prijava/Signin/Signin";
import ChatRoom from "./ChatRoom/ChatRoom";
import './Chat.css';

function Chat() {
    const [selectedChat, setSelectedChat] = useState("general");

    const handleChatChange = (event) => {
        setSelectedChat(event.target.value);
    };

    const chatComponents = {
        general: { languageCode: 'General', name: "General Chat 💬" },
        af: { languageCode: 'Af', name: "Afrikaans Chat 🇿🇦" },
        sq: { languageCode: 'Alb', name: "Albanian Chat 🇦🇱" },
        am: { languageCode: 'Amh', name: "Amharic Chat 🇪🇹" },
        ar: { languageCode: 'Ara', name: "Arabic Chat 🇦🇪" },
        hy: { languageCode: 'Arm', name: "Armenian Chat 🇦🇲" },
        az: { languageCode: 'Aze', name: "Azerbaijani Chat 🇦🇿" },
        be: { languageCode: 'Bel', name: "Belarusian Chat 🇧🇾" },
        eu: { languageCode: 'Bas', name: "Basque Chat 🇪🇺" },
        bn: { languageCode: 'Ben', name: "Bengali Chat 🇧🇩" },
        bs: { languageCode: 'Bos', name: "Bosnian Chat 🇧🇦" },
        bg: { languageCode: 'Bul', name: "Bulgarian Chat 🇧🇬" },
        ca: { languageCode: 'Cat', name: "Catalan Chat 🇪🇸" },
        ceb: { languageCode: 'Ceb', name: "Cebuano Chat 🇵🇭" },
        ny: { languageCode: 'Chi', name: "Chichewa Chat 🇲🇼" },
        zh: { languageCode: 'Chi', name: "Chinese (Simplified) Chat 🇨🇳" },
        zhcn: { languageCode: 'Chi', name: "Chinese (Simplified) Chat 🇨🇳" },
        zhtw: { languageCode: 'Chi', name: "Chinese (Traditional) Chat 🇹🇼" },
        co: { languageCode: 'Cor', name: "Corsican Chat 🇫🇷" },
        hr: { languageCode: 'Cro', name: "Croatian Chat 🇭🇷" },
        cs: { languageCode: 'Cze', name: "Czech Chat 🇨🇿" },
        da: { languageCode: 'Dan', name: "Danish Chat 🇩🇰" },
        nl: { languageCode: 'Dut', name: "Dutch Chat 🇳🇱" },
        en: { languageCode: 'Eng', name: "English Chat 🇺🇸" },
        eo: { languageCode: 'Esp', name: "Esperanto Chat 🌍" },
        et: { languageCode: 'Est', name: "Estonian Chat 🇪🇪" },
        tl: { languageCode: 'Fil', name: "Filipino Chat 🇵🇭" },
        fi: { languageCode: 'Fin', name: "Finnish Chat 🇫🇮" },
        fr: { languageCode: 'Fre', name: "French Chat 🇫🇷" },
        fy: { languageCode: 'Fri', name: "Frisian Chat 🇳🇱" },
        gl: { languageCode: 'Gal', name: "Galician Chat 🇪🇸" },
        ka: { languageCode: 'Geo', name: "Georgian Chat 🇬🇪" },
        de: { languageCode: 'Ger', name: "German Chat 🇩🇪" },
        el: { languageCode: 'Gre', name: "Greek Chat 🇬🇷" },
        gu: { languageCode: 'Guj', name: "Gujarati Chat 🇮🇳" },
        ht: { languageCode: 'Hai', name: "Haitian Creole Chat 🇭🇹" },
        ha: { languageCode: 'Hau', name: "Hausa Chat 🇳🇬" },
        haw: { languageCode: 'Haw', name: "Hawaiian Chat 🌺" },
        he: { languageCode: 'Heb', name: "Hebrew Chat 🇮🇱" },
        iw: { languageCode: 'Heb', name: "Hebrew Chat 🇮🇱" },
        hi: { languageCode: 'Hin', name: "Hindi Chat 🇮🇳" },
        hmn: { languageCode: 'Hmo', name: "Hmong Chat 🌍" },
        hu: { languageCode: 'Hun', name: "Hungarian Chat 🇭🇺" },
        is: { languageCode: 'Ice', name: "Icelandic Chat 🇮🇸" },
        ig: { languageCode: 'Igb', name: "Igbo Chat 🇳🇬" },
        id: { languageCode: 'Ind', name: "Indonesian Chat 🇮🇩" },
        ga: { languageCode: 'Iri', name: "Irish Chat 🇮🇪" },
        it: { languageCode: 'Ita', name: "Italian Chat 🇮🇹" },
        ja: { languageCode: 'Jap', name: "Japanese Chat 🇯🇵" },
        jw: { languageCode: 'Jav', name: "Javanese Chat 🇮🇩" },
        kn: { languageCode: 'Kan', name: "Kannada Chat 🇮🇳" },
        kk: { languageCode: 'Kaz', name: "Kazakh Chat 🇰🇿" },
        km: { languageCode: 'Khm', name: "Khmer Chat 🇰🇭" },
        ko: { languageCode: 'Kor', name: "Korean Chat 🇰🇷" },
        ku: { languageCode: 'Kur', name: "Kurdish (Kurmanji) Chat 🌍" },
        ky: { languageCode: 'Kyr', name: "Kyrgyz Chat 🇰🇬" },
        lo: { languageCode: 'Lao', name: "Lao Chat 🇱🇦" },
        la: { languageCode: 'Lat', name: "Latin Chat 🌍" },
        lv: { languageCode: 'Lat', name: "Latvian Chat 🇱🇻" },
        lt: { languageCode: 'Lit', name: "Lithuanian Chat 🇱🇹" },
        lb: { languageCode: 'Lux', name: "Luxembourgish Chat 🇱🇺" },
        mk: { languageCode: 'Mac', name: "Macedonian Chat 🇲🇰" },
        mg: { languageCode: 'Mal', name: "Malagasy Chat 🇲🇬" },
        ms: { languageCode: 'Mal', name: "Malay Chat 🇲🇾" },
        ml: { languageCode: 'Mal', name: "Malayalam Chat 🇮🇳" },
        mt: { languageCode: 'Mal', name: "Maltese Chat 🇲🇹" },
        mi: { languageCode: 'Mao', name: "Maori Chat 🇳🇿" },
        mr: { languageCode: 'Mar', name: "Marathi Chat 🇮🇳" },
        mn: { languageCode: 'Mon', name: "Mongolian Chat 🇲🇳" },
        my: { languageCode: 'Mya', name: "Myanmar (Burmese) Chat 🇲🇲" },
        ne: { languageCode: 'Nep', name: "Nepali Chat 🇳🇵" },
        no: { languageCode: 'Nor', name: "Norwegian Chat 🇳🇴" },
        ps: { languageCode: 'Pas', name: "Pashto Chat 🌍" },
        fa: { languageCode: 'Per', name: "Persian Chat 🇮🇷" },
        pl: { languageCode: 'Pol', name: "Polish Chat 🇵🇱" },
        pt: { languageCode: 'Por', name: "Portuguese Chat 🇵🇹" },
        pa: { languageCode: 'Pun', name: "Punjabi Chat 🇮🇳" },
        ro: { languageCode: 'Rom', name: "Romanian Chat 🇷🇴" },
        ru: { languageCode: 'Rus', name: "Russian Chat 🇷🇺" },
        sm: { languageCode: 'Sam', name: "Samoan Chat 🇼🇸" },
        sp: { languageCode: 'Spa', name: "Spanish Chat 🇪🇸" },
        gd: { languageCode: 'Sco', name: "Scots Gaelic Chat 🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
        sr: { languageCode: 'Ser', name: "Serbian Chat 🇷🇸" },
        st: { languageCode: 'Ses', name: "Sesotho Chat 🇱🇸" },
        sn: { languageCode: 'Sho', name: "Shona Chat 🇿🇼" },
        sd: { languageCode: 'Sin', name: "Sindhi Chat 🇵🇰" },
        si: { languageCode: 'Sin', name: "Sinhala Chat 🇱🇰" },
        sk: { languageCode: 'Slo', name: "Slovak Chat 🇸🇰" },
        sl: { languageCode: 'Slo', name: "Slovenian Chat 🇸🇮" },
        so: { languageCode: 'Som', name: "Somali Chat 🇸🇴" },
        su: { languageCode: 'Sun', name: "Sundanese Chat 🇮🇩" },
        sw: { languageCode: 'Swah', name: "Swahili Chat 🌍" },
        sv: { languageCode: 'Swe', name: "Swedish Chat 🇸🇪" },
        tg: { languageCode: 'Taj', name: "Tajik Chat 🇹🇯" },
        ta: { languageCode: 'Tam', name: "Tamil Chat 🇮🇳" },
        te: { languageCode: 'Tel', name: "Telugu Chat 🇮🇳" },
        th: { languageCode: 'Tha', name: "Thai Chat 🇹🇭" },
        tr: { languageCode: 'Tur', name: "Turkish Chat 🇹🇷" },
        uk: { languageCode: 'Ukr', name: "Ukrainian Chat 🇺🇦" },
        ur: { languageCode: 'Urd', name: "Urdu Chat 🇵🇰" },
        ug: { languageCode: 'Uig', name: "Uyghur Chat 🌍" },
        uz: { languageCode: 'Uzb', name: "Uzbek Chat 🇺🇿" },
        vi: { languageCode: 'Vie', name: "Vietnamese Chat 🇻🇳" },
        cy: { languageCode: 'Wel', name: "Welsh Chat 🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
        xh: { languageCode: 'Xho', name: "Xhosa Chat 🇿🇦" },
        yi: { languageCode: 'Yid', name: "Yiddish Chat 🌍" },
        yo: { languageCode: 'Yor', name: "Yoruba Chat 🇳🇬" },
        zu: { languageCode: 'Zul', name: "Zulu Chat 🇿🇦" }
    };

    const selectedChatLanguageCode = chatComponents[selectedChat].languageCode;
    const chatName = chatComponents[selectedChat].name;

    return (
        <div className="App">
            <header>
                <h1>
                    <span role="img" aria-label="speech balloon">
                        {chatName}
                    </span>
                </h1>
            </header>

            <div className="chat-selection">
                <label htmlFor="chat-select">Select Chat Room: </label>
                <select id="chat-select" value={selectedChat} onChange={handleChatChange}>
                        <option value="general">General</option>
                        <option value="af">Afrikaans</option>
                        <option value="sq">Albanian</option>
                        <option value="am">Amharic</option>
                        <option value="ar">Arabic</option>
                        <option value="hy">Armenian</option>
                        <option value="az">Azerbaijani</option>
                        <option value="be">Belarusian</option>
                        <option value="eu">Basque</option>
                        <option value="bn">Bengali</option>
                        <option value="bs">Bosnian</option>
                        <option value="bg">Bulgarian</option>
                        <option value="ca">Catalan</option>
                        <option value="ceb">Cebuano</option>
                        <option value="ny">Chichewa</option>
                        <option value="zh">Chinese (Simplified)</option>
                        <option value="zhcn">Chinese (Simplified)</option>
                        <option value="zhtw">Chinese (Traditional)</option>
                        <option value="co">Corsican</option>
                        <option value="hr">Croatian</option>
                        <option value="cs">Czech</option>
                        <option value="da">Danish</option>
                        <option value="nl">Dutch</option>
                        <option value="en">English</option>
                        <option value="eo">Esperanto</option>
                        <option value="et">Estonian</option>
                        <option value="tl">Filipino</option>
                        <option value="fi">Finnish</option>
                        <option value="fr">French</option>
                        <option value="fy">Frisian</option>
                        <option value="gl">Galician</option>
                        <option value="ka">Georgian</option>
                        <option value="de">German</option>
                        <option value="el">Greek</option>
                        <option value="gu">Gujarati</option>
                        <option value="ht">Haitian Creole</option>
                        <option value="ha">Hausa</option>
                        <option value="haw">Hawaiian</option>
                        <option value="he">Hebrew</option>
                        <option value="iw">Hebrew</option>
                        <option value="hi">Hindi</option>
                        <option value="hmn">Hmong</option>
                        <option value="hu">Hungarian</option>
                        <option value="is">Icelandic</option>
                        <option value="ig">Igbo</option>
                        <option value="id">Indonesian</option>
                        <option value="ga">Irish</option>
                        <option value="it">Italian</option>
                        <option value="ja">Japanese</option>
                        <option value="jw">Javanese</option>
                        <option value="kn">Kannada</option>
                        <option value="kk">Kazakh</option>
                        <option value="km">Khmer</option>
                        <option value="ko">Korean</option>
                        <option value="ku">Kurdish (Kurmanji)</option>
                        <option value="ky">Kyrgyz</option>
                        <option value="lo">Lao</option>
                        <option value="la">Latin</option>
                        <option value="lv">Latvian</option>
                        <option value="lt">Lithuanian</option>
                        <option value="lb">Luxembourgish</option>
                        <option value="mk">Macedonian</option>
                        <option value="mg">Malagasy</option>
                        <option value="ms">Malay</option>
                        <option value="ml">Malayalam</option>
                        <option value="mt">Maltese</option>
                        <option value="mi">Maori</option>
                        <option value="mr">Marathi</option>
                        <option value="mn">Mongolian</option>
                        <option value="my">Myanmar (Burmese)</option>
                        <option value="ne">Nepali</option>
                        <option value="no">Norwegian</option>
                        <option value="ps">Pashto</option>
                        <option value="fa">Persian</option>
                        <option value="pl">Polish</option>
                        <option value="pt">Portuguese</option>
                        <option value="pa">Punjabi</option>
                        <option value="ro">Romanian</option>
                        <option value="ru">Russian</option>
                        <option value="sm">Samoan</option>
                        <option value="sp">Spanish</option>
                        <option value="gd">Scots Gaelic</option>
                        <option value="sr">Serbian</option>
                        <option value="st">Sesotho</option>
                        <option value="sn">Shona</option>
                        <option value="sd">Sindhi</option>
                        <option value="si">Sinhala</option>
                        <option value="sk">Slovak</option>
                        <option value="sl">Slovenian</option>
                        <option value="so">Somali</option>
                        <option value="su">Sundanese</option>
                        <option value="sw">Swahili</option>
                        <option value="sv">Swedish</option>
                        <option value="tg">Tajik</option>
                        <option value="ta">Tamil</option>
                        <option value="te">Telugu</option>
                        <option value="th">Thai</option>
                        <option value="tr">Turkish Cha</option>
                        <option value="uk">Ukrainian</option>
                        <option value="ur">Urdu</option>
                        <option value="ug">Uyghur</option>
                        <option value="uz">Uzbek</option>
                        <option value="vi">Vietnamese</option>
                        <option value="cy">Welsh</option>
                        <option value="xh">Xhosa</option>
                        <option value="yi">Yiddish</option>
                        <option value="yo">Yoruba</option>
                        <option value="zu">Zulu</option>
                    </select>
            </div>

            <section>
                <div className="chat-container">
                    {selectedChatLanguageCode ? (
                        <ChatRoom languageCode={selectedChatLanguageCode} />
                    ) : (
                        <ChatRoom />
                    )}
                </div>
            </section>
        </div>
    );
}

export default Chat;
