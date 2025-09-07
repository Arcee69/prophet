import React from 'react';
import { FaCheck } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Helper function to parse features HTML into title and list
const parseFeatures = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  
  // Extract featuresTitle from the first <p><strong><em>...</em></strong></p>
  const featuresTitleElement = doc.querySelector('p strong em');
  const featuresTitle = featuresTitleElement ? featuresTitleElement.textContent.trim() : '';
  
  // Extract features from <ol><li>...</li></ol> (or adjust selector if it changes to <ul>)
  const featuresElements = doc.querySelectorAll('ol li');
  const features = Array.from(featuresElements).map(li => li.textContent.trim());
  
  return { featuresTitle, features };
};

const Monthly = () => {

  const { pricing } = useSelector((state) => state.allPricing);

  const navigate = useNavigate()

  // Transform pricing data to match the expected structure
  const monthlyPlans = pricing.data?.map(plan => {
    const { featuresTitle, features } = parseFeatures(plan.features);
    return {
      title: plan.name,
      price: parseFloat(plan.monthly_amount), // Convert string to number
      target: plan.intended_users || '', // Fallback to empty if null; update with real data if available
      featuresTitle,
      features,
    };
  });

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 px-[32px]'>
      {monthlyPlans?.map((item, index) => (
        <div key={index} className='p-[32px] flex flex-col gap-[32px] rounded-2xl shadow'>
          <div className='flex flex-col gap-4'>
            <p className='font-jost font-medium text-[18px] leading-7 text-GREY-_500'>{item.title}</p>
            <p className='text-GREY-_900 font-jost text-[60px] leading-[72px] font-medium'>${item.price} <span className='text-GREY-_500 font-jost text-base font-medium leading-6'>per month</span></p>
            <p className='text-GREY-_500 font-jost text-base leading-6'>{item.target}</p>
          </div>
          <div className='flex flex-col gap-3'>
            <button onClick={() => {navigate("/register"), window.scrollTo(0,0)}} className='bg-[#202633] rounded-lg flex items-center justify-center p-3'>
              <p className='text-white font-jost text-base leading-6 font-medium'>Get Started</p>
            </button>
            <button onClick={() => {navigate("/contact"), window.scrollTo(0,0)}} className='border border-GREY-_400 bg-white rounded-lg flex items-center justify-center p-3'>
              <p className='text-GREY-_700 font-jost text-base leading-6 font-medium'>Chat with sales</p>
            </button>
          </div>
          <div className='bg-GREY-_400 h-[1px] w-full'></div>
          <div className='flex flex-col gap-6'>
            <div className='flex flex-col gap-2'>
              <p className='text-GREY-_900 font-jost font-semibold italic text-base leading-6'>FEATURES</p>
              <p className='text-GREY-_500 italic font-jost font-semibold text-base leading-6'>{item.featuresTitle}</p>
            </div>
            <div className='flex flex-col gap-4'>
              {item.features?.map((feature, idx) => (
                <div key={idx} className='flex items-center gap-3'>
                  <div className='w-6 h-6 bg-[#FFFAEB] flex flex-col items-center justify-center rounded-full'>
                    <FaCheck className='text-[#202633] w-4 h-4' />
                  </div>
                  <p className='text-GREY-_500 text-base font-jost leading-6'>{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Monthly;