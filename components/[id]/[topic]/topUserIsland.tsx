
const UserComponentTop = (props) => {

  const openCallPhone = () => {
    const devSite = `/${user.Username}/call`
    const prodSite = `https://talktree.me/${user.Username}/call`
    const currentSite = process.env.NEXT_PUBLIC_STAGE === 'prod' ? prodSite : devSite
    window.open(
      currentSite,
      "MsgWindow",
      "width=500,height=700"
    )
  }

  const user = props.user
  return (
    <div className="md:hidden flex m-5 mb-10">
      <div className="flex-shrink-0">
        { user.image && <img src={user.image} ></img>}
      </div>

      <div className="flex flex-col">
        <h3 className='mx-5 mt-5'>{user.Username}</h3>
        <div className='mx-5 mb-3'>{user.TAVS}</div>
        {user.ppm > 0 && <div className='mx-5 mb-3'>{'$' + user.ppm}</div>}
        <button type="button" onClick={openCallPhone}>call</button>
        {/* {user.receiver && <button className="mt-3" type="button" onClick={openReviewPhone}>donate</button>} */}
        {user.ppm > 0 && <div className="text-md m-2">${user.ppm} / minute</div>}
      </div>
      <div>
        {user.publicString}
      </div>
    </div>
  )
}
export default UserComponentTop