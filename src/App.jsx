import { useState } from 'react'
import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Concerts from './components/Concerts'
import CreateConcert from './components/CreateConcert'
import UpdateConcert from './components/UpdateConcert'
import LogInPage from './components/LogInPage'
import SignUpPage from './components/SignUpPage'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogInPage/>}></Route>
          <Route path="/signup" element={<SignUpPage/>}></Route>
          <Route path="/concerts" element={<Concerts/>}></Route>
          <Route path="/create" element={<CreateConcert/>}></Route>
          <Route path="/update/:id" element={<UpdateConcert/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
