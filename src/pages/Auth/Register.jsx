import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { CgSpinner } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import LogoBlack from '../../assets/svg/logo_black.svg';
import PasswordField from '../../components/InputFields/PasswordField';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formValidationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    email: Yup.string().email().required('Email is required'),
    job: Yup.string().required('Job Title is required'),
    phone: Yup.number().required('Phone Number is required'),
    password: Yup.string().min(8, 'Must be 8 characters').required('Password is required'),
  });

  return (
    <div className="flex items-center justify-center ">
      <div className="  w-[400px]">
        {/* Logo */}
        <div className="flex justify-center">
          <img src={LogoBlack} alt="Logo" className="w-32 cursor-pointer" onClick={() => navigate("/")} />
        </div>

        {/* Welcome Text */}
        <p className="text-center text-2xl font-semibold mt-4">Hi, Welcome! 👋</p>

        {/* Formik Form */}
        <Formik
          initialValues={{ fullName: '', email: '', job: '', phone: '', password: '' }}
          validationSchema={formValidationSchema}
          onSubmit={(values) => {
            setLoading(true);
            setTimeout(() => {
              console.log(values);
              setLoading(false);
            }, 1000);
          }}
        >
          {({ handleSubmit, handleChange, values, errors, touched }) => (
            <Form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
              {/* Full Name Input */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Full Name</label>
                <input
                  name="fullName"
                  type="text"
                  placeholder="First Name and Last Name"
                  value={values.fullName}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 h-[48px] outline-none"
                />
                {errors.fullName && touched.fullName && (
                  <div className="text-red-500 text-xs">{errors.fullName}</div>
                )}
              </div>

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
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Create a password</label>
                <PasswordField
                  name="password"
                  value={values.password}
                  placeholder="must be 8 characters"
                  className="border w-full h-[48px] rounded-lg outline-none text-gray-700 px-3"
                  onChange={handleChange}
                />
                {errors.password && touched.password && (
                  <div className="text-red-500 text-xs">{errors.password}</div>
                )}
              </div>

              {/* Job Function Dropdown */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Job Function</label>
                <select
                  name="job"
                  value={values.job}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 h-[48px] outline-none bg-white"
                >
                  <option value="">Select from options</option>
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="manager">Manager</option>
                </select>
                {errors.job && touched.job && (
                  <div className="text-red-500 text-xs">{errors.job}</div>
                )}
              </div>

              {/* Phone Number Input */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Phone No.</label>
                <div className="border rounded-lg flex items-center h-[48px] px-3">
                  <span className="mr-2 text-gray-500">+234</span>
                  <input
                    name="phone"
                    type="text"
                    placeholder="Input your Phone no."
                    value={values.phone}
                    onChange={handleChange}
                    className="w-full outline-none"
                  />
                </div>
                {errors.phone && touched.phone && (
                  <div className="text-red-500 text-xs">{errors.phone}</div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-black text-white w-full py-3 rounded-lg font-medium flex justify-center"
              >
                {loading ? <CgSpinner className="animate-spin text-lg" /> : 'Sign Up'}
              </button>

              {/* Terms and Conditions */}
              <p className="text-center text-xs text-gray-500 mt-2">
                By creating an account or signing up you agree to our{' '}
                <span className="font-medium text-black">Terms and Conditions</span>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;

