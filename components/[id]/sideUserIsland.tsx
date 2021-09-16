import { useRouter } from 'next/router'
import ChangeUserImage from './changeUserImage'
export default function UserIslandTopic(props) {

  const user = props.user
  const router = useRouter()

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

  // const openReviewPhone = () => {
  //   const devSite = `/${user.Username}/review`
  //   const prodSite = `https://talktree.me/${user.Username}/review`
  //   const currentSite = process.env.NEXT_PUBLIC_STAGE === 'prod' ? prodSite : devSite
  //   window.open(
  //     currentSite,
  //     "MsgWindow",
  //     "width=500,height=700"
  //   )
  // }
  const goToUserPage = () => {
    router.push(`/${user.Username}`)
  }

  return (
    <div className="hidden md:flex lg:flex xl:flex 2xl:flex">
      <div >
        <div onClick={goToUserPage} className="cursor-pointer">
          { user.image && <img width="100" height="100" src={user.image} ></img>}
          <ChangeUserImage user={user} />
          <h3 className='mx-5 mt-5 '>{user.Username}</h3>
          <div className='mx-5 mb-3'>{user.TAVS}</div>
          <span className="p-2 text-xs">🟢   available</span>
        </div>


        <div className="justify-center ">
          <button className="w-24" type="button" onClick={openMessagePhone}>message</button>
        </div>
        {user.ppm > 0
          && <div className="m-2 text-md">${user.ppm} / minute</div>
        }
        <div className="max-w-xs my-3 text-xs" >
          {/* {user.publicString} */}
          <div className="bg-gray-100" ></div>
        </div>
      </div>

    </div>
  )
}