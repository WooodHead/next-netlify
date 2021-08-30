import clsx from 'clsx'
import { useRef, useState } from 'react'
declare var OT

const AboutMessage = props => {

  const [state, setState] = useState({
    mic: false,
    video: false,
    screen: false,
    text: true,
    textState: 'You are not connected with anyone'
  })
  const textInputRef = useRef(null)
  const publisherRef = useRef(null)

  const modifyState = e => setState({ ...state, ...e })

  const pressMicButton = async () => {
    if (state.mic) {
      publisherRef.current.destroy()
    } else {
      const pubOptions = {
        insertMode: 'append',
        // insertDefaultUI: false,
        videoSource: null,
      }
      publisherRef.current = OT.initPublisher('publisher', pubOptions)
    }
    modifyState({ mic: !state.mic })
  }

const pressVideoButton = () => {
  if (state.video) {
    publisherRef.current.destroy()
  } else {
    const pubOptions = {
      insertMode: 'append',
      showControls: false,
      width: 80,
      height: 70,
      audioSource: null
    }
    publisherRef.current = OT.initPublisher('publisher', pubOptions)
  }
  modifyState({ video: !state.video, text: state.video })

}
const pressScreenButton = async () => {
  const userMedia = await OT.getUserMedia({ videoSource: 'screen' })
  const pubOptions = {
    audioSource: null,
    // publishAudio: state.mic,
    insertMode: 'append',
    showControls: false,
    width: 80,
    height: 70,
    videoSource: userMedia.getVideoTracks()[0],
  }
  publisherRef.current = OT.initPublisher('publisher', pubOptions)
}

  const formSubmit = () => {

  }

  return (
    <div className="flex flex-col mb-5 border-2 border-solid">
      <div id="publisher" ></div>

      {state.text && <div className="m-5">
        <textarea
          id='textArea'
          readOnly
          style={{ width: "100%", height: 60 }}
          // rows={12}
          // cols={42}
          value={
            state.textState
          }
        ></textarea>
        <div id="feedControls" ></div>
        <div id="chatContainer" ></div>
        <div className="textBoxInput">
          <form onSubmit={formSubmit}>
            <textarea
              placeholder='type here'
              style={{ width: "100%", height: 32 }}
              // rows={2}
              // cols={42}
              ref={textInputRef}
            ></textarea>
          </form>
          <button onClick={formSubmit}>SEND</button>
        </div>
      </div>}

      <div className="flex flex-row" >
        <div 
        // onClick={() => modifyState({ text: !state.text })}
          className={clsx(
            "bg-text",
            "w-10 h-10 mr-5 my-5 ml-3 bg-gray-200 bg-center bg-no-repeat rounded shadow-md",
            "cursor-pointer hover:bg-gray-400",
            "focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-opacity-75"
          )}>
        </div>
        <div 
        // onClick={pressMicButton}
          className={clsx(
            state.mic ? "bg-micMuted" : "bg-mic",
            "w-10 h-10 m-5 bg-gray-200 bg-center bg-no-repeat rounded shadow-md",
            "cursor-pointer hover:bg-gray-400",
            "focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-opacity-75"
          )}>
        </div>
        <div 
        // onClick={pressVideoButton}
          className={clsx(
            state.video ? "bg-noVideo" : "bg-video",
            "w-10 h-10 m-5 bg-gray-200 bg-center bg-no-repeat rounded shadow-md",
            "cursor-pointer hover:bg-gray-400",
            "focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-opacity-75"
          )}>
        </div>
        <div 
        // onClick={pressScreenButton}
          className={clsx(
            "bg-screen",
            "w-10 h-10 my-5 ml-5 mr-3 bg-gray-200 bg-center bg-no-repeat rounded shadow-md",
            "cursor-pointer hover:bg-gray-400",
            "focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-opacity-75"
          )}>
        </div>
      </div>


    </div>
  )
}
export default AboutMessage