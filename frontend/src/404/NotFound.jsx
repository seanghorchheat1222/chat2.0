import { useNavigate } from "react-router-dom"

function NotFound() {
  const navigate = useNavigate();

  const toHome = () => {
    navigate('/')
  }

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center flex-col gap-2">
        <div>
          404, Page Not Found!
        </div>
        <div>
          <button className='cursor-pointer w-max h-max' onClick={() => toHome()}>
            <div className='bg-[#4883DF] w-30 h-11 flex items-center justify-center rounded-full px-4'>
              <div className='text-[#FFFFFF] font-semibold'>
                back
              </div>
            </div>
          </button>
        </div>
      </div>
    </>

  )
}

export default NotFound