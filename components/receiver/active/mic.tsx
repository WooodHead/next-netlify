import React, { useEffect } from 'react'

const MicComponent = props => {
  const state = props.state
  const session = props.session

  useEffect(() => {
    /* without this in useEffect, publisher doesn't unpublish, so shit duplicates */
    const pubOptions = state.mic ? {
      // insertMode: 'append',
      showControls: false,
      width: 80,
      height: 70,
      videoSource: null,
      // style: {
      //   audioLevelDisplayMode: true
      // }
      // publishAudio: audioOn
    } : {
      showControls: false,
      width: 80,
      height: 70,
      videoSource: null,
      audioSource: null
    }
      session.publish('publisher', pubOptions)
  }, [session])


// if (session) {
  return (
    <div>
          {/* <div id="subscriber"></div> */}
          <div id="publisher" ></div>
      </div>

  );
// } else {
//   <div>error</div>
// }

}

export default MicComponent