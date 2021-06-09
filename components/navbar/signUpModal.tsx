import SignUp from '../logIn/signUp'
import Link from 'next/link'

const SignUpModal = props => {
  const setModalState = (e) => props.setModalState(e)
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-4/5 my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200">
              <div className="text-3xl font-semibold">
                Sign Up
              </div>
              <div onClick={() => setModalState(false)} className="hover:bg-gray-200 rounded cursor-pointer py-1 px-2 text-2xl block outline-none focus:outline-none">
                X
              </div>
            </div>

            <div className="relative p-6 flex-auto">
              <span>By continuing, you agree to our </span>
              <span className="text-blue-500" >
                <Link href="/about">User Agreement</Link>
              </span>
              <span> and </span>
              <span className="text-blue-500">
                <Link href="/about">Privacy Policy</Link>
              </span>
              <span>
                .
              </span>
              <div>
                <SignUp setModalState={setModalState} />
              </div>
            </div>

          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}

export default SignUpModal