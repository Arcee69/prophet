import React from 'react';
import { Outlet } from 'react-router-dom';

import Spiral from "../../assets/png/spiral.png";

const AuthPageLayout = () => {
  return (
    <div className="w-full h-[125vh] bg-[#F2F2F2] flex items-center justify-center relative">
      <img src={Spiral} alt="Spiral" className="absolute left-10 w-[350px]" />
      <div className="bg-white w-[400px] px-6 py-8 my-10 rounded-lg shadow-md z-10">
        <Outlet />
      </div>
      <img src={Spiral} alt="Spiral" className="absolute right-10 w-[350px]" />
    </div>
  );
};

export default AuthPageLayout;
