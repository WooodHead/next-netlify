import React, { useRef, useState } from 'react'

const TextComponent = props => {

  const textState = props.textState
  const selectedDevice = props.selectedDevice

  const signalInputRef = useRef('')

  const [typingState, setTypingState] = useState(false)

  const signalSend = e => {
    e.preventDefault()
    props.onSignalSend(signalInputRef.current.value)
    signalInputRef.current.value = ''
  }

  let typingTimer
  const handleKeyPress = (e) => {
    if (typingTimer) { clearTimeout(typingTimer) }
    if (!typingState) {
      setTypingState(true)
      props.onSignalSend('%t%yping')
    }
    typingTimer = setTimeout(() => {
      setTypingState(false)
      props.onSignalSend('not%t%yping')
    }, 2000)
  }

  const onKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      props.onSignalSend(signalInputRef.current.value)
      signalInputRef.current.value = ''
    }
    handleKeyPress(e)
  }

    return (
      <div>
        <textarea
          id='textArea'
          readOnly
          style={{ resize: "both" }}
          rows={ (selectedDevice === "text") ? "8" : "3" }
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
                rows={ (selectedDevice === "text") ? "2" : "1" }
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