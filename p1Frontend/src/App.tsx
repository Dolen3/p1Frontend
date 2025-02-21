import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login } from './Components/LoginRegister/Login'
import 'bootstrap/dist/css/bootstrap.css'
import { Register } from './Components/LoginRegister/Register'
import { Dashboard } from './Components/Dashboard'
import { CreateReimbursement } from './Components/CreateReimbursement'
import { ReimbursementList } from './Components/ReimbursementList'
import { ReimbursementListByUserId } from './Components/ReimbursementListByUserId'

function App() {

  return (
    <>
      
      <BrowserRouter>
        <Routes>
          {/* empty string or / for path makes the component render at startup */}
          <Route path="" element={<Login/>}/>
          <Route path="register" element={<Register/>}/>
          <Route path="dashboard" element={<Dashboard/>}/>
          <Route path="createReimbursement" element={<CreateReimbursement/>}/>
          <Route path="reimbursements/:userId" element={<ReimbursementListByUserId />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App