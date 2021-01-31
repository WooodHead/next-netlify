import React, { useEffect, useState } from 'react'
import OT from '@opentok/client'

const ScreenComponent = props => {  
  const [hidePublisher, setHidePublisher] = useState(true)
  const otSDK = props.otSDK

  const resizeWindow = async () => {
    window.resizeTo(1100, 850)
  }

  useEffect(() => {

    const getMediaPublish = async () => {
      Promise.all([
        OT.getUserMedia({
          videoSource: 'screen'
        }),
        (props.audioOn.current) ? OT.getUserMedia({
          videoSource: null
        }) : null
      ])
      .then(([screenStream, micStream]) => {
        console.log('screenStream', screenStream)
        const pubOptions = {
          insertMode: 'append',
          width: '100%',
          height: '100%',
          videoSource: screenStream.getVideoTracks()[0],
        }
        otSDK.publish('publisher', pubOptions) 
      }).catch((err) => console.log(err))
  }

    console.log(otSDK)
    const subscribeToStream = stream => {
      if (otSDK.session.streamMap && otSDK.session.streamMap[stream.id]) { return; }
      const options = {
        insertMode: 'before',
        width: 1024,
        height: 768,
        resize: 'both'
      }
      otSDK.subscribe(stream, 'subscriber', options)
      .catch((err) => console.log(err));
    };

    otSDK.on({
      'streamCreated' : ({ stream }) => subscribeToStream(stream),
    });
    getMediaPublish()
    resizeWindow()
  }, [otSDK, props.audioOn])

  return (
    <div >
          <div id="subscriber" >
          </div>
          <button onClick={() => setHidePublisher(!hidePublisher)}>show my shared screen</button>
          <div id="publisher" className="publisher" style={ (hidePublisher) ? 
            { width: '1px', height: '1px',  resize: 'both', overflow: 'auto' } : 
            { width: '512px', height: '384px',  resize: 'both', overflow: 'auto' }}>
          </div>

      </div>
  )
}

export default ScreenComponent