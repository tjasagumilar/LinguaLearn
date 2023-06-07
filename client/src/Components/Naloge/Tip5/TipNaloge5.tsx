import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Exercise } from '../Exercises/Exercises';
import { Container, Row, Col, Button, Modal, Badge, Card } from 'react-bootstrap';
import jsonIcon from './110053-man-talking.json';
import Lottie from 'lottie-react';
import { useLocation } from 'react-router-dom';
import { BsFillVolumeUpFill } from 'react-icons/bs';
import { BASE_URL } from '../../../api';
import './TipNaloge5.css'
import { FaMicrophone } from 'react-icons/fa'
import { FaCheckCircle } from 'react-icons/fa';
import { FaTimesCircle } from 'react-icons/fa';
import { Word } from '../../MojeBesede/MojeBesede';


interface TipNaloge5Props {
    exercise: Exercise;
    uid: string;
    document: string;
    onCheck: () => void;
}

function getLocaleCode(language: string): string {
    const localeMap: Record<string, string> = {
        af: 'af-ZA',
        am: 'am-ET',
        ar: 'ar-SA',
        as: 'as-IN',
        az: 'az-AZ',
        be: 'be-BY',
        bg: 'bg-BG',
        bn: 'bn-IN',
        br: 'br-FR',
        bs: 'bs-BA',
        ca: 'ca-ES',
        cs: 'cs-CZ',
        cy: 'cy-GB',
        da: 'da-DK',
        de: 'de-DE',
        el: 'el-GR',
        en: 'en-US',
        eo: 'eo',
        es: 'es-ES',
        et: 'et-EE',
        eu: 'eu-ES',
        fa: 'fa-IR',
        fi: 'fi-FI',
        fil: 'fil-PH',
        fo: 'fo-FO',
        fr: 'fr-FR',
        ga: 'ga-IE',
        gd: 'gd-GB',
        gl: 'gl-ES',
        gu: 'gu-IN',
        he: 'he-IL',
        hi: 'hi-IN',
        hr: 'hr-HR',
        ht: 'ht-HT',
        hu: 'hu-HU',
        hy: 'hy-AM',
        id: 'id-ID',
        is: 'is-IS',
        it: 'it-IT',
        ja: 'ja-JP',
        jv: 'jv-ID',
        ka: 'ka-GE',
        kk: 'kk-KZ',
        km: 'km-KH',
        kn: 'kn-IN',
        ko: 'ko-KR',
        ky: 'ky-KG',
        lb: 'lb-LU',
        lo: 'lo-LA',
        lt: 'lt-LT',
        lv: 'lv-LV',
        mk: 'mk-MK',
        ml: 'ml-IN',
        mn: 'mn-MN',
        mr: 'mr-IN',
        ms: 'ms-MY',
        mt: 'mt-MT',
        nb: 'nb-NO',
        ne: 'ne-NP',
        nl: 'nl-NL',
        nn: 'nn-NO',
        no: 'no-NO',
        oc: 'oc-FR',
        or: 'or-IN',
        pa: 'pa-IN',
        pl: 'pl-PL',
        ps: 'ps-AF',
        pt: 'pt-PT',
        ro: 'ro-RO',
        ru: 'ru-RU',
        rw: 'rw-RW',
        se: 'se-NO',
        si: 'si-LK',
        sk: 'sk-SK',
        sl: 'sl-SI',
        sq: 'sq-AL',
        sr: 'sr-RS',
        sv: 'sv-SE',
        sw: 'sw-KE',
        ta: 'ta-IN',
        te: 'te-IN',
        th: 'th-TH',
        tl: 'tl-PH',
        tr: 'tr-TR',
        ug: 'ug-CN',
        uk: 'uk-UA',
        ur: 'ur-PK',
        uz: 'uz-UZ',
        vi: 'vi-VN',
        yo: 'yo-NG',
        zh: 'zh-CN',
        zu: 'zu-ZA',
    };

    return localeMap[language] || language;
}

const TipNaloge5 = ({ exercise, uid, document, onCheck }: TipNaloge5Props) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const language = queryParams.get('language') ?? "en";

    const besede = exercise.sentence.toLowerCase();
    const cleanedSentence = besede.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    const [sentence, setSentence] = useState<string[]>(cleanedSentence.split(' '));
    const [correctIndexes, setCorrectIndexes] = useState<number[]>([])
    const [audioSource, setAudioSource] = useState<string>(`${BASE_URL}/tts?tts=${exercise.sentence}&language=${language}`);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [showModal, setShowModal] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showTranslation, setShowTranslation] = useState(false);
    const { transcript, resetTranscript } = useSpeechRecognition();
    const [active, setActive] = useState(false);
    const [isSentenceInWords, setIsSentenceInWords] = useState(false);

    const [words, setWords] = useState<Word[]>([]);



    useEffect(() => {
        naloziBesede(uid);
        const words = exercise.sentence.toLowerCase();
        const cleanedSentence = words.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        setSentence(cleanedSentence.split(' '));

    }, [exercise.sentence]);

    const naloziBesede = (uid: string) => {
        fetch(`${BASE_URL}/getWords?uid=${uid}&language=${language}`)
            .then((response) => response.json())
            .then((data) => {
                setWords(data);
                setIsSentenceInWords(data.some((word: string) => word === exercise.sentence));
            })
            .catch((error) => console.error(error));
    };


    useEffect(() => {
        if (transcript !== '') {
            const lastWord = transcript.toLowerCase().split(' ').pop() || '';

            if (lastWord === sentence[correctIndexes.length]) {

                setCorrectIndexes(prevState => [...prevState, prevState.length]);
            } else {
                console.log("Word match failed!")
            }
            setTimeout(resetTranscript, 2000);
        }
    }, [transcript]);

    useEffect(() => {
        setAudioSource(prevAudioSource => {
            const newAudioSource = `${BASE_URL}/tts?tts=${encodeURIComponent(exercise.sentence)}&language=${language}`;
            if (prevAudioSource !== newAudioSource) {
                if (audioRef.current) {
                    audioRef.current.load();
                }
                return newAudioSource;
            }
            return prevAudioSource;
        });
    }, [exercise.sentence]);

    const updateCorrectSolved = async (uid: string, document: string) => {
        try {
            const response = await fetch(`${BASE_URL}/solvedCorrect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uid: uid, document: document, language: language }),
            });

            if (response.ok) {
            } else {
                throw new Error('Error: ' + response.status);
            }
        } catch (error) {
            console.error('Error: ' + error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        onCheck();
        setTimeout(() => {
            setIsCorrect(false);
        }, 1000);
    };

    const handleSkip = () => {
        setShowModal(true);
    };
    const languageSpeech = getLocaleCode(language);

    const startListening = (): void => SpeechRecognition.startListening({ continuous: true, language: languageSpeech });

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        console.log("Browser doesn't support speech recognition.");
        return null;
    }

    const handleCheck = async () => {
        const isAnswerCorrect = correctIndexes.length == sentence.length;

        if (isAnswerCorrect) {
            await updateCorrectSolved(uid, document)
        }
        setCorrectIndexes([])
        setIsCorrect(isAnswerCorrect);
        setShowModal(true);

    };

    const handleClickActive = () => {
        if (!active) {
            startListening();
        } else {
            SpeechRecognition.stopListening();
        }
        setActive(!active);
    };

    return (
        <form onSubmit={(e) => e.preventDefault()}>

            <Container className="myContainer p-3 rounded bg-white text-dark w-100" style={{ maxWidth: '900px' }}>
                <Row className="align-items-center">
                    <Col md={6}>

                        <h4 className="mb-0 font-weight-bold">Posnemajte glas</h4>
                    </Col>
                </Row>
                <Row className="mt-3 align-items-center">
                    <Col xs={6} md={3} lg={3} xl={3}>
                        <Lottie animationData={jsonIcon} loop={true} autoplay={true} style={{ width: "100%", height: "100%" }} />
                    </Col>
                    <Col xs={6} md={9} lg={9} xl={9}>
                        <div className="bubble11">
                            <Button
                                onClick={() => audioRef.current && audioRef.current.play()}
                                className="buttonZvok mb-3 custom-button"
                            >
                                <BsFillVolumeUpFill style={{ fontSize: '44px', color: 'blue' }} />
                            </Button>
                            <div className="text-container">
                                <h4 className="mb-0 font-weight-bold"> {sentence.map((word, index) => (
                                    <span key={index} style={{ color: correctIndexes.includes(index) ? 'blue' : 'black' }}>{word + " "}</span>
                                ))}</h4>
                            </div>
                        </div>
                    </Col>
                </Row>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '45vh' }}>
                    <Row className="mt-10 align-items-center">
                        <Col xs={3} sm={3} md={3} lg={3} xl={3}>
                            <div className={`mic-button ${active ? 'active' : ''}`} onClick={handleClickActive}>
                                {active ? (
                                    <FaMicrophone style={{ fontSize: '64px', color: 'orange' }} />
                                ) : (
                                    <FaMicrophone style={{ fontSize: '64px', color: 'orange' }} />
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>


                <audio ref={audioRef} style={{ display: 'none' }}>
                    <source src={audioSource} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>




                {/*   <Row className="mt-2">
                    <button onClick={startListening}>Start</button>
                    <button onClick={SpeechRecognition.stopListening}>Stop</button>
                    <br></br>  <br></br>
                    <Col md={8}>
                      </Col>
                </Row>
                                */}




            </Container>



            <div className="fixed-bottom pb-3">
                <div className="container-fluid">
                    <div className="upper-line"></div>
                    <Row className="align-items-center">
                        <Col xs={2} sm={2} md={2} lg={2} xl={2} className="text-center mb-2 mb-sm-2"></Col>
                        <Col xs={2} sm={2} md={2} lg={2} xl={2} className="text-center mb-2 mb-sm-0">
                            <Button onClick={handleSkip} className="btn first1p w-60 d-flex align-items-center justify-content-center mb-2">
                                <span className="btn-text">Preskoči</span>
                            </Button>
                        </Col>
                        <Col xs={2} sm={2} md={4} lg={4} xl={4} className="text-center mb-2 mb-sm-2 "></Col>
                        <Col xs={2} sm={2} md={2} lg={2} xl={2} className="text-center mb-2 mb-sm-2">
                            <Button onClick={handleCheck} className="btn first1 w-40 d-flex align-items-center justify-content-center"
                            >
                                <span className="btn-text">Preveri</span>
                            </Button>
                        </Col>
                        <Col xs={2} sm={2} md={2} lg={2} xl={2} className="text-center mb-2 mb-sm-0"></Col>
                    </Row>
                </div>
            </div>









            <Modal
                show={showModal}
                onHide={handleCloseModal}
                dialogClassName="custom-modal-dialog"
                contentClassName={isCorrect ? "custom-modal-content-correct" : "custom-modal-content-wrong"}
            >
                <Modal.Header closeButton style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Modal.Title>{isCorrect ? 'Pravilen odgovor!' : 'Napačna izgovorjava! '}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    {isCorrect ? (
                        <>
                            <FaCheckCircle size={70} color="green" /> <br /><br />
                            <span>Izgovorjava pravilna</span>
                        </>
                    ) : (
                        <>
                            <FaTimesCircle size={70} color="red" /> <br /><br />
                            <span>Izgovorjava ni bila pravilna</span>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Zapri
                    </Button>
                </Modal.Footer>
            </Modal>



        </form>
    );
}

export default TipNaloge5;