import React from 'react'
import { Route, Routes } from "react-router-dom";

import { AuthProtectRoutes, ProtectRoutes } from './ProtectRoute';
import Home from '../pages/Home';
import HomePageLayout from '../layouts/HomePageLayout';
import Login from '../pages/Auth/Login';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import VerifyOtp from '../pages/Auth/VerifyOtp';
import ResetPassword from '../pages/Auth/ResetPassword';
import Register from '../pages/Auth/Register';
import Dashboard from '../pages/Dashboard';
import DashboardLayout from '../layouts/DashboardLayout';
import AuthPageLayout from '../layouts/AuthPageLayout';

export default function Routers() {

  return (
    <div>
      <Routes>

        <Route element={<HomePageLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<AuthPageLayout />}>
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/verify-otp' element={<VerifyOtp />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/register' element={<Register />} />
        </Route>
        
         <Route element={<DashboardLayout />}>
            <Route path='/dashboard' element={<Dashboard />} />
        </Route>

    

       

      

      </Routes>
    </div>
  )
}
