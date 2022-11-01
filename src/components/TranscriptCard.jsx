import React, { memo } from 'react'
import styles from "../styles/TranscriptCard.module.css"

const TranscriptCard = memo(({ textInfo: { base, translation, source_lang, target_lang } }) => {
    return (
        <div className={styles.card}>
            <p>{`${source_lang}: ${base}`}</p>
            <p>{`${target_lang}: ${translation}`}</p>
        </div>
    )
})

export default TranscriptCard