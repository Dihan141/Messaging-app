import React, { useEffect } from 'react'
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";

function VoiceMessage({ src }) {
    const recorderControls = useVoiceVisualizer();

    useEffect(() => {
        const getBlob = async () => {
            let blob = await fetch(src).then(r => r.blob());
            console.log(blob);
            if (blob) {
                recorderControls.setPreloadedAudioBlob(blob);
            }
        }
        getBlob();
    }, [])
  return (
    <div>
        <VoiceVisualizer
            controls={recorderControls} 
        />
    </div>
  )
}

export default VoiceMessage