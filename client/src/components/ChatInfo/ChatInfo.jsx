import React from 'react'
import { useChatInfo } from '../../hooks/useChatInfo'

function ChatInfo() {
  const { isChatInfoOpen } = useChatInfo()
  return (
    <div className={isChatInfoOpen ? 'chat-info' : 'hidden'}>ChatInfo</div>
  )
}

export default ChatInfo