import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { confirmOTP, createUser, requestOTP } from "../services/signup";

function Signup() {
  const navigate = useNavigate();
  const [requestOtpForm, setRequestOtpForm] = useState(true);
  const [confirmOtpForm, setConfirmOtpForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    otp: ""
  })

  const toSignin = () => {
    navigate('/signin')
  }

  const handleInput = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form, [name]: value
    })
  }

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      const response = await requestOTP(form);

      if (response.status === 200) {
        setRequestOtpForm(false)
        setConfirmOtpForm(true)
      }

    } catch (err) {
      console.log(err.response.data.message)
      setErrorMessage(err.response.data.message)
      setRequestOtpForm(true)
    } finally {
      setIsLoading(false)
    }

  }

  const handleConfirmOTP = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true)
      const response = await confirmOTP(form);
      if (response.status === 200) {
        setConfirmOtpForm(false)
      }
    } catch (err) {
      console.log(err.response.data.message)
      setErrorMessage(err.response.data.message)
      setConfirmOtpForm(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const response = await createUser(form);
      if (response.status === 201) {
        toSignin()
      }
    } catch (err) {
      console.log(err.response.data.message)
      setErrorMessage(err.response.data.message)
      setConfirmOtpForm(false)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <>
      <div className='max-w-5xl mx-auto px-2 md:px-4 h-screen w-full flex justify-center items-center'>
        <div className='w-full md:w-[60%]'>
          <div className='text-start font-bold text-3xl'>
            HELLO, <span className='text-sm'>WELCOME TO <span className='text-[#4883DF]'>CHAT2.0</span></span>
          </div>

          <div className='text-center font-bold mt-5'>
            Sign Up
          </div>

          {
            errorMessage !== '' ? <div className="text-[#E96A6E] text-center mt-2">
              {errorMessage}
            </div> : <></>
          }


          {
            requestOtpForm ?
              <form action="" onSubmit={handleRequestOTP}>

                <div className='flex flex-col gap-1  mt-1'>
                  <label htmlFor="">Email</label>
                  <input type="text" placeholder='Enter email' name='email' value={form.email} onChange={handleInput} className='border border-[#C0C0C0] rounded-md outline-none px-2 py-2' required />
                </div>

                <div className='w-full mt-1 flex justify-end'>
                  <button className='cursor-pointer w-max h-max' type="button">
                    <div className=' flex items-center justify-between rounded-full'>
                      <div className='text-[#C0C0C0] w-full text-end'>
                        Forget password
                      </div>
                    </div>
                  </button>
                </div>


                <div className='w-full mt-5'>
                  <button className='cursor-pointer w-full h-max' type="submit" disabled={isLoading}>
                    {
                      isLoading ? <div className='bg-[#4883DF] w-full h-11 flex items-center justify-center rounded-full px-4'>
                        <div className='w-7 h-7 border-l-3 border-b-3 border-t-3 rounded-full border-[#FFFFFF] animate-spin'></div>
                      </div> :
                        <div className='bg-[#4883DF] w-full h-11 flex items-center justify-between rounded-full px-4'>
                          <div className='text-[#FFFFFF] w-full text-center'>
                            Request OTP
                          </div>
                        </div>
                    }

                  </button>
                </div>
              </form> : confirmOtpForm ?
                <form action="" onSubmit={handleConfirmOTP}>

                  <div className='flex flex-col gap-1  mt-1'>
                    <label htmlFor="">OTP</label>
                    <input type="text" placeholder='Enter OTP' className='border border-[#C0C0C0] rounded-md outline-none px-2 py-2' name="otp" value={form.otp} onChange={handleInput} required />
                  </div>

                  <div className='flex flex-col gap-1  mt-1'>
                    <label htmlFor="">Email</label>
                    <input type="text" placeholder='Enter email' className='border border-[#C0C0C0] rounded-md outline-none px-2 py-2' readOnly value={form.email} />
                  </div>

                  <div className='w-full mt-1 flex justify-end'>
                    <button className='cursor-pointer w-max h-max' type="submit">
                      <div className=' flex items-center justify-between rounded-full w-full h-11'>
                        <div className='text-[#C0C0C0] w-full text-end'>
                          Forget password
                        </div>
                      </div>
                    </button>
                  </div>


                  <div className='w-full mt-5'>
                    <button className='cursor-pointer w-full h-max' type="submit">
                      {
                        isLoading ? <div className='bg-[#4883DF] w-full h-11 flex items-center justify-center rounded-full px-4'>
                          <div className='w-7 h-7 border-l-3 border-b-3 border-t-3 rounded-full border-[#FFFFFF] animate-spin'></div>
                        </div> :
                          <div className='bg-[#4883DF] w-full h-11 flex items-center justify-between rounded-full px-4'>
                            <div className='text-[#FFFFFF] w-full text-center'>
                              Confirm OTP
                            </div>
                          </div>

                      }

                    </button>
                  </div>
                </form> :
                <form action="" onSubmit={handleSignUp}>

                  <div className='flex flex-col gap-1  mt-1'>
                    <label htmlFor="">Name</label>
                    <input type="text" placeholder='Enter name' className='border border-[#C0C0C0] rounded-md outline-none px-2 py-2' required name='name'  value={form.name} onChange={handleInput} />
                  </div>


                  <div className='flex flex-col gap-1  mt-1'>
                    <label htmlFor="">Email</label>
                    <input type="text" placeholder='Enter email' className='border border-[#C0C0C0] rounded-md outline-none px-2 py-2' readOnly value={form.email} />
                  </div>

                  <div className='flex flex-col gap-1  mt-1'>
                    <label htmlFor="">Password</label>
                    <input type="password" placeholder='Enter Confirm_password' className='border border-[#C0C0C0] rounded-md outline-none px-2 py-2'  name='password' value={form.password} onChange={handleInput} />
                  </div>

                  <div className='w-full mt-1 flex justify-end'>
                    <button className='cursor-pointer w-max h-max'>
                      <div className=' flex items-center justify-between rounded-full'>
                        <div className='text-[#C0C0C0] w-full text-end'>
                          Forget password
                        </div>
                      </div>
                    </button>
                  </div>


                  <div className='w-full mt-5'>
                    <button className='cursor-pointer w-full h-max' type="submit">
                      {
                        isLoading ? <div className='bg-[#4883DF] w-full h-11 flex items-center justify-center rounded-full px-4'>
                          <div className='w-7 h-7 border-l-3 border-b-3 border-t-3 rounded-full border-[#FFFFFF] animate-spin'></div>
                        </div>
                          :
                          <div className='bg-[#4883DF] w-full h-11 flex items-center justify-between rounded-full px-4'>
                            <div className='text-[#FFFFFF] w-full text-center'>
                              Sign Up
                            </div>
                          </div>
                      }

                    </button>
                  </div>
                </form>
          }

          <div className='w-full mt-5 flex justify-center'>
            <button className='cursor-pointer w-max h-max' onClick={() => toSignin()}>
              <div className=' flex items-center justify-between rounded-full'>
                <div className='text-[#C0C0C0] w-full text-end'>
                  Alredy has account? <span className='text-[#4883DF]'>Log In</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup