import React, { memo } from 'react'
import TranscriptCard from './TranscriptCard'

const Display = memo(({ allTexts }) => {
    return (
        <div className="container">
            {
                allTexts.length > 0 && (
                    allTexts.map(({ id, translation, base }) => {
                        return (
                            <TranscriptCard base={base} translation={translation} key={id} />
                        )
                    })
                )
            }
        </div>
    )
})

export default Display