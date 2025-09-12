import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnsupportedDevice = () => {

    const navigate = useNavigate()

    return (
        <div style={{
            padding: '20px',
       
            display: "flex",
            gap: "4px",
            flexDirection: "column",
            justifyItems: "center",
            justifyContent: "center",
            height: "100vh"
        }}
        >
            <h2 className='text-center'>Mobile/Tablet Access Limited</h2>
            <p className='text-center'>This application is best experienced on a laptop or desktop device.</p>
            <p className='text-center'>Please switch to a laptop or desktop computer for full functionality.</p>
            <button onClick={() => { navigate("/"), window.scrollTo(0, 0) }} className='w-full group hover:bg-[#F48A1F] rounded-[8px] mt-5 h-[45px] flex items-center bg-[#202633] p-2 justify-center'>
                <p className='font-jost text-[#fff] font-semibold text-base leading-[23px]'>Back to Home</p>
            </button>
        </div>
    );
};

export default UnsupportedDevice;