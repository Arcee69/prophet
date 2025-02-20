import React from 'react'
import { Navigate, useLocation, Outlet  } from 'react-router-dom';
import Cookies from "js-cookie"

import { isObjectEmpty } from '../utils/CheckLoginData';
import DashboardLayout from '../layouts/DashboardLayout';
import AuthPageLayout from '../layouts/AuthPageLayout';



export const ProtectRoutes = () => {



    const location = useLocation();
    const isAuthed = isObjectEmpty((Cookies.get("userProps")))
    return !isAuthed ? (
      <DashboardLayout> 
        <Outlet />
      </DashboardLayout>
    ) : (
      <Navigate to="/" state={{ from: location }} replace />
    );
  };

  export const AuthProtectRoutes = () => {
    const location = useLocation();
    const isAuthed =  isObjectEmpty((Cookies.get("userProps")))
    return isAuthed ? (
      <AuthPageLayout>
        <Outlet />
      </AuthPageLayout>
    ) : (
      <Navigate to="/dashboard" state={{ from: location }} replace />
    );
  };