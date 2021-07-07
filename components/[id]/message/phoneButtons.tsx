import clsx from 'clsx'

const PhoneButtons = props => {
  const state = props.state
  const setState = e => props.setState(e)
  const publishMic = () => props.publishMic()
  const publishVideo = () => props.publishVideo()
  const publishScreen = () => props.publishScreen()
  const unpublish = () => props.unPublish()

  const pressMicButton = () => {
    // i need to not unpublish when video on/etc
    state.mic ? unpublish() : publishMic()
    setState({...state, mic: !state.mic})
  }
  const pressVideoButton = () => {
    state.video ? unpublish() : publishVideo(), setState({...state, mic: true, video: true})
  }
  const pressScreenButton = () => {
    state.screen ? unpublish() : publishScreen()
    setState({...state, screen: !state.screen})
  }

  return (
    <div className="flex">
          <div onClick={() => setState({...state, text: !state.text})}
            className={clsx(
              "bg-text",
              "w-10 h-10 m-5 bg-gray-200 bg-center bg-no-repeat rounded shadow-md",
              "cursor-pointer hover:bg-gray-400",
              "focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-opacity-75"
            )}>
          </div>
          <div onClick={pressMicButton}
            className={clsx(
              state.mic ? "bg-mic" : "bg-micMuted",
              "w-10 h-10 m-5 bg-gray-200 bg-center bg-no-repeat rounded shadow-md",
              "cursor-pointer hover:bg-gray-400",
              "focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-opacity-75"
            )}>
          </div>
          {/* <div onClick={() => setState({...state, audio: !state.audio})}
            className={clsx(
              state.audio ? "bg-audio" : "bg-noAudio",
              "w-10 h-10 m-5 bg-gray-200 bg-center bg-no-repeat rounded shadow-md",
              "cursor-pointer hover:bg-gray-400",
              "focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-opacity-75"
            )}>
          </div> */}
          <div onClick={pressVideoButton}
            className={clsx(
              state.video ? "bg-video" : "bg-noVideo",
              "w-10 h-10 m-5 bg-gray-200 bg-center bg-no-repeat rounded shadow-md",
              "cursor-pointer hover:bg-gray-400",
              "focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-opacity-75"
            )}>
          </div>
          <div onClick={pressScreenButton}
            className={clsx(
              "bg-screen",
              "w-10 h-10 m-5 bg-gray-200 bg-center bg-no-repeat rounded shadow-md",
              "cursor-pointer hover:bg-gray-400",
              "focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-opacity-75"
            )}>
          </div>

          </div>
  )
}
export default PhoneButtons