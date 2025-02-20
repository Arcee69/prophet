import React from 'react'
import { Route, Routes } from "react-router-dom";

import { AuthProtectRoutes, ProtectRoutes } from './ProtectRoute';
import Home from '../pages/Home';
import HomePageLayout from '../layouts/HomePageLayout';



export default function Routers() {

  return (
    <div>
      <Routes>

        <Route element={<HomePageLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* <Route element={<AuthProtectRoutes />}>
     
        </Route>
        
        <Route element={<ProtectRoutes />}>

        </Route> */}

    

       

      

      </Routes>
    </div>
  )
}
