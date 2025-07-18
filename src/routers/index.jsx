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
import Ara from '../pages/Ara';
import Sentiment from '../pages/Sentiment';
import Brandwatch from '../pages/Brandwatch';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import Help from '../pages/Help';

export default function Routers() {

  return (
    <div>
      <Routes>

        <Route element={<HomePageLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<AuthProtectRoutes />}>
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/verify-otp' element={<VerifyOtp />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/register' element={<Register />} />
        </Route>
        
         <Route element={<ProtectRoutes />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/ara' element={<Ara />} />
            <Route path="/sentiment-analysis" element={<Sentiment />} />
            <Route path="/brandwatch" element={<Brandwatch/>} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
        </Route>

    

       

      

      </Routes>
    </div>
  )
}
