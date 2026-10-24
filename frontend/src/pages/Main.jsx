import { useNavigate } from 'react-router-dom'
import pre_Profile from '../assets/images/pre-profile.png'
import DotmenuverticalIcon from '../components/ui/DotmenuverticalIcon'
import NotificationIcon from '../components/ui/NotificationIcon'
import PlusIcon from '../components/ui/PlusIcon'
import SearchIcon from '../components/ui/SearchIcon'
import SendIcon from '../components/ui/SendIcon'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { createConversatoin, deleteMessage, getConversationParticipant, getUser, sentMessage, showMessage } from '../services/main'
import echo from '../lib/echo'
import DeleteIcon from '../components/ui/DeleteIcon'
import WaveIcon from '../components/ui/WaveIcon'


function Main() {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const [conversationparticipants, setConversationParticipant] = useState([])
  const [showmessages, setShowMessage] = useState([])
  const bottomRef = useRef(null) // useRef() = used to get acccess the element
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [loadingSidebar, setLoadingSidebar] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState(false)
  const [optionOpen, setOptionOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [users, setUser] = useState([])
  const [alertMessage, setAlertMessage] = useState('')
  const topProfileChat = conversationparticipants.find((conversationparticipant) => conversationparticipant?.conversation_id === selectedConversationId)
  const [triggerWidth, setTriggerWidth] = useState(window.innerWidth);

  const toggleOptionOpen = () => {
    setOptionOpen(!optionOpen)
  }

  useEffect(() => {
    if (conversationparticipants.length === 0) return;

    const channelNames = [
      ...new Set(
        conversationparticipants
          .map((participant) => participant.conversation_id)
          .filter(Boolean)
          .map((id) => `conversation.${id}`)
      ),
    ];

    const channels = channelNames.map((channelName) => {
      const channel = echo.private(channelName);

      channel.subscribed(() => {
        console.log('Subscribed:', channelName);
      });

      channel.error((error) => {
        console.error('Subscription error:', channelName, error);
      });

      channel.listen('MessageSent', (event) => {
        console.log('Received message:', event);

        const newMessage = event.message;

        if (!newMessage) return;

        // Update the open conversation only if this message belongs to it.
        if (
          Number(newMessage.conversation_id) ===
          Number(selectedConversationId)
        ) {
          setShowMessage((prevMessages) => {
            if (prevMessages.some((message) => message.id === newMessage.id)) {
              return prevMessages;
            }

            return [...prevMessages, newMessage];
          });
        }

        // Update the sidebar preview for this conversation.
        setConversationParticipant((prevParticipants) =>
          prevParticipants.map((participant) =>
            Number(participant.conversation_id) ===
              Number(newMessage.conversation_id)
              ? {
                ...participant,
                conversation: {
                  ...participant.conversation,
                  latest_message: newMessage,
                  messages: [newMessage],
                },
              }
              : participant
          )
        );
      });

      return channelName;
    });

    return () => {
      channels.forEach((channelName) => {
        echo.leave(channelName);
      });
    };
  }, [conversationparticipants, selectedConversationId]);


  const toSetting = () => {
    navigate('/setting')
  }

  useEffect(() => {
    fetchConversationParticipant()
  }, [])

  const fetchConversationParticipant = async () => {
    try {
      setLoadingSidebar(true)
      const response = await getConversationParticipant();
      const data = response.data.data;
      setConversationParticipant(data)
      // console.log(data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingSidebar(false)
    }
  }
  
  useEffect(() => {
    const handleResize = () => {
      setTriggerWidth(window.innerWidth) 
    } 
    
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])


  useEffect(() => {
    if(triggerWidth < 768){
        setSelectedConversationId(null)
    }
  }, [triggerWidth])


  const getEachMessage = async (id) => {

    if (triggerWidth < 768) {
      navigate(`/detail/${id}`)
    }

    try {
      setLoadingMessage(true)
      const response = await showMessage(id);
      const data = response.data.data;
      // console.log(data)
      setShowMessage(data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingMessage(false)
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    })
  }, [showmessages])

  const handleSentMessage = async () => {
    try {
      const finalForm = {
        conversation_id: selectedConversationId,
        sender_id: user.id,
        body: textInput,
      }
      await sentMessage(finalForm)

    } catch (err) {
      console.log(err)
    } finally {
      setTextInput('')
    }
  }

  const handleDelete = async () => {
    try {
      const response = await deleteMessage(selectedConversationId)
      if (response.status === 204) {
        fetchConversationParticipant();
        setSelectedConversationId(null)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [search])

  const fetchUser = async () => {
    try {
      setLoadingSidebar(true)
      const response = await getUser(search, user.id);
      const data = response.data.data
      setUser(data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingSidebar(false)
    }
  }

  const handleWare = async (otherId) => {
    try {
      const finalForm = {
        users: [{
          id: otherId
        },
        {
          id: user.id
        }
        ],
        sender_id: user.id,
        body: "Hii"
      }
      const response = await createConversatoin(finalForm)
      if (response.status === 201) {
        setSearchOpen(false);
        fetchConversationParticipant()
        setAlertMessage('')
      }
    } catch (err) {
      console.log(err)
      setAlertMessage(err.response.data.message)
    } finally {

    }
  }

  return (
    <>
      <div className='flex overflow-hidden'>
        <div className='w-full md:w-100 lg:w-130 h-screen flex flex-col'>
          <div className='flex justify-between items-center h-20 border-b border-b-[#C0C0C0] border-r border-r-[#C0C0C0] px-2 md:px-4 bg-[#FFFFFF] sticky top-0 left-0'>
            {
              searchOpen ?
                <>
                  <div className='py-2 h-full w-full flex flex-row items-center gap-2'>
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Seach other user...' className='h-full w-full outline-0 pl-2'></input>
                  </div>
                  <button className='cursor-pointer w-max h-max' type='button' onClick={() => { setSearchOpen(false) }} >
                    <div className='bg-[#F1F1F1] w-11 h-11 flex items-center justify-center rounded-full'>
                      <div className='w-6 h-6'>
                        <SearchIcon className={'fill-[#C0C0C0]'}></SearchIcon>
                      </div>
                    </div>
                  </button>
                </> :
                <>
                  <div className='flex items-center gap-1 lg:gap-2'>
                    <button className='cursor-pointer w-max h-max' onClick={() => toSetting()}>
                      <div className='w-15 h-15 rounded-full shrink-0'>
                        <img src={` ${user?.profile?.profile_img ? `${import.meta.env.VITE_IMAGE_API_URL}${user.profile.profile_img}` : pre_Profile}`} alt="" className='w-full rounded-full h-full object-cover object-top' />
                      </div>
                    </button>

                    <div>
                      <div className='hidden lg:block text-[#C0C0C0] text-[12px]'>
                        Good Morning
                      </div>
                      <div>
                        {user.name}
                      </div>
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <button className='cursor-pointer w-max h-max' >
                      <div className='bg-[#F1F1F1] w-11 h-11 flex items-center justify-center rounded-full'>
                        <div className='w-6 h-6'>
                          <PlusIcon className={'fill-[#C0C0C0]'}></PlusIcon>
                        </div>
                      </div>
                    </button>

                    <button className='cursor-pointer w-max h-max'>
                      <div className='bg-[#F1F1F1] w-11 h-11 flex items-center justify-center rounded-full relative'>
                        <div className='w-6 h-6'>
                          <NotificationIcon className={'fill-[#C0C0C0]'}></NotificationIcon>
                        </div>
                        <div className='w-2 h-2 bg-[#E96A6E] absolute top-0.5 right-0.5 rounded-full '>
                        </div>
                      </div>
                    </button>

                    <button className='cursor-pointer w-max h-max' type='button' onClick={() => { setSearchOpen(true); fetchUser() }} >
                      <div className='bg-[#F1F1F1] w-11 h-11 flex items-center justify-center rounded-full'>
                        <div className='w-6 h-6'>
                          <SearchIcon className={'fill-[#C0C0C0]'}></SearchIcon>
                        </div>
                      </div>
                    </button>
                  </div>
                </>
            }
          </div>

          <div className='px-2 pt-2 pb-2 flex gap-1 flex-col bg-[#FFFFFF] overflow-y-auto h-full flex-1'>
            {
              searchOpen ? <>
                {
                  loadingSidebar ? <div className='h-11 flex items-center justify-center rounded-full w-full mt-2'>
                    <div className='w-7 h-7 border-l-3 border-b-3 border-t-3 rounded-full border-[#4883DF] animate-spin'></div>
                  </div> : <>
                    <div className='text-center text-[#E96A6E]'>
                      {alertMessage !== '' ? alertMessage : ''}
                    </div>
                    {
                      users.map((user) =>
                        <button key={user.id} className='w-full h-max' type='button'>
                          <div className={`flex justify-between w-full flex-row items-center md:px-2 py-1 rounded-xl md:py-2 bg-transparent`}>
                            <div className='flex items-center gap-2'>
                              <div className='w-15 h-15 rounded-full'>
                                <img src={user?.profile?.profile_img ? `${import.meta.env.VITE_IMAGE_API_URL}${user?.profile?.profile_img}` : pre_Profile} alt="" className='w-full h-full rounded-full object-cover object-top' />
                              </div>
                              <div className='flex flex-col items-start'>
                                <div className={`text-[#000000]'}`}>
                                  {user.name}
                                </div>
                              </div>
                            </div>

                            <button className='cursor-pointer w-max h-max' type='button' onClick={() => handleWare(user.id)}>
                              <div className='bg-[#F1F1F1] w-11 h-11 flex items-center justify-center rounded-full relative'>
                                <div className='w-6 h-6'>
                                  <WaveIcon className={'fill-[#DB934B]'}></WaveIcon>
                                </div>
                              </div>
                            </button>
                          </div>
                        </button>
                      )
                    }
                  </>


                }
              </>
                :
                <>
                  {
                    loadingSidebar ?
                      <div className='h-11 flex items-center justify-center rounded-full w-full mt-2'>
                        <div className='w-7 h-7 border-l-3 border-b-3 border-t-3 rounded-full border-[#4883DF] animate-spin'></div>
                      </div> :
                      <>
                        {
                          conversationparticipants.map((conversationparticipant) =>
                            <button disabled={conversationparticipant.conversation_id === selectedConversationId} key={conversationparticipant.id} className='cursor-pointer w-full h-max' type='button' onClick={() => {
                              getEachMessage(conversationparticipant.conversation_id);
                              setSelectedConversationId(conversationparticipant.conversation_id);
                            }}>
                              <div className={`flex justify-between w-full flex-row items-center md:px-2 py-1 rounded-xl md:py-2 ${conversationparticipant.conversation_id === selectedConversationId ? 'bg-[#4883DF]' : 'bg-transparent'}`}>
                                <div className='flex items-center gap-2'>
                                  <div className='w-15 h-15 rounded-full'>
                                    <img src={conversationparticipant?.user?.profile?.profile_img ? `${import.meta.env.VITE_IMAGE_API_URL}${conversationparticipant?.user?.profile?.profile_img}` : pre_Profile} alt="" className='w-full h-full rounded-full object-cover object-top' />
                                  </div>
                                  <div className='flex flex-col items-start'>
                                    <div className={`${conversationparticipant.conversation_id  === selectedConversationId ? 'text-[#FFFFFF]' : 'text-[#000000]'}`}>
                                      {conversationparticipant?.user.name}
                                    </div>
                                    <div className={`text-[12px] ${conversationparticipant.conversation_id  === selectedConversationId ? 'text-[#FFFFFF]' : 'text-[#C0C0C0]'}`}>
                                      {(
                                        conversationparticipant?.conversation?.latest_message ??
                                        conversationparticipant?.conversation?.messages?.[0]
                                      )?.body}

                                    </div>
                                  </div>
                                </div>
                                <div className={`text-[12px] h-max ${conversationparticipant.conversation_id  === selectedConversationId ? 'text-[#FFFFFF]' : 'text-[#000000]'}`}>
                                  {
                                    new Date(conversationparticipant?.conversation?.messages?.[0].created_at).toLocaleTimeString('en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true,
                                      timeZone: 'Asia/Phnom_Penh',
                                    })
                                  }
                                </div>
                              </div>
                            </button>
                          )
                        }
                      </>
                  }

                </>
            }
          </div>

        </div>
        <div className='w-full h-screen  flex-col hidden md:flex'>
          <div className='flex  justify-between items-center h-20 border-b border-b-[#C0C0C0] px-2 md:px-4 bg-[#FFFFFF] w-full sticky top-0 left-0 '>
            <div className='flex items-center gap-2'>
              <div className='w-15 h-15 rounded-full'>
                <img src={
                  topProfileChat?.user?.profile?.profile_img ? `${import.meta.env.VITE_IMAGE_API_URL}${topProfileChat?.user?.profile?.profile_img}` : pre_Profile
                }
                  alt="" className='w-full rounded-full h-full object-cover object-top' />
              </div>
              <div>
                <div>
                  {
                    topProfileChat?.user?.name ? topProfileChat?.user?.name : 'Unknow'
                  }
                </div>
                <div className='text-[#C0C0C0] text-[12px]'>
                  Last seen Yesterday 03:09PM
                </div>
              </div>
            </div>
            <div className='flex gap-2'>

              <button className='cursor-pointer w-max h-max'>
                <div className='bg-[#F1F1F1] w-11 h-11 flex items-center justify-center rounded-full'>
                  <div className='w-6 h-6'>
                    <SearchIcon className={'fill-[#C0C0C0]'}></SearchIcon>
                  </div>
                </div>
              </button>

              <button disabled={selectedConversationId === null} className='cursor-pointer w-11 h-11 relative' onClick={() => toggleOptionOpen()}>
                <div className='bg-[#F1F1F1] w-11 h-11 flex items-center justify-center rounded-full'>
                  <div className='w-6 h-6'>
                    <DotmenuverticalIcon className={'fill-[#C0C0C0]'}></DotmenuverticalIcon>
                  </div>
                </div>
                <div className={`bg-[#FFFFFF] ${optionOpen ? 'block' : 'hidden'} absolute border-2 border-[#C0C0C0] w-max right-0 rounded-full top-[110%]`}>
                  <button className='cursor-pointer w-full h-max flex items-center justify-between flex-row gap-2 px-1 py-1 rounded-full' type='button' onClick={() => handleDelete()}>
                    <div className='text-[#E96A6E] w-max ml-4'>
                      Delete Chat
                    </div>
                    <div className='bg-[#F1F1F1] w-11 h-11 flex items-center justify-center rounded-full'>
                      <div className='w-6 h-6'>
                        <DeleteIcon className={'fill-[#E96A6E]'}></DeleteIcon>
                      </div>
                    </div>
                  </button>
                </div>
              </button>
            </div>
          </div>

          <div className={`bg-[#F1F1F1] flex-1 w-full px-2 md:px-4 overflow-y-auto py-2 flex flex-col gap-2 pb-2`}>
            {
              selectedConversationId === null ?
                <div className='w-full flex justify-center items-center h-full'><div className='w-max h-max font-semibold'>Select the chat!</div></div>
                :
                loadingMessage ?
                  <div className='h-full flex items-center justify-center rounded-full w-full mt-2'>
                    <div className='w-7 h-7 border-l-3 border-b-3 border-t-3 rounded-full border-[#4883DF] animate-spin'></div>
                  </div>
                  :
                  <>
                    {
                      showmessages.map((showmessage) =>
                        user.id !== showmessage.sender_id ?
                          <div key={showmessage.id} className='flex flex-col'>
                            <div className='flex items-center gap-2'>
                              <div className='w-12 h-12 rounded-full'>
                                <img src={showmessage?.user?.profile?.profile_img ? `${import.meta.env.VITE_IMAGE_API_URL}${showmessage?.user?.profile?.profile_img}` : pre_Profile} alt="" className='w-full rounded-full h-full object-cover object-top' />
                              </div>
                              <div>
                                <div>
                                  {showmessage.user.name}
                                </div>
                                <div className='text-[#C0C0C0] text-[12px]'>
                                  {new Date(showmessage.created_at).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                    timeZone: 'Asia/Phnom_Penh',
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className='bg-[#FFFFFf] w-auto md:w-max h-max px-5 py-4 rounded-bl-full rounded-r-full mt-1.5'>
                              {showmessage.body}
                            </div>
                          </div> :
                          <div className='flex flex-col items-end w-full'>
                            <div className='flex flex-row-reverse items-center gap-2'>
                              <div className='w-12 h-12 rounded-full'>
                                <img src={` ${user?.profile?.profile_img ? `${import.meta.env.VITE_IMAGE_API_URL}${user.profile.profile_img}` : pre_Profile}`} alt="" className='w-full rounded-full h-full object-cover object-top' />
                              </div>
                              <div>
                                <div className='text-end'>
                                  You
                                </div>
                                <div className='text-[#C0C0C0] text-[12px]'>
                                  {new Date(showmessage.created_at).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                    timeZone: 'Asia/Phnom_Penh',
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className='bg-[#4883DF] w-auto md:w-max h-max px-5 py-4 rounded-br-full rounded-l-full mt-1.5 text-[#FFFFFF]'>
                              {showmessage.body}
                            </div>
                          </div>
                      )
                    }
                  </>


            }
            <div ref={bottomRef}></div>
          </div>


          <div className='px-2 h-17 bg-[#F1F1F1] pb-2'>
            <div className='bg-[#FFFFFF] px-2 py-2 rounded-full flex flex-row  w-full h-full items-center'>
              <button className='cursor-pointer w-max h-max'>
                <div className='bg-[#F1F1F1] w-11 h-11 flex items-center justify-center rounded-full'>
                  <div className='w-6 h-6'>
                    <PlusIcon className={'fill-[#C0C0C0]'}></PlusIcon>
                  </div>
                </div>
              </button>
              <div className='w-1 h-full rounded-full bg-[#F1F1F1] mx-7 hidden md:block'>

              </div>
              <div className='w-full'>
                <input value={textInput} disabled={selectedConversationId === null} className='h-full w-full outline-none' type="text" placeholder={selectedConversationId === null ? 'Input field disabled.....' : 'Type Your Message Here ...'} onChange={(e) => setTextInput(e.target.value)} />
              </div>

              <button className='cursor-pointer w-max h-max' type='button' onClick={() => handleSentMessage()} disabled={selectedConversationId === null}>
                <div className='bg-[#4883DF] w-11 h-11 flex items-center justify-center rounded-full'>
                  <div className='w-6 h-6'>
                    <SendIcon className={'fill-[#FFFFFF]'}></SendIcon>
                  </div>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Main