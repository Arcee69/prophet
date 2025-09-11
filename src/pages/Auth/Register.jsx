import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { CgSpinner } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import LogoBlack from '../../assets/png/logo.png';
import PasswordField from '../../components/InputFields/PasswordField';
import { api } from '../../services/api';
import { appUrls } from '../../services/urls';
import { toast } from 'react-toastify';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const jobFunction = [
    "PR / Corporate Communications",
    "Marketing / Brand Management",
    "Social Media Management",
    "Journalism / Media (Reporter, Editor, Producer)",
    "Government / Public Affairs",
    "Policy / Research & Strategy",
    "Executive / Leadership",
    "Agency / Consulting",
    "NGO / Advocacy Communications",
    "Other (Please Specify)"
  ]

  const formValidationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    email: Yup.string().email().required('Email is required'),
    job: Yup.string().required('Job Title is required'),
    phone: Yup.number().required('Phone Number is required'),
    password: Yup.string().min(8, 'Must be 8 characters').required('Password is required'),
    confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  });

  const submitForm = async (values, action) => {
    setLoading(true);
    const data = {
      "name": values?.fullName,
      "email": values?.email,
      "phone": `+234${values?.phone}`,
      "job": values.job === "Other (Please Specify)" ? values.other : values.job,
      "password": values?.password,
      "password_confirmation": values?.confirmPassword
    }
    // console.log(data, "max")
    try {
      const res = await api.post(appUrls?.REGISTER_URL, data)
      console.log(res, "appo")
      toast(`${res?.data?.message}`, {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
      })  
      navigate("/verify-otp")
      localStorage.setItem("register", "register")
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
    <div className="flex items-center w-full justify-center ">
      <div className="w-[500px]">
        {/* Logo */}
        <div className="flex justify-center">
          <img src={LogoBlack} alt="Logo" className="w-32 cursor-pointer" onClick={() => navigate("/")} />
        </div>

        {/* Welcome Text */}
        <p className="text-center text-2xl font-semibold mt-4">Hi, Welcome! 👋</p>

        {/* Formik Form */}
        <Formik
          initialValues={{ 
            fullName: '', 
            email: '', 
            job: '',
            other: '', 
            phone: '', 
            password: '', 
            confirmPassword: '' 
          }}
          validationSchema={formValidationSchema}
          onSubmit={(values, action) => {
            submitForm(values, action)
          }}
        >
          {({ handleSubmit, handleChange, values, errors, touched }) => (
            <Form onSubmit={handleSubmit} className="flex flex-col w-full gap-4 mt-6">
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

              <div className="flex flex-col">
                  <label className="text-sm font-jost font-medium">Confirm Password</label>
                  <PasswordField
                      name="confirmPassword"
                      value={values.confirmPassword}
                      placeholder="must be 8 characters"
                      className="border w-full h-[48px] rounded-lg outline-none text-gray-700"
                      onChange={handleChange}
                  />
                  {errors.confirmPassword && touched.confirmPassword && <div className="text-RED-_100 text-xs">{errors.confirmPassword}</div>}
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
                  {jobFunction.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </select>
                {errors.job && touched.job && (
                  <div className="text-red-500 text-xs">{errors.job}</div>
                )}
              </div>

              {values.job === "Other (Please Specify)" &&      
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Job</label>
                    <input
                        name="other"
                        type="text"
                        placeholder=""
                        value={values.other}
                        onChange={handleChange}
                        className="border rounded-lg px-3 py-2 h-[48px] outline-none "
                    />
                  </div>
              }

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

              <p className='font-jost text-center'>
                Have an account? <span className='hover:underline cursor-pointer font-medium text-[#1F2733]' onClick={() => {navigate("/login"), window.scrollTo(0, 0)}}>Log In</span>
              </p>

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

