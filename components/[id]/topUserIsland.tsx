import ChangeUserImage from "./changeUserImage"

const UserComponentTop = (props) => {

  const openMessagePhone = () => {
    const devSite = `/${user.Username}/message`
    const prodSite = `https://talktree.me/${user.Username}/message`
    const currentSite = process.env.NEXT_PUBLIC_STAGE === 'prod' ? prodSite : devSite
    window.open(
      currentSite,
      "MsgWindow",
      "width=500,height=700"
    )
  }

  const user = props.user
  return (
    <>
      <div className="flex m-5 mb-10">
        <div className="flex-shrink-0">
          {user.image && <img src={user.image} ></img>}
          <ChangeUserImage user={user} />
        </div>

        <div className="flex flex-col">
          <h3 className='mx-5 mt-5'>{user.Username}</h3>
          <div className='mx-5 mb-3'>{user.TAVS}</div>
          {user.ppm > 0 && <div className='mx-5 mb-3'>{'$' + user.ppm}</div>}
          <button type="button" onClick={openMessagePhone}>message</button>

          {/* {user.receiver && <button className="mt-3" type="button" onClick={openReviewPhone}>donate</button>} */}
          {user.ppm > 0 && <div className="m-2 text-md">${user.ppm} / minute</div>}
        </div>

      </div>
    </>
  )
}
export default UserComponentTop