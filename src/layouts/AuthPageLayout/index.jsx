import React from 'react'
import { Outlet } from 'react-router-dom'

const AuthPageLayout = () => {
  return (
    <div className='overflow-x-hidden w-full'>
        <Outlet />
    </div>
  )
}

export default AuthPageLayout