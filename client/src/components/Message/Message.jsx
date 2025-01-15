import React, { useEffect, useState } from 'react';
import './Message.css';
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import UserMessage from './UserMessage/UserMessage';

function Message({ message, isSender, lastMsgInGrp, position }) {
  const { senderId, receiverId, content, messageType, audio } = message;
  const recorderControls = useVoiceVisualizer();
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
    // <>
    //   {messageType == 'audio'? 
    //   <VoiceMessage isSender={isSender} recorderControls={recorderControls} error={error} togglePlayPause={togglePlayPause} />
    //   :<TextMessage isSender={isSender} content={content}/>}
    // </>
    <UserMessage 
      isSender={isSender} 
      message={message} 
      recorderControls={recorderControls} 
      error={error} 
      togglePlayPause={togglePlayPause} 
      lastMsgInGrp={lastMsgInGrp}
      position={position}
    />
  );
}

export default Message;
