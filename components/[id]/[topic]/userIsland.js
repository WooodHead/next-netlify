import Link from 'next/link'

export default function UserComp(props) {

  const user = props.user

  const openCallPhone = () => {
    const devSite = `/${user.Username}/call`
    const prodSite = `https://talktree.me/${user.Username}/call`
    const currentSite = process.env.STAGE === 'prod' ? prodSite : devSite
    window.open(
      currentSite,
      "MsgWindow",
      "width=500,height=700"
    )
  }
  const openReviewPhone = () => {
    const devSite = `/${user.Username}/review`
    const prodSite = `https://talktree.me/${user.Username}/review`
    const currentSite = process.env.STAGE === 'prod' ? prodSite : devSite
    window.open(
      currentSite,
      "MsgWindow",
      "width=500,height=700"
    )
  }

  return (
      <div className="">
        <img width="100" height="100" src={user.image} ></img>
        <h3 className='mx-5 mt-5 '>{user.Username}</h3>
        <div className='mx-5 mb-3'>{user.TAVS}</div>
        <div className=" justify-center">
          <button className="w-24" type="button" onClick={openCallPhone}>call</button>
        </div>
        {user.ppm > 0 
          && <div className="text-md m-2">${user.ppm} / minute</div>
        }
        <div className="my-3" >
          {/* <div
            className="my-5 max-w-lg"
            dangerouslySetInnerHTML={{ __html: user.publicString }} ></div> */}
          <div className="bg-gray-100" ></div>
        </div>
      </div>
  )
}