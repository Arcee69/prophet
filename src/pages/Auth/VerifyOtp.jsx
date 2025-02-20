import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { CgSpinner } from 'react-icons/cg';

import { useNavigate } from 'react-router-dom';

import LogoBlack from '../../assets/svg/logo_black.svg';


const VerifyOtp = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const formValidationSchema = Yup.object().shape({
    otp: Yup.string().required('Otp is required'),
  });

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
            onSubmit={(values) => {
                setLoading(true);
                setTimeout(() => {
                    console.log(values);
                    setLoading(false);
                }, 1000);
                navigate("/reset-password");
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
                    Did not receive your email? <span className='text-[#C89657] font-bold cursor-pointer' onClick={() => {navigate("/login"); window.scrollTo(0, 0)}}>Resend Verification Email</span>
                </p>
            </Form>
            )}
        </Formik>
    </div>
  );
};

export default VerifyOtp;
