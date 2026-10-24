import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { clearUser } from "../store/userSlice";
import { currentUser } from "../services/session";
import { clearToken } from "../store/tokenSlice";


function Session({children}) {
  const dispatch = useDispatch();

  useEffect(() => {
    checkSession() 
  }, [dispatch])

  const checkSession = async () => {
    try{
      await currentUser()
    }catch(err){
      if(err.response?.status === 401 || err.response?.status === 403){
        dispatch(clearUser())
        dispatch(clearToken())
      }else{
        console.log("Session check failed!", err)
      }
    }
  }

  return children
}

export default Session