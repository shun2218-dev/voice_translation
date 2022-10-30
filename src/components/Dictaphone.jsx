import "regenerator-runtime"
import React, { memo, useCallback, useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Display from "./Display";
import styles from "../styles/Dictaphone.module.css"

const Dictaphone = memo(() => {
    const {
        transcript,
        interimTranscript,
        finalTranscript,
        listening,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();
    const [isListening, setIsListening] = useState(false)
    const [allTexts, setAlltexts] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [logOpen, setLogOpen] = useState(false)


    const translate = useCallback(async (e) => {
        e.preventDefault();
        if (!isListening && !listening) {
            const API_URL = import.meta.env.VITE_API_URL;
            const API_KEY = import.meta.env.VITE_API_KEY;
            const query = encodeURI(`auth_key=${API_KEY}&text=${interimTranscript}&source_lang=JA&target_lang=EN`)
            const url = `${API_URL}?${query}`;
            try {
                setLoading(true)
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    const id = Date.now();
                    if (data.translations[0]["text"]) {
                        const textData = { id, translation: data.translations[0]["text"], base: interimTranscript }
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
    }, [isListening])

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