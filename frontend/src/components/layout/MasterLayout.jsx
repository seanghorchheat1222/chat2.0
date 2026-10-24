import React from 'react'
import { Outlet } from 'react-router-dom'

function MasterLayout() {
  return (
    <>
     <main>
      <Outlet></Outlet>
     </main>
    </>
  )
}

export default MasterLayout