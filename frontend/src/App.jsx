import { useEffect, useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Main from './pages/Main'
import Detail from './pages/Detail'
import MasterLayout from './components/layout/MasterLayout'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Setting from './pages/Setting'
import Auth from './auth/Auth'
import NotFound from './404/NotFound'

function App() {

  useEffect(() => {
    scrollTo(0, 0)
  })

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Auth></Auth>}>
            <Route element={<MasterLayout></MasterLayout>}>
              <Route path='/' element={<Main></Main>}></Route>
              <Route path='/setting' element={<Setting></Setting>}></Route>
              <Route path='/detail/:id' element={<Detail></Detail>}></Route>
            </Route>
          </Route>

          <Route path='/signin' element={<Signin></Signin>}></Route>
          <Route path='/signup' element={<Signup></Signup>}></Route>

          <Route path="*" element={<NotFound></NotFound>}></Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
