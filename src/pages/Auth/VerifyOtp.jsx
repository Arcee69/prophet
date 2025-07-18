import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { CgSpinner } from 'react-icons/cg';

import { useNavigate } from 'react-router-dom';

import LogoBlack from '../../assets/svg/logo_black.svg';
import { api } from '../../services/api';
import { appUrls } from '../../services/urls';
import { toast } from 'react-toastify';


const VerifyOtp = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const formValidationSchema = Yup.object().shape({
    otp: Yup.string().required('Otp is required'),
  });

  const reg = localStorage.getItem("register")
  const email = localStorage.getItem("email")

  const submitForm = async (values, action) => {
    setLoading(true)
  
    try {  
        if (reg) {
            const data = {
                "verification_code": values?.otp
            }
            const res  = await api.post(appUrls?.VERIFY_USER_OTP_URL, data)
            console.log(res, "mix")
            toast(`${res?.data?.message}`, {
                position: "top-right",
                autoClose: 5000,
                closeOnClick: true,
            })
            navigate("/login")
            localStorage.removeItem("register")
            localStorage.removeItem("email")
        } else {
            const data = {
                "otp": values?.otp
            }
            const res  = await api.post(appUrls?.VERIFY_RESET_OTP_URL, data)
            console.log(res, "mix")
            localStorage.setItem("userId", res?.data?.data?.user_id)
            toast(`${res?.data?.message}`, {
                position: "top-right",
                autoClose: 5000,
                closeOnClick: true,
            })
            navigate("/reset-password");
            localStorage.removeItem("email")
        }
    } catch (err) {
        console.log(err, "err")
        toast(`${err?.data?.message}`, {
            position: "top-right",
            autoClose: 5000,
            closeOnClick: true,
        })  
    } finally {
        setLoading(false)
    }
  }

  const resendCode = async () => {
    const data = {
        "email": email
    }
    try {
        const res  = await api.post(appUrls?.RESEND_OTP_URL, data)
        console.log(res, "mix")
        toast(`${res?.data?.message}`, {
            position: "top-right",
            autoClose: 5000,
            closeOnClick: true,
        })  
    } catch (err) {
        console.log(err, "err")
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
            <p className="text-[30px] leading-[39px] font-jost font-semibold">Verify Otp?</p>
            <p className='font-jost text-[#000000] text-center text-base leading-5'>
                Enter otp code sent to your email address
            </p>
        </div>

        <Formik
            initialValues={{ otp: '' }}
            validationSchema={formValidationSchema}
            onSubmit={(values, action) => {
                submitForm(values, action)
            }}
        >
            {({ handleSubmit, handleChange, values, errors, touched }) => (
            <Form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">

                                {/* Otp Input */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-jost font-medium">Otp</label>
                    <input
                        name="otp"
                        type="text"
                        placeholder="Otp Code"
                        value={values.otp}
                        onChange={handleChange}
                        className="border rounded-lg px-3 py-2 h-[48px] outline-none "
                    />
                    {errors.otp && touched.otp && <div className="text-RED-_100 text-xs">{errors.otp}</div>}
                </div>


                <button
                    type="submit"
                    className="bg-black text-white w-full py-3 rounded-lg font-medium flex justify-center"
                >
                    {loading ? <CgSpinner className="animate-spin text-lg" /> : 'Verify'}
                </button>

                <p className='text-[#000000] font-jost text-base text-center'>
                    Did not receive your email? <span className='text-[#C89657] font-bold cursor-pointer' onClick={() => resendCode()}>Resend Verification Email</span>
                </p>
            </Form>
            )}
        </Formik>
    </div>
  );
};

export default VerifyOtp;
