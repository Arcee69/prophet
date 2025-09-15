import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { CgSpinner } from 'react-icons/cg';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedin } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import LogoBlack from '../../assets/png/logo.png';

import PasswordField from '../../components/InputFields/PasswordField';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../features/auth/loginSlice';
import { isMobileOrTablet } from '../../utils/deviceDetector';
import UnsupportedDevice from '../UnsupportedDevice';

const Login = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch()

  const formValidationSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const submitForm = (values) => {
    setLoading(true);
    const data = {
        email: values?.email,
        password: values?.password,
    };

    dispatch(loginUser(data))
        .then((res) => {
            console.log(res, "best");
            if (res?.type === "user/loginUser/fulfilled") {
                setLoading(false);
                navigate("/dashboard");
            } else {
                setLoading(false);
            }
        });
};

  if (isMobileOrTablet()) {
    return <UnsupportedDevice />;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <img src={LogoBlack} alt="Logo" className="w-32 cursor-pointer" onClick={() => navigate("/")}/>
      <p className="text-[30px] font-jost font-semibold">Hi, Welcome! 👋</p>

      <Formik
        initialValues={{ email: '', password: '', check: false }}
        validationSchema={formValidationSchema}
        onSubmit={(values) => {
          submitForm(values)
        }}
      >
        {({ handleSubmit, handleChange, values, errors, touched }) => (
          <Form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            {/* Email Input */}
            <div className="flex flex-col gap-1">
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

            {/* Password Input */}
            <div className="flex flex-col">
              <label className="text-sm font-jost font-medium">Password</label>
              <PasswordField
                name="password"
                value={values.password}
                placeholder="Password"
                className="border w-full h-[48px] rounded-lg outline-none text-gray-700"
                onChange={handleChange}
              />
              {errors.password && touched.password && <div className="text-RED-_100 text-xs">{errors.password}</div>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                    <input type="checkbox" name="check" onChange={handleChange} />
                    <span className='font-jost '>Remember me</span>
                </label>
                <p 
                    onClick={() => {navigate("/forgot-password"); window.scrollTo(0,0)}} 
                    className="text-gray-500 font-jost cursor-pointer hover:underline"
                >
                    Forgot password?
                </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-black text-white w-full py-3 rounded-lg font-medium flex justify-center"
            >
              {loading ? <CgSpinner className="animate-spin text-lg" /> : 'Log In'}
            </button>
            
            <p className='my-3 font-jost text-center'>
              Don't have account? <span className='hover:underline cursor-pointer font-medium text-[#1F2733]' onClick={() => {navigate("/register"), window.scrollTo(0, 0)}}>Sign Up</span>
            </p>

            {/* Divider */}
            {/* <div className="flex items-center gap-2 my-3">
              <div className="h-px flex-1 bg-gray-300"></div>
              <p className="text-sm text-gray-500">or</p>
              <div className="h-px flex-1 bg-gray-300"></div>
            </div> */}

            {/* Social Login Buttons */}
            {/* <button className="border w-full py-3 flex items-center justify-center gap-3 rounded-lg">
              <FcGoogle className="text-lg" />
              Sign in with Google
            </button>
            <button className="border w-full py-3 flex items-center justify-center gap-3 rounded-lg">
              <FaLinkedin className="text-blue-600 text-lg" />
              Sign in with LinkedIn
            </button> */}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
