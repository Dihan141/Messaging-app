import React from 'react'
import '../message.css'
import { VoiceVisualizer } from "react-voice-visualizer";
import { FaPlay, FaPause } from "react-icons/fa";

function VoiceMessage({ isSender, recorderControls, error, togglePlayPause, positionStyle }) {
  return (
    <div className={`msg-container ${positionStyle()} ${isSender ? 'pinned-right' : ''}`}>
        <div className='audio-msg'>
        {error ? <i>{error}</i> : 
        <>
          <button onClick={togglePlayPause} className='audio-btn'>
            {!recorderControls.isPausedRecordedAudio ? 
            <FaPause color='white' /> 
            : <FaPlay color='white' />}
          </button>
          <VoiceVisualizer
            controls={recorderControls}
            isDefaultUIShown={false}
            isControlPanelShown={false} // Don't show the default UI
            secondaryBarColor="white"
            rounded={2}
            height={50}
            width={150}
          />
          <p className='audio-duration'>{parseInt(recorderControls.duration/60)}:{parseInt(recorderControls.duration%60)}</p>
        </>}
        </div>
    </div>
  )
}

export default VoiceMessage