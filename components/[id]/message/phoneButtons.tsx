import clsx from 'clsx'

const PhoneButtons = props => {
  const state = props.state
  const setState = e => props.setState(e)
  console.log({...state})
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
          <div onClick={() => setState({...state, mic: !state.mic})}
            className={clsx(
              state.mic ? "bg-mic" : "bg-micMuted",
              "w-10 h-10 m-5 bg-gray-200 bg-center bg-no-repeat rounded shadow-md",
              "cursor-pointer hover:bg-gray-400",
              "focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-opacity-75"
            )}>
          </div>
          <div onClick={() => setState({...state, audio: !state.audio})}
            className={clsx(
              state.audio ? "bg-audio" : "bg-noAudio",
              "w-10 h-10 m-5 bg-gray-200 bg-center bg-no-repeat rounded shadow-md",
              "cursor-pointer hover:bg-gray-400",
              "focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-opacity-75"
            )}>
          </div>
          <div onClick={() => setState({...state, video: !state.video})}
            className={clsx(
              state.video ? "bg-video" : "bg-noVideo",
              "w-10 h-10 m-5 bg-gray-200 bg-center bg-no-repeat rounded shadow-md",
              "cursor-pointer hover:bg-gray-400",
              "focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-opacity-75"
            )}>
          </div>
          <div onClick={() => setState({...state, screen: !state.screen})}
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