import React, { memo } from 'react'
import styles from "../styles/TranscriptCard.module.css"

const TranscriptCard = memo(({ base, translation }) => {
    return (
        <div className={styles.card}>
            <p>JA: {base}</p>
            <p>EN: {translation}</p>
        </div>
    )
})

export default TranscriptCard