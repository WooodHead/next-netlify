import TAVS from './tavs'
import PPM from './ppm'
import ConnectStripe from './connectStripe'

export default function ReceiverSettings(props) {

  const state = props.state
  const modifyState = e => props.modifyState(e)

  return (
    <>
    <div></div>
    <TAVS state={state} modifyState={modifyState} />
    <PPM state={state} modifyState={modifyState}/>
    <ConnectStripe state={state} modifyState={modifyState}/>
    </>
  )
}