import "regenerator-runtime"
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Display from "./Display";
import styles from "../styles/Dictaphone.module.css"

const Dictaphone = memo(() => {
    const {
        transcript,
        interimTranscript,
        listening,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();
    const [isListening, setIsListening] = useState(false)
    const [allTexts, setAlltexts] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [logOpen, setLogOpen] = useState(false)
    const [sourceLang, setSourceLang] = useState("JA")
    const [targetLang, setTargetLang] = useState("EN")

    const lang_lists = useMemo(() => {
        return [
            { code: "BG", value: "BG - Bulgarian" },
            { code: "CS", value: "CS - Czech" },
            { code: "DA", value: "DA - Danish" },
            { code: "DE", value: "DE - German" },
            { code: "EL", value: "EL - Greek" },
            { code: "EN", value: "EN - English" },
            { code: "ES", value: "ES - Spanish" },
            { code: "ET", value: "ET - Estonian" },
            { code: "FI", value: "FI - Finnish" },
            { code: "FR", value: "FR - French" },
            { code: "HU", value: "HU - Hungarian" },
            { code: "ID", value: "ID - Indonesian" },
            { code: "IT", value: "IT - Italian" },
            { code: "JA", value: "JA - Japanese" },
            { code: "LT", value: "LT - Lithuanian" },
            { code: "LV", value: "LV - Latvian" },
            { code: "NL", value: "NL - Dutch" },
            { code: "PL", value: "PL - Polish" },
            { code: "PT", value: "PT - Portuguese (all Portuguese varieties mixed)" },
            { code: "RO", value: "RO - Romanian" },
            { code: "RU", value: "RU - Russian" },
            { code: "SK", value: "SK - Slovak" },
            { code: "SL", value: "SL - Slovenian" },
            { code: "SV", value: "SV - Swedish" },
            { code: "TR", value: "TR - Turkish" },
            { code: "UK", value: "UK - Ukrainian" },
            { code: "ZH", value: "ZH - Chinese" },
        ]
    }, [])


    const translate = useCallback(async (e) => {
        e.preventDefault();
        if (!isListening && !listening) {
            const API_URL = import.meta.env.VITE_API_URL;
            const API_KEY = import.meta.env.VITE_API_KEY;
            const query = encodeURI(`auth_key=${API_KEY}&text=${interimTranscript}&source_lang=${sourceLang}&target_lang=${targetLang}`)
            const url = `${API_URL}?${query}`;
            try {
                setLoading(true)
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    const id = Date.now();
                    if (data.translations[0]["text"]) {
                        const textData = { id, translation: data.translations[0]["text"], base: interimTranscript, source_lang: sourceLang, target_lang: targetLang }
                        setAlltexts([...allTexts, textData])
                    } else {
                        throw new Error("Translation was failed. Please try again a littele later.")
                    }
                } else {
                    throw new Error(`Could not reach the API: ${response.statusText}`);
                }
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
    }, [isListening, sourceLang, targetLang])

    useEffect(() => {
        const main = document.getElementById("main")
        if (listening) {
            main.classList.add("listening")
        } else {
            main.classList.remove("listening")
        }
    }, [listening])


    const listeningToggle = useCallback(() => {
        if (isListening) {
            SpeechRecognition.stopListening()
        } else {
            setError("")
            SpeechRecognition.startListening({ continuous: true })
        }
        setIsListening(!isListening)
    }, [isListening])

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
        <>
            <form onSubmit={e => translate(e)} method="POST" className={styles.form}>
                <p className={`${styles.status} ${listening ? styles.active : styles.passive}`}>Microphone: {listening ? 'on' : 'off'}</p>
                <button
                    type="submit"
                    onClick={listeningToggle}
                    disabled={loading}
                >{listening ? "Stop listening" : "Start listening"}</button>
                <select name="source_lang" id="source_lang" defaultValue={"JA"} onChange={(e) => setSourceLang(e.target.value)}>
                    {
                        lang_lists.map(({ code, value }) => <option value={code} key={code}>{value}</option>)
                    }
                </select>
                <select name="target_lang" id="target_lang" defaultValue={"EN"} onChange={(e) => setTargetLang(e.target.value)}>
                    {
                        lang_lists.map(({ code, value }) => <option value={code} key={code}>{value}</option>)
                    }
                </select>
                <button type="button" className={styles.log} onClick={() => setLogOpen(!logOpen)}>{logOpen ? "close" : "log"}</button>
                {logOpen && <p>{transcript}</p>}
                {/* <p >{listening ? transcript : interimTranscript}</p> */}
                <p>{interimTranscript}</p>
                {error && <p className="error">{error}</p>}
            </form>
            <Display allTexts={allTexts} />
        </>
    );
});
export default Dictaphone;