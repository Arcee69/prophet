import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { CgSpinner } from 'react-icons/cg';

import { useNavigate } from 'react-router-dom';

import PasswordField from '../../components/InputFields/PasswordField';

import LogoBlack from '../../assets/svg/logo_black.svg';


const ResetPassword = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const formValidationSchema = Yup.object().shape({
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  });

  return (
    <div className="flex flex-col items-center gap-6">
        <img src={LogoBlack} alt="Logo" className="w-32" />
        <div className='flex flex-col gap-2 items-center'>
            <p className="text-[30px] leading-[39px] font-jost font-semibold">Reset password</p>
            <p className='font-jost text-[#000000] text-center text-base leading-5'>
                Create a new password for your Prophet account.
            </p>
        </div>

        <Formik
            initialValues={{ password: '', confirmPassword: '' }}
            validationSchema={formValidationSchema}
            onSubmit={(values) => {
                setLoading(true);
                setTimeout(() => {
                    console.log(values);
                    setLoading(false);
                }, 1000);
                navigate("/login");
            }}
        >
            {({ handleSubmit, handleChange, values, errors, touched }) => (
            <Form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">

                {/* Password Input */}
                <div className="flex flex-col">
                    <label className="text-sm font-jost font-medium">New Password</label>
                    <PasswordField
                        name="password"
                        value={values.password}
                        placeholder="must be 8 characters"
                        className="border w-full h-[48px] rounded-lg outline-none text-gray-700"
                        onChange={handleChange}
                    />
                    {errors.password && touched.password && <div className="text-RED-_100 text-xs">{errors.password}</div>}
                </div>

                {/* Password Input */}
                <div className="flex flex-col">
                    <label className="text-sm font-jost font-medium">Confirm New Password</label>
                    <PasswordField
                        name="confirmPassword"
                        value={values.confirmPassword}
                        placeholder="must be 8 characters"
                        className="border w-full h-[48px] rounded-lg outline-none text-gray-700"
                        onChange={handleChange}
                    />
                    {errors.confirmPassword && touched.confirmPassword && <div className="text-RED-_100 text-xs">{errors.confirmPassword}</div>}
                </div>


                <button
                    type="submit"
                    className="bg-black text-white w-full py-3 rounded-lg font-medium flex justify-center"
                >
                    {loading ? <CgSpinner className="animate-spin text-lg" /> : 'Reset Password'}
                </button>


                
            </Form>
            )}
        </Formik>
    </div>
  );
};

export default ResetPassword;
