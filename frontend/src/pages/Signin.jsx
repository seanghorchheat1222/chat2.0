import { useEffect, useState } from "react"
import { currentUser, signIn } from "../services/signin";
import api from "../services/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../store/tokenSlice";
import { data, Navigate, useNavigate } from "react-router-dom";
import { setUser } from "../store/userSlice";

function Signin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token)
  const [form, setForm] = useState({
    email: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInput = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form, [name]: value
    }
    )
  }
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      const response = await api.post("auth/login", form)
      const data = response.data.token
      dispatch(setToken({ token: data }))
      if (response.status === 200 && response.data.token !== '') {
        const response = await currentUser();
        const data = await response.data.data
        dispatch(setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          profile: data.profile
        }))
        navigate('/')
      }
    } catch (err) {
      console.log(err)
      console.log("from message: " + err.response.data.message);
      setErrorMessage(err.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  const toSignUp = () => {
    navigate('/signup')
  }


  return (
    <>
      {
        token?.token ?
          <Navigate to='/' ></Navigate>
          :
          <div className='max-w-5xl mx-auto px-2 md:px-4 h-screen w-full flex justify-center items-center'>
            <div className='w-full md:w-[60%]'>
              <div className='text-start font-bold text-3xl'>
                HELLO, <span className='text-sm'>WELCOME BACK TO <span className='text-[#4883DF]'>CHAT2.0</span></span>
              </div>

              <div className='text-center font-bold mt-5'>
                Sign In
              </div>
              {
                errorMessage !== '' ? <div className="text-[#E96A6E] text-center mt-2">
                  {errorMessage}
                </div> : <></>
              }


              <form action="" onSubmit={handleSubmit}>

                <div className='flex flex-col gap-1  mt-1'>
                  <label htmlFor="">Email</label>
                  <input type="text" placeholder='Enter email' className='border border-[#C0C0C0] rounded-md outline-none px-2 py-2' name='email' value={form.email} onChange={handleInput} required />
                </div>


                <div className='flex flex-col gap-1  mt-1'>
                  <label htmlFor="">Password</label>
                  <input type="password" placeholder='Enter password' className='border border-[#C0C0C0] rounded-md outline-none px-2 py-2' name='password' value={form.password} onChange={handleInput} required />
                </div>

                <div className='w-full mt-1 flex justify-end'>
                  <button type="button" className='cursor-pointer w-max h-max'>
                    <div className=' flex items-center justify-between rounded-full'>
                      <div className='text-[#C0C0C0] w-full text-end'>
                        Forget password
                      </div>
                    </div>
                  </button>
                </div>


                <div className='w-full mt-5'>
                  <button disabled={isLoading} type="submit" className='cursor-pointer w-full h-max'>
                    {
                      isLoading ?
                        <div className='bg-[#4883DF] w-full h-11 flex items-center justify-center rounded-full px-4'>
                          <div className='w-7 h-7 border-l-3 border-b-3 border-t-3 rounded-full border-[#FFFFFF] animate-spin'></div>
                        </div>
                        :
                        <div className='bg-[#4883DF] w-full h-11 flex items-center rounded-full px-4'>
                          <div className='text-[#FFFFFF] w-full text-center'>
                            Log In
                          </div>
                        </div>
                    }
                  </button>
                </div>

              </form>

              <div className='w-full mt-5 flex justify-center'>
                <button className='cursor-pointer w-max h-max' onClick={() => toSignUp()}>
                  <div className=' flex items-center justify-between rounded-full'>
                    <div className='text-[#C0C0C0] w-full text-end'>
                      Dont't Have any account? <span className='text-[#4883DF]'>Sign up</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
      }
    </>
  )
}

export default Signin