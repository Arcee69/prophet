import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { CgSpinner } from 'react-icons/cg';

import { useNavigate } from 'react-router-dom';

import LogoBlack from '../../assets/svg/logo_black.svg';
import { api } from '../../services/api';
import { appUrls } from '../../services/urls';
import { toast } from 'react-toastify';


const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const formValidationSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
  });

  const submitForm = async (values, action) => {
      setLoading(true);
      const data = {
        "email": values?.email,
      }
      try {
        const res = await api.post(appUrls?.FORGOTPASSWORD_URL, data)
        console.log(res, "appo")
        toast(`${res?.data?.message}`, {
          position: "top-right",
          autoClose: 5000,
          closeOnClick: true,
        })  
        navigate("/verify-otp");
        localStorage.setItem("email", values?.email)
      } catch (err) {
        console.log(err, "eyes")
        toast(`${err?.data?.message}`, {
          position: "top-right",
          autoClose: 5000,
          closeOnClick: true,
        })  
      } finally {
        setLoading(false)
      }
    }

  return (
    <div className="flex flex-col items-center gap-6">
        <img src={LogoBlack} alt="Logo" className="w-32" />
        <div className='flex flex-col items-center'>
            <p className="text-[30px] leading-[39px] font-jost font-semibold">Forgot Password?</p>
            <p className='font-jost text-[#000000] text-center text-base leading-5'>
                Enter your email address, and we’ll send you a link to reset your password.
            </p>
        </div>

        <Formik
            initialValues={{ email: '' }}
            validationSchema={formValidationSchema}
            onSubmit={(values) => {
                submitForm(values);
            }}
        >
            {({ handleSubmit, handleChange, values, errors, touched }) => (
            <Form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">

                                {/* Email Input */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-jost font-medium">Email</label>
                    <input
                        name="email"
                        type="text"
                        placeholder="Your Work email"
                        value={values.email}
                        onChange={handleChange}
                        className="border rounded-lg px-3 py-2 h-[48px] outline-none "
                    />
                    {errors.email && touched.email && <div className="text-RED-_100 text-xs">{errors.email}</div>}
                </div>


                <button
                    type="submit"
                    className="bg-black text-white w-full py-3 rounded-lg font-medium flex justify-center"
                >
                    {loading ? <CgSpinner className="animate-spin text-lg" /> : 'Send Reset Code'}
                </button>

                <p className='text-[#000000] font-jost text-base text-center'>
                    Remember your password? <span className='text-[#C89657] font-bold cursor-pointer' onClick={() => {navigate("/login"); window.scrollTo(0, 0)}}>Log in</span>
                </p>

                
            </Form>
            )}
        </Formik>
    </div>
  );
};

export default ForgotPassword;
