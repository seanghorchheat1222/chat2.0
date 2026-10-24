import React from 'react'
import { useSelector } from 'react-redux'
import MasterLayout from '../components/layout/MasterLayout'
import { Navigate, Outlet } from 'react-router-dom'


function Auth() {
  const token = useSelector((state) => state.token)

  return (
    <>
      {
        token?.token ? <MasterLayout></MasterLayout> : <Navigate to='/signin'></Navigate>
      }
    </>
  )
}

export default Auth