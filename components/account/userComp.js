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

  return (
      <div className="mx-5">
        <div className="flex flex-row bg-gray-100 my-5">
          <div className="flex flex-col mx-5 mb-5">
            <h3 className='mx-5 mt-5'>{user.Username}</h3>
            <div className='mx-5 mb-3'>{user.TAVS}</div>
            {/* <div className='mx-5 mb-3'>{'$' + user.ppm}</div> */}
            <button type="button" onClick={openCallPhone}>chat</button>
          </div>
          <div className="my-3" >
          <div className="my-5 bg-gray-100" dangerouslySetInnerHTML={{ __html: user.publicString }} ></div>
          </div>
        </div>

        <div className="bg-gray-100" >
          {Object.keys(user.topics).map((folder) => 
            <div key={folder} className="my-3">
              <Link href={"/" + user.Username + "/" + folder}>
                <a className="mx-2 py-1 px-2 font-semibold rounded shadow-md hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-opacity-75">{folder}</a>
                </Link>
            </div>
          )}
        </div>
      </div>
  )
}