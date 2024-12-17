import React, { useEffect, useState } from 'react';
import './Message.css';
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import { FaPlay, FaPause } from "react-icons/fa";

function Message({ message, isSender }) {
  const { senderId, receiverId, content, messageType, audio } = message;
  const recorderControls = useVoiceVisualizer();
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('audio rendering')
    const getAudioBlob = async () => {
      try {
        const res = await fetch(audio);
        if (!res.ok) {
          throw new Error('Failed to fetch audio');
        }
        const blob = await res.blob();
        // setAudioBlob(blob);
        recorderControls.setPreloadedAudioBlob(blob);
      } catch (error) {
        console.error('Error fetching audio:', error);
        setError('Audio could not be loaded');
      }
    };

    if (messageType === 'audio') {
      getAudioBlob();
    }
  }, []);

  // useEffect(() => {
  //   console.log('audioblob rendering')
  //   if (audioBlob && recorderControls) {
  //     recorderControls.setPreloadedAudioBlob(audioBlob);
  //   }
  // }, [audioBlob]);

  const togglePlayPause = () => {
    recorderControls.togglePauseResume();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={`msg-container ${isSender ? 'pinned-right' : ''}`}>
      {messageType === 'audio' ? (
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
      ) : (
        <p>{content}</p>
      )}
    </div>
  );
}

export default Message;
