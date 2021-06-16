import Login from '../logIn/logIn'
import Link from 'next/link'
import SignUp from '../logIn/signUp'
import ForgotPassword from '../logIn/forgotPassword'

const LogInModal = props => {
  const setModalState = (e) => props.setModalState(e)
  const modalState = props.modalState

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-4/5 my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200">
              <div className="text-3xl font-semibold">
                {modalState}
              </div>
              <div onClick={() => setModalState(false)} className="hover:bg-gray-200 rounded cursor-pointer py-1 px-2 text-2xl block outline-none focus:outline-none">
                x
              </div>
            </div>

            <div className="relative p-6 flex-auto">
              <div>
                {(modalState === "Login")
                  ? <Login setModalState={setModalState} /> 
                  : (modalState === "Sign Up")
                  ? <SignUp setModalState={setModalState} /> 
                  : (modalState === "Reset Password")
                  ? <ForgotPassword setModalState={setModalState}/>
                  : null
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}

export default LogInModal