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
        general: { languageCode: 'General', name: "Splošni Klepet 💬" },
        af: { languageCode: 'Af', name: "Afrikaans Klepet 🇿🇦" },
        sq: { languageCode: 'Alb', name: "Albanian Klepet 🇦🇱" },
        am: { languageCode: 'Amh', name: "Amharic Klepet 🇪🇹" },
        ar: { languageCode: 'Ara', name: "Arabic Klepet 🇦🇪" },
        hy: { languageCode: 'Arm', name: "Armenian Klepet 🇦🇲" },
        az: { languageCode: 'Aze', name: "Azerbaijani Klepet 🇦🇿" },
        be: { languageCode: 'Bel', name: "Belarusian Klepet 🇧🇾" },
        eu: { languageCode: 'Bas', name: "Basque Klepet 🇪🇺" },
        bn: { languageCode: 'Ben', name: "Bengali Klepet 🇧🇩" },
        bs: { languageCode: 'Bos', name: "Bosnian Klepet 🇧🇦" },
        bg: { languageCode: 'Bul', name: "Bulgarian Klepet 🇧🇬" },
        ca: { languageCode: 'Cat', name: "Catalan Klepet 🇪🇸" },
        ceb: { languageCode: 'Ceb', name: "Cebuano Klepet 🇵🇭" },
        ny: { languageCode: 'Chi', name: "Chichewa Klepet 🇲🇼" },
        zh: { languageCode: 'Chi', name: "Chinese (Simplified) Klepet 🇨🇳" },
        zhcn: { languageCode: 'Chi', name: "Chinese (Simplified) Klepet 🇨🇳" },
        zhtw: { languageCode: 'Chi', name: "Chinese (Traditional) Klepet 🇹🇼" },
        co: { languageCode: 'Cor', name: "Corsican Klepet 🇫🇷" },
        hr: { languageCode: 'Cro', name: "Croatian Klepet 🇭🇷" },
        cs: { languageCode: 'Cze', name: "Czech Klepet 🇨🇿" },
        da: { languageCode: 'Dan', name: "Danish Klepet 🇩🇰" },
        nl: { languageCode: 'Dut', name: "Dutch Klepet 🇳🇱" },
        en: { languageCode: 'Eng', name: "English Klepet 🇺🇸" },
        eo: { languageCode: 'Esp', name: "Esperanto Klepet 🌍" },
        et: { languageCode: 'Est', name: "Estonian Klepet 🇪🇪" },
        tl: { languageCode: 'Fil', name: "Filipino Klepet 🇵🇭" },
        fi: { languageCode: 'Fin', name: "Finnish Klepet 🇫🇮" },
        fr: { languageCode: 'Fre', name: "French Klepet 🇫🇷" },
        fy: { languageCode: 'Fri', name: "Frisian Klepet 🇳🇱" },
        gl: { languageCode: 'Gal', name: "Galician Klepet 🇪🇸" },
        ka: { languageCode: 'Geo', name: "Georgian Klepet 🇬🇪" },
        de: { languageCode: 'Ger', name: "German Klepet 🇩🇪" },
        el: { languageCode: 'Gre', name: "Greek Klepet 🇬🇷" },
        gu: { languageCode: 'Guj', name: "Gujarati Klepet 🇮🇳" },
        ht: { languageCode: 'Hai', name: "Haitian Creole Klepet 🇭🇹" },
        ha: { languageCode: 'Hau', name: "Hausa Klepet 🇳🇬" },
        haw: { languageCode: 'Haw', name: "Hawaiian Klepet 🌺" },
        he: { languageCode: 'Heb', name: "Hebrew Klepet 🇮🇱" },
        iw: { languageCode: 'Heb', name: "Hebrew Klepet 🇮🇱" },
        hi: { languageCode: 'Hin', name: "Hindi Klepet 🇮🇳" },
        hmn: { languageCode: 'Hmo', name: "Hmong Klepet 🌍" },
        hu: { languageCode: 'Hun', name: "Hungarian Klepet 🇭🇺" },
        is: { languageCode: 'Ice', name: "Icelandic Klepet 🇮🇸" },
        ig: { languageCode: 'Igb', name: "Igbo Klepet 🇳🇬" },
        id: { languageCode: 'Ind', name: "Indonesian Klepet 🇮🇩" },
        ga: { languageCode: 'Iri', name: "Irish Klepet 🇮🇪" },
        it: { languageCode: 'Ita', name: "Italian Klepet 🇮🇹" },
        ja: { languageCode: 'Jap', name: "Japanese Klepet 🇯🇵" },
        jw: { languageCode: 'Jav', name: "Javanese Klepet 🇮🇩" },
        kn: { languageCode: 'Kan', name: "Kannada Klepet 🇮🇳" },
        kk: { languageCode: 'Kaz', name: "Kazakh Klepet 🇰🇿" },
        km: { languageCode: 'Khm', name: "Khmer Klepet 🇰🇭" },
        ko: { languageCode: 'Kor', name: "Korean Klepet 🇰🇷" },
        ku: { languageCode: 'Kur', name: "Kurdish (Kurmanji) Klepet 🌍" },
        ky: { languageCode: 'Kyr', name: "Kyrgyz Klepet 🇰🇬" },
        lo: { languageCode: 'Lao', name: "Lao Klepet 🇱🇦" },
        la: { languageCode: 'Lat', name: "Latin Klepet 🌍" },
        lv: { languageCode: 'Lat', name: "Latvian Klepet 🇱🇻" },
        lt: { languageCode: 'Lit', name: "Lithuanian Klepet 🇱🇹" },
        lb: { languageCode: 'Lux', name: "Luxembourgish Klepet 🇱🇺" },
        mk: { languageCode: 'Mac', name: "Macedonian Klepet 🇲🇰" },
        mg: { languageCode: 'Mal', name: "Malagasy Klepet 🇲🇬" },
        ms: { languageCode: 'Mal', name: "Malay Klepet 🇲🇾" },
        ml: { languageCode: 'Mal', name: "Malayalam Klepet 🇮🇳" },
        mt: { languageCode: 'Mal', name: "Maltese Klepet 🇲🇹" },
        mi: { languageCode: 'Mao', name: "Maori Klepet 🇳🇿" },
        mr: { languageCode: 'Mar', name: "Marathi Klepet 🇮🇳" },
        mn: { languageCode: 'Mon', name: "Mongolian Klepet 🇲🇳" },
        my: { languageCode: 'Mya', name: "Myanmar (Burmese) Klepet 🇲🇲" },
        ne: { languageCode: 'Nep', name: "Nepali Klepet 🇳🇵" },
        no: { languageCode: 'Nor', name: "Norwegian Klepet 🇳🇴" },
        ps: { languageCode: 'Pas', name: "Pashto Klepet 🌍" },
        fa: { languageCode: 'Per', name: "Persian Klepet 🇮🇷" },
        pl: { languageCode: 'Pol', name: "Polish Klepet 🇵🇱" },
        pt: { languageCode: 'Por', name: "Portuguese Klepet 🇵🇹" },
        pa: { languageCode: 'Pun', name: "Punjabi Klepet 🇮🇳" },
        ro: { languageCode: 'Rom', name: "Romanian Klepet 🇷🇴" },
        ru: { languageCode: 'Rus', name: "Russian Klepet 🇷🇺" },
        sm: { languageCode: 'Sam', name: "Samoan Klepet 🇼🇸" },
        sp: { languageCode: 'Spa', name: "Spanish Klepet 🇪🇸" },
        gd: { languageCode: 'Sco', name: "Scots Gaelic Klepet 🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
        sr: { languageCode: 'Ser', name: "Serbian Klepet 🇷🇸" },
        st: { languageCode: 'Ses', name: "Sesotho Klepet 🇱🇸" },
        sn: { languageCode: 'Sho', name: "Shona Klepet 🇿🇼" },
        sd: { languageCode: 'Sin', name: "Sindhi Klepet 🇵🇰" },
        si: { languageCode: 'Sin', name: "Sinhala Klepet 🇱🇰" },
        sk: { languageCode: 'Slo', name: "Slovak Klepet 🇸🇰" },
        sl: { languageCode: 'Slo', name: "Slovenian Klepet 🇸🇮" },
        so: { languageCode: 'Som', name: "Somali Klepet 🇸🇴" },
        su: { languageCode: 'Sun', name: "Sundanese Klepet 🇮🇩" },
        sw: { languageCode: 'Swah', name: "Swahili Klepet 🌍" },
        sv: { languageCode: 'Swe', name: "Swedish Klepet 🇸🇪" },
        tg: { languageCode: 'Taj', name: "Tajik Klepet 🇹🇯" },
        ta: { languageCode: 'Tam', name: "Tamil Klepet 🇮🇳" },
        te: { languageCode: 'Tel', name: "Telugu Klepet 🇮🇳" },
        th: { languageCode: 'Tha', name: "Thai Klepet 🇹🇭" },
        tr: { languageCode: 'Tur', name: "Turkish Klepet 🇹🇷" },
        uk: { languageCode: 'Ukr', name: "Ukrainian Klepet 🇺🇦" },
        ur: { languageCode: 'Urd', name: "Urdu Klepet 🇵🇰" },
        ug: { languageCode: 'Uig', name: "Uyghur Klepet 🌍" },
        uz: { languageCode: 'Uzb', name: "Uzbek Klepet 🇺🇿" },
        vi: { languageCode: 'Vie', name: "Vietnamese Klepet 🇻🇳" },
        cy: { languageCode: 'Wel', name: "Welsh Klepet 🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
        xh: { languageCode: 'Xho', name: "Xhosa Klepet 🇿🇦" },
        yi: { languageCode: 'Yid', name: "Yiddish Klepet 🌍" },
        yo: { languageCode: 'Yor', name: "Yoruba Klepet 🇳🇬" },
        zu: { languageCode: 'Zul', name: "Zulu Klepet 🇿🇦" }
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
                <label htmlFor="chat-select">Izberite klepetalnico: </label>
                <select id="chat-select" value={selectedChat} onChange={handleChatChange}>
                        <option value="general">Splošni</option>
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
