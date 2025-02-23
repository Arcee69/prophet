import React, { useState, useEffect } from 'react';
import Vapi from '@vapi-ai/web';

import Microphone from "../../assets/png/microphone.png"
import InactiveMic from "../../assets/png/inactive_mic.png"
import Voice from "../../assets/png/voice_ai.png"

const Ara = () => {
  const [callStatus, setCallStatus] = useState('inactive');
  const [voxData, setVoxData] = useState([]);
  const [loading, setLoading] = useState(false);

  const vapi = new Vapi("f3cfd9f4-c893-43f1-b47f-6b1b2c3b1669"); // Public key

  const start = async () => {
    setCallStatus('loading');
    setLoading(true);
    try {
        const response = await vapi.start('bccab05a-74e0-45dd-aee6-954071a77fa7'); // Assistant ID
        setVoxData(response);
        console.log(response.status, 'brymo');
        return response;

    } catch (err) {
        console.log(err, "err")
        setCallStatus('inactive')
    } finally {
        setLoading(false);
    }
  };

  const stop = () => {
    console.log('stop');
    setCallStatus('loading');
    vapi.stop();
  };

  console.log(callStatus, "callStatus")
  console.log(voxData, "voxData")

  useEffect(() => {
    vapi.on('call-start', () => setCallStatus('active'));
    vapi.on('call-end', () => setCallStatus('inactive'));

    return () => vapi.removeAllListeners();
  }, []);

  // Decide what text to show based on call status
  const statusText = (() => {
    if (callStatus === 'loading') return 'Starting...';
    if (callStatus === 'active') return 'Ara is listening...';
    return 'Ara is not active';
  })();

  // If call is active, clicking the mic stops it; otherwise it starts.
  const handleMicClick = () => {
    if (callStatus === 'active') {
      stop();
    } else if (callStatus === 'inactive') {
      start();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      {/* Header Text */}
        <h1 
            className="text-[48px] font-semibold font-jost leading-[46px]"
            style={{ 
                backgroundImage: 'linear-gradient(90deg, #EC6124, #FBBC05, #8E0615)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block'
            }}
        >
            Hi there, Shola
        </h1>

      {/* Gradient Subheading */}
        <h2 className="text-[48px] font-semibold font-jost leading-[46px] mb-6">
            <span style={{ 
                backgroundImage: 'linear-gradient(90deg, #EC6124, #FBBC05, #8E0615)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block'
            }}
            >
                What would you like to do
            </span>
        </h2>

      {/* Subtext */}
      <p className="text-center text-[#758299] font-lato mb-8 max-w-xl px-4">
        Get real-time insights, sentiment analysis, and media monitoring
        with our AI-powered PR assistant
      </p>

      {/* Status Text */}
      <div className='flex flex-col gap-3'>
        <img src={Voice} alt='Voice' className='w-[150px] h-[150px] animate-pulse' />
        <div className="mb-4">
            <p
            className={`text-base font-semibold text-center font-lato ${
                callStatus === 'active' ? 'text-[#5BDC93]' : 'text-[#4B5563]'
            }`}
            >
            {statusText}
            </p>
        </div>
      </div>

      {/* Microphone Icon */}
      <div
        onClick={handleMicClick}
        className={`
          w-20 h-20 bg-center bg-no-repeat bg-cover mt-[52px] cursor-pointer 
          ${callStatus === 'active' ? 'animate-pulse' : ''}
        `}
        style={{ backgroundImage: `url(${Microphone})` }}
      />

      {/* Footer Disclaimer */}
      <p className="text-xs text-[#4B5563] font-lato font-semibold mt-8">
        AI can make mistakes. Please double-check responses.
      </p>
    </div>
  );
};

export default Ara;
