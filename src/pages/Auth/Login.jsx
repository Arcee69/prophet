import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { CgSpinner } from 'react-icons/cg';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedin } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import LogoBlack from '../../assets/svg/logo_black.svg';

import PasswordField from '../../components/InputFields/PasswordField';

const Login = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const formValidationSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <img src={LogoBlack} alt="Logo" className="w-32 cursor-pointer" onClick={() => navigate("/")}/>
      <p className="text-[30px] font-jost font-semibold">Hi, Welcome! 👋</p>

      <Formik
        initialValues={{ email: '', password: '', check: false }}
        validationSchema={formValidationSchema}
        onSubmit={(values) => {
          setLoading(true);
          setTimeout(() => {
            console.log(values);
            setLoading(false);
          }, 1000);
          navigate("/dashboard");
          window.scrollTo(0, 0)
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

            {/* Divider */}
            <div className="flex items-center gap-2 my-3">
              <div className="h-px flex-1 bg-gray-300"></div>
              <p className="text-sm text-gray-500">or</p>
              <div className="h-px flex-1 bg-gray-300"></div>
            </div>

            {/* Social Login Buttons */}
            <button className="border w-full py-3 flex items-center justify-center gap-3 rounded-lg">
              <FcGoogle className="text-lg" />
              Sign in with Google
            </button>
            <button className="border w-full py-3 flex items-center justify-center gap-3 rounded-lg">
              <FaLinkedin className="text-blue-600 text-lg" />
              Sign in with LinkedIn
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
