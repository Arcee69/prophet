import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const ViewBlogPost = () => {
    const [loading, setLoading] = useState(false)
    const [blogPost, setBlogPost] = useState([])
    
    const { slug } = useParams()
    const { state } = useLocation()

    let URL = import.meta.env.VITE_APP_API_URL;

    const navigate = useNavigate()

    const fetchPost = async (url = `${URL}/v1/post/slug/${slug}`) => {
        setLoading(true)
        try {
            const res = await axios.get(url);
            const data = res.data;
    
          setBlogPost(data?.data || []);
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPost()
    }, [state, slug])

  return (
    <div className='w-full flex flex-col items-start gap-5 pt-[186px] pb-[49px] px-5 lg:px-[112px]'>
        <button onClick={() => {navigate('/blogs'), window.scrollTo(0, 0)}} className='bg-[#000] w-[100px] flex items-center justify-center h-[44px] rounded-lg'>
            <p className='text-[#fff] font-inter text-lg'>Back</p>
        </button>
        {
            loading ? 
            <div className='flex items-center justify-center mt-5 w-6/12 mx-auto'>
                <p className='text-4xl font-inter text-center text-[#101828]'>Loading...</p>
            </div> 
            :
            <div className='flex flex-col  items-start gap-[64px]'>
                <p className='font-hanken font-semibold text-[#101828] text-[32px] lg:text-[48px] leading-[44px] lg:leading-[60px]'>{blogPost.title}</p>
                <div className='flex flex-col gap-[32px] items-start  w-full'>
                    <img src={blogPost.image} className='lg:h-[516px]' alt='PostImage'/>
                    <div className='flex flex-col gap-3'>
                        <p className='text-[#7F56D9] font-inter font-semibold text-[14px]'>Published On</p>
                        <p className='text-[#101828] text-[18px] font-medium'>{new Date(blogPost.created_at).toDateString()}</p> 
                    </div>
                </div>
                <div className='w-full'> {/*w-[46.875rem] mx-auto */}
                    <p dangerouslySetInnerHTML={{ __html: blogPost.body }} /> 
                </div>
        
            </div>
        }
    </div>
  )
}

export default ViewBlogPost