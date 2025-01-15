import React from 'react'
import VoiceMessage from './VoiceMessage'
import TextMessage from './TextMessage'
import defaultProfile from '../../../assets/default-profile.png'
import '../message.css'
import { useChatUserContext } from '../../../hooks/useChatUserContext'

function UserMessage({ isSender, message, recorderControls, error, togglePlayPause, lastMsgInGrp, position }) {
    const { content, messageType, audio } = message
    const { chatUser } = useChatUserContext()

    const positionStyle = () => {
        if(position.firstMsg){
          if(isSender)
            return 'msg-container-first-sender'
          return 'msg-container-first'
        }
        else if(position.middleMsg){
          if(isSender)
            return 'msg-container-middle-sender'
          return 'msg-container-middle'
        }
        else if(position.lastMsg){
          if(isSender)
            return 'msg-container-last-sender'     
          return 'msg-container-last'
        }
        else
          return ''
    }

  return (
    <div className={!isSender && lastMsgInGrp ? 'image-message' : 'no-image-message'}>
        {
            (!isSender && lastMsgInGrp) && <img src={chatUser.profilePic || defaultProfile} alt="Profile" className='avatar' />
        }
        {messageType == 'audio' ? 
            <VoiceMessage isSender={isSender} recorderControls={recorderControls} error={error} togglePlayPause={togglePlayPause} positionStyle={positionStyle} />
            : <TextMessage isSender={isSender} content={content} positionStyle={positionStyle}/>
        }
    </div>
  )
}

export default UserMessage