import React, { memo } from 'react'
import TranscriptCard from './TranscriptCard'

const Display = memo(({ allTexts }) => {
    return (
        <div className="container">
            {
                allTexts.length > 0 && (
                    allTexts.map((textInfo) => {
                        return (
                            <TranscriptCard textInfo={textInfo} key={textInfo.id} />
                        )
                    })
                )
            }
        </div>
    )
})

export default Display