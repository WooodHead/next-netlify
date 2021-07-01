import React, { useRef, useState } from 'react'

const TextComponent = props => {

  const textState = props.textState
  const onSignalSend = e => props.onSignalSend(e)
  const otherUser = props.otherUser
  
  const signalInputRef = useRef('')

  const [typingState, setTypingState] = useState(false)

  const signalSend = e => {
    e.preventDefault()
    onSignalSend(signalInputRef.current.value)
    signalInputRef.current.value = ''
  }

  let typingTimer

  const handleKeyPress = (e) => {
    /* prevents cognito Error every keystroke */
    if (otherUser) {
      if (typingTimer) { clearTimeout(typingTimer) }
      if (!typingState) {
        setTypingState(true)
        onSignalSend('%t%yping')
      }
      typingTimer = setTimeout(() => {
        setTypingState(false)
        onSignalSend('not%t%yping')
      }, 2000)
    }
  }

  const onKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      /* prevents textmessage from being called every keystroke */
      if (!otherUser) {
        onSignalSend(signalInputRef.current.value)
      }
      signalInputRef.current.value = ''
    }
    handleKeyPress(e)
  }

    return (
      <div className="m-5">
        <textarea
          id='textArea'
          readOnly
          style={{ resize: "both" }}
          rows="12"
          cols="42"
          value={
            textState
          }
        ></textarea>
        <div id="feedControls" ></div>
        <div id="chatContainer" ></div>
        <div className="textBoxInput">
          <form onSubmit={signalSend}>
              <textarea
                placeholder='type here'
                onKeyDown={onKeyPress}
                style={{ resize: "both" }}
                rows="2"
                cols="42"
                ref={signalInputRef}
              ></textarea>
          </form>
          <button onClick={signalSend}>SEND</button>
        </div>
      </div>
    );
}

export default TextComponent