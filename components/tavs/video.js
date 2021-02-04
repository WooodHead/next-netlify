import React, { useState, useEffect } from 'react'
import OT from '@opentok/client'

const VideoComponent = props => {

    const [backCamera, setBackCamera] = useState(false)
    const [mobileState, setMobileState] = useState()
    const audioOn = props.audioOn
    const otSDK = props.otSDK
    console.log('otSDK', otSDK)
    console.log('otSDK.stste()', otSDK.state())

    const publishG = async (newCameraProp) => {
        const newCamera = (newCameraProp === 'environment') ? 'environment' : 'user'
        try {
            OT.getDevices((error, devices) => {
                if (error) {
                    console.log(error)
                } else if (devices) {
                    const pubOptions = {
                        facingMode: newCamera,
                        publishVideo: 'Enable',
                        publishAudio: audioOn,
                        width: 50,
                        height: 50,
                        insertMode: 'append',
                        resize: 'both',
                    }
                    otSDK.publish('publisher', pubOptions)
                }

            }).catch((err) => console.log(err))
        } catch (err) {
            console.log(err)
        }
    }

    const changeCamera = () => {
        
        if (backCamera) {
            otSDK.unpublish(otSDK.state().publishers[0])
            publishG('user')
        } else {
            otSDK.unpublish(otSDK.state().publishers[0])
            publishG('environment')
        }
        setBackCamera(!backCamera)
    }

    useEffect(() => {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            setMobileState(true)
        }
        const publish = async () => {
            try {
                OT.getDevices((error, devices) => {
                    if (error) {
                        console.log(error)
                    } else if (devices) {
                        const pubOptions = {
                            facingMode: 'user',
                            publishVideo: 'Enable',
                            publishAudio: audioOn,
                            width: 50,
                            height: 50,
                            insertMode: 'append',
                            resize: 'both',
                        }
                        otSDK.publish('publisher', pubOptions)
                    }
                }).catch((err) => console.log(err))
            } catch (err) {
                console.log(err)
            }
        }

        const subscribeToStream = stream => {
            if (otSDK.session.streamMap && otSDK.session.streamMap[stream.id]) { return; }
            const options = {
                insertMode: 'before',
                width: 500,
                height: 400,
                resize: 'both'
            }
            otSDK.subscribe(stream, 'subscriber', options)
                .catch((err) => console.log(err));
        };

        otSDK.on({
            'streamCreated': ({ stream }) => subscribeToStream(stream),
        })
        publish()
    }, [audioOn, otSDK])


    return (
        <div>
            <div id="subscriber" ></div>
            <div id="publisher" className="publisher"></div>
            <div>
            { (mobileState) && <button onClick={() => changeCamera()}>change camera</button>}   
            </div>
            
        </div>
    )
}

export default VideoComponent