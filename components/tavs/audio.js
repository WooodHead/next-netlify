import React, { useEffect } from 'react'

const AudioComponent = props => {
  const otSDK = props.otSDK

  useEffect(() => {
      const subOptions = {
    width: 230,
    height: 200,
  }
    console.log(otSDK.state())
    otSDK.on({
      'streamCreated' : ({ stream }) => otSDK.subscribe(stream, "subscriber", subOptions),
    })
    const pubOptions = {
      // insertMode: 'append',
      width: 80,
      height: 70,
      videoSource: null,
      // audioSource: (props.audioOn.current) ? micStream.getAudioTracks()[0] : null
      // publishAudio: audioOn
    }
      otSDK.publish('publisher', pubOptions)
  }, [otSDK])


if (otSDK) {
  return (
    <div>
          <div id="subscriber"></div>
          <div id="publisher" ></div>
      </div>

  );
} else {
  <div>error</div>
}

}

export default AudioComponent