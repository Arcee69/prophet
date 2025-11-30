import React from 'react'
import { useNavigate } from 'react-router-dom'

const Submodal = ({ handleClose }) => {

    const navigate  = useNavigate()

  return (
    <div className="bg-white w-full max-w-[350px] mx-auto mt-8 h-[180px] flex flex-col gap-10 rounded-lg p-4 shadow-lg overflow-hidden">
        <p className='font-jost text-lg text-[#374151]'>
            Kindly go to <span className='font-medium hover:underline cursor-pointer' onClick={() => navigate("/settings")}>Settings</span> and Subscribe to any of our plans to access this page
        </p>

        <div className="flex justify-end space-x-4">
            <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 text-[#374151] rounded hover:bg-gray-50"
            >
                Cancel
            </button>
        </div>
    </div>
  )
}

export default Submodal