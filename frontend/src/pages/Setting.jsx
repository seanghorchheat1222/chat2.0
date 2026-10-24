import React, { useState } from 'react'
import pre_banner from '../assets/images/pre-banner.png'
import pre_Profile from '../assets/images/pre-profile.png'
import { useNavigate } from 'react-router-dom'
import BackArrowIcon from '../components/ui/BackArrowIcon'
import { useDispatch, useSelector } from 'react-redux'
import { currentUser, setProfile, signOut } from '../services/setting'
import { clearToken } from '../store/tokenSlice'
import { clearUser, setUser } from '../store/userSlice'

function Setting() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token)
  const user = useSelector((state) => state.user)
  const [isLoading, setIsLoading] = useState(false);
  const [bannerInput, setBannerInput] = useState(null)
  const [bannerPreview, setBannerPreview] = useState('')
  const [profileInput, setProfileInput] = useState(null);
  const [profilePreview, setProfilePreview] = useState('')
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    date_birth: '',
    address: ''
  })

  const toMain = () => {
    navigate('/')
  }

  const toggleEdit = () => {
    setIsEdit(!isEdit)
  }

  const handleBannerInput = (e) => {
    const file = e.target.files[0] ?? null;
    setBannerInput(file)
    setBannerPreview(file ? URL.createObjectURL(file) : '')
  }

  const handleProfileInput = (e) => {
    const file = e.target.files[0] ?? null;
    setProfileInput(file);
    setProfilePreview(file ? URL.createObjectURL(file) : '')
  }

  const handleInput = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form, [name]: value
    })
  }

  const onLogout = async () => {
    try {
      setIsLoading(true)
      const response = await signOut(token.token);
      if (response.status === 204) {
        dispatch(clearToken())
        dispatch(clearUser())
        navigate('/')
      }
    } catch (err) {
      console.lop(err)
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleSubmitProfile = async () => {
    try {
      setIsLoading(true)
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("date_birth", form.date_birth);
      formData.append("address", form.address);
      if (profileInput) {
        formData.append("profile_img", profileInput);
      }
      if (bannerInput) {
        formData.append("profile_banner", bannerInput)
      }

      const response = await setProfile(formData)
      if (response.status === 200 || response.status === 201) {
        const response = await currentUser();
        const data = await response.data.data
        dispatch(setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          profile: data.profile
        }))
      }
    } catch (err) {
      console.log(err);
      console.log(err.response.data.message)
    }
    finally {
      setIsLoading(false)
      setIsEdit(false)
    }
  }


  return (
    <>
      <div className='pb-2 relative'>
        <div className="h-[65vh] w-full relative">
          {
            bannerInput ? <img src={bannerPreview} className='w-full h-full object-cover' alt="" /> : <img src={user?.profile?.profile_banner ? `${import.meta.env.VITE_IMAGE_API_URL}${user.profile.profile_banner}` : pre_banner} className='w-full h-full object-cover' alt="" />
          }
          <input type="file" onChange={handleBannerInput} className={`absolute top-[50%] left-[50%] translate-[-50%] border border-[#C0C0C0] py-2 rounded-md cursor-pointer px-2 text-[#FFFFFF] ${isEdit ? 'block' : 'hidden'}`} />
        </div>
        <div className='px-2 lg:px-4'>
          <div className='flex items-center justify-center md:justify-between'>
            <div className='border-10 border-[#FFFFFF] rounded-full -mt-[55px] relative'>
              <div className='w-45 h-45 rounded-full'>
                {
                  profilePreview ? <img src={profilePreview} className='w-full h-full object-cover rounded-full' alt="" /> : <img src={user?.profile?.profile_img ? `${import.meta.env.VITE_IMAGE_API_URL}${user.profile.profile_img}` : pre_Profile} alt="" className='w-full h-full object-cover object-top rounded-full' />
                }

              </div>
              <input type="file" onChange={handleProfileInput} className={`absolute top-[50%] left-[50%] translate-[-50%] border border-[#C0C0C0] py-2 rounded-md cursor-pointer px-2 text-[#FFFFFF] ${isEdit ? 'block' : 'hidden'} w-23`} />
            </div>

            {
              isEdit ?
                <div className='md:flex gap-2 hidden'>
                  <button className='border border-[#C0C0C0] px-5 py-2 rounded-md cursor-pointer' onClick={() => toggleEdit()}>Cancel</button>
                  <button className=' bg-[#4883DF] px-5 py-2 rounded-md cursor-pointer text-[#FFFFFF]' onClick={() => handleSubmitProfile()}>
                    {
                      isLoading ?
                        <div className='flex items-center justify-center rounded-full px-4 '>
                          <div className='w-4 h-4 border-l-3 border-b-3 border-t-3 rounded-full border-[#FFFFFF] animate-spin'></div>
                        </div> : 'Update'
                    }

                  </button>
                </div>
                :
                <div className='md:flex gap-2 hidden'>
                  <button className=' bg-[#4883DF] px-5 py-2 rounded-md cursor-pointer text-[#FFFFFF]' onClick={() => toggleEdit()}>
                    Edit
                  </button>
                </div>
            }


          </div>
        </div>
        <div className='px-2 lg:px-4'>
          <div className='font-semibold'>
            My Details
          </div>
          <div className='mt-5'>
            <div className='flex flex-col gap-1 mt-1'>
              <label htmlFor="">Username</label>
              <input type="text" readOnly value={user.name} className='border border-[#C0C0C0] rounded-md outline-none px-2 py-2' />
            </div>

            <div className='flex flex-col gap-1 mt-1'>
              <label htmlFor="">Email</label>
              <input type="text" readOnly value={user.email} className='border border-[#C0C0C0] rounded-md outline-none px-2 py-2' />
            </div>

            <div className='flex flex-col gap-1  mt-1'>
              <label htmlFor="">Date_Birth</label>
              <input type="date" readOnly={!isEdit} value={isEdit ? form.date_birth : user?.profile?.date_birth} name='date_birth' className='border border-[#C0C0C0] rounded-md outline-none px-2 py-2' required onChange={handleInput} />
            </div>

            <div className='flex flex-col gap-1  mt-1'>
              <label htmlFor="">Address</label>
              <textarea type="text" readOnly={!isEdit} value={isEdit ? form.address : user?.profile?.address} name='address' className='border h-20 border-[#C0C0C0] rounded-md outline-none px-2 py-2' onChange={handleInput} required></textarea>
            </div>
          </div>

          <div className='flex gap-2 md:hidden mt-2 justify-end'>
            <button className='border border-[#C0C0C0] px-5 py-2 rounded-md cursor-pointer'>Cancel</button>
            <button className=' bg-[#4883DF] px-5 py-2 rounded-md cursor-pointer text-[#FFFFFF]'>Save</button>
          </div>

          <div className='flex gap-2 md:hidden mt-2 justify-end'>
            <button className='cursor-pointer w-max h-max'>
              <div className='bg-[#E96A6E] w-30 h-11 flex items-center justify-between rounded-full px-4'>
                <div className='w-6 h-6'>
                  <BackArrowIcon className={'fill-[#FFFFFF]'}></BackArrowIcon>
                </div>
                <div className='text-[#FFFFFF]'>
                  Singout
                </div>
              </div>
            </button>
          </div>

          <div className=' mt-2 md:flex justify-end hidden '>
            <button className='cursor-pointer w-max h-max' onClick={() => onLogout()}>
              {
                isLoading ?
                  <div className='bg-[#E96A6E] h-11 flex items-center justify-center rounded-full px-4 w-30'>
                    <div className='w-7 h-7 border-l-3 border-b-3 border-t-3 rounded-full border-[#FFFFFF] animate-spin'></div>
                  </div>
                  :
                  <div className='bg-[#E96A6E] w-30 h-11 flex items-center justify-between rounded-full px-4'>
                    <div className='w-6 h-6'>
                      <BackArrowIcon className={'fill-[#FFFFFF]'}></BackArrowIcon>
                    </div>
                    <div className='text-[#FFFFFF]'>
                      Singout
                    </div>
                  </div>
              }
            </button>
          </div>
        </div>

        <button className='cursor-pointer w-max h-max absolute top-2 left-2 hidden md:block' onClick={() => toMain()}>
          <div className='bg-[#F1F1F1] w-11 h-11 flex items-center justify-center rounded-full'>
            <div className='w-6 h-6'>
              <BackArrowIcon className={'fill-[#C0C0C0]'}></BackArrowIcon>
            </div>
          </div>
        </button>
      </div>
    </>
  )
}

export default Setting