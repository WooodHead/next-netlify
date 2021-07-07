import clsx from 'clsx'

const PhoneButtons = props => {
  const state = props.state
  const setState = e => props.setState({...state, ...e})
  const publishMic = () => props.publishMic()
  const publishVideo = () => props.publishVideo()
  const publishScreen = () => props.publishScreen()
  const unpublish = () => props.unPublish()
  const unPublishMic = () => props.unPublishMic()

  const pressMicButton = () => {
    state.mic ? unPublishMic() : publishMic()
    setState({mic: !state.mic})
  }
  const pressVideoButton = () => {
    console.log(state)
    if (state.screen) {
      unpublish()
      setState({screen: false})
      // publishVideo()
    }
    setState({video: !state.video})
    state.video ? unpublish() : publishVideo()
    
  }
  const pressScreenButton = () => {
    if (state.video) {
      unpublish() 
      setState({video: false})
      // publishScreen()
    }
    state.screen ? unpublish() : publishScreen()
    setState({screen: !state.screen})
  }

  return (
    <div className="flex">
          <div onClick={() => setState({text: !state.text})}
            className={clsx(
              "bg-text",
              "w-10 h-10 m-5 bg-gray-200 bg-center bg-no-repeat rounded shadow-md",
              "cursor-pointer hover:bg-gray-400",
              "focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-opacity-75"
            )}>
          </div>
          <div onClick={pressMicButton}
            className={clsx(
              state.mic ? "bg-micMuted" : "bg-mic",
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
              state.video ? "bg-noVideo" : "bg-video",
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