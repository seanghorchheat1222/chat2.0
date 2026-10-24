import { useEffect, useRef, useState } from 'react'
import pre_Profile from '../assets/images/pre-profile.png'
import DotmenuverticalIcon from '../components/ui/DotmenuverticalIcon'
import PlusIcon from '../components/ui/PlusIcon'
import SearchIcon from '../components/ui/SearchIcon'
import SendIcon from '../components/ui/SendIcon'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteMessage, getConversationParticipant, sentMessage, showMessage } from '../services/detail'
import DeleteIcon from '../components/ui/DeleteIcon'
import { useSelector } from 'react-redux'
import echo from '../lib/echo'

function Detail() {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const { id } = useParams(); // this already get as a string, id to integer to type-casting
  const [conversationparticipants, setConversationParticipant] = useState([])
  const [showmessages, setShowMessage] = useState([])
  const bottomRef = useRef(null) // useRef() = used to get acccess the element
  const [selectedConversationId, setSelectedConversationId] = useState(id);
  const [textInput, setTextInput] = useState('');
  const [loadingMessage, setLoadingMessage] = useState(false)
  const [optionOpen, setOptionOpen] = useState(false)
  const topProfileChat = conversationparticipants.find((conversationparticipant) => conversationparticipant?.conversation_id === Number(id))


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



  useEffect(() => {
    getEachMessage()
  }, [])

  const getEachMessage = async () => {
    try {
      setLoadingMessage(true)
      const response = await showMessage(id);
      const responseConversationParticipant = await getConversationParticipant();
      const data = response.data.data;
      const dataConversationParticipant = responseConversationParticipant.data.data;
      setShowMessage(data)
      setConversationParticipant(dataConversationParticipant)
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
        setSelectedConversationId(null)
        navigate('/')
      }
    } catch (err) {
      console.log(err)
    }
  }



  return (
    <>
      <div className='w-full h-screen  flex-col flex'>
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
                          <div className='bg-[#FFFFFf] w-fit h-max px-5 py-4 rounded-bl-full rounded-r-full mt-1.5'>
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
                          <div className='bg-[#4883DF] w-fit md:w-max h-max px-5 py-4 rounded-br-full rounded-l-full mt-1.5 text-[#FFFFFF]'>
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
    </>
  )
}

export default Detail