import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import Upload from "../../../assets/svg/uploadIcon.svg"
import { api } from "../../../services/api";
import { appUrls } from "../../../services/urls";
import { toast } from "react-toastify";
import { CgSpinner } from "react-icons/cg";
import axios from "axios";
import  Cookies from  "js-cookie"


const BasicDetails = () => {
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const { profile } = useSelector((state) => state.userProfile);
  const profileData = profile?.data;

   const token = Cookies.get("token")

  // Set initial photo preview from profile data
  useEffect(() => {
    if (profileData?.pic) {
      setPhotoPreview(profileData.pic);
    }
  }, [profileData]);

  const handleSubmitProfileData = async (values) => {
    setLoading(true);
    const data = {
      "name": values.name,
      "email": values.email,
      "phone": values.phone,
      "job": values.job
    };
    try {
      const res = await axios.put("https://prophet.smhptech.com/api/v1/user/update", data, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
      });
      toast.success(`${res.data.message}`, {
        position: "top-right",
        autoClose: 3500,
        closeOnClick: true,
      });
    } catch (err) {
      console.log(err, "error");
      toast.error(`${err.data?.message || "An error occurred"}`, {
        position: "top-right",
        autoClose: 3500,
        closeOnClick: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPhoto = async (photoFile) => {
    try {
      const formData = new FormData();
      formData.append("pic", photoFile);

      const res = await axios.post("https://prophet.smhptech.com/api/v1/user/profile-pic", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
        }
      });
      toast.success(`${res.data.message}`, {
        position: "top-right",
        autoClose: 3500,
        closeOnClick: true,
      });
    } catch (err) {
      console.log(err, "error");
      toast.error(`${err.data?.message || "Failed to upload photo"}`, {
        position: "top-right",
        autoClose: 3500,
        closeOnClick: true,
      });
    }
  };

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: profileData?.name || "",
      email: profileData?.email || "",
      phone: profileData?.phone || "",
      job: profileData?.job || "",
      photo: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Full name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string()
        .matches(/^[0-9]+$/, "Must be a valid phone number")
        .min(10, "Must be at least 10 digits")
        .required("Phone number is required"),
      photo: Yup.mixed().nullable(),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await handleSubmitProfileData(values);
        if (values.photo) {
          await handleSubmitPhoto(values.photo);
        }
        toast.success("Profile updated successfully!", {
          position: "top-right",
          autoClose: 3500,
          closeOnClick: true,
        });
      } catch (error) {
        console.error("Update error:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  // Handle photo selection and preview
  const handlePhotoChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("photo", file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-white border border-[#E0E0E0] rounded-[10px] p-8 flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex flex-col border-b border-[#EAECF0] pb-5 gap-2">
        <p className="font-medium font-jost text-[#111827] text-[18px] leading-[28px]">
          Basic info
        </p>
        <p className="text-[#9CA3AF] font-jost leading-5">
          Update your Contact person photo and personal details here.
        </p>
      </div>

      {/* Full name */}
      <div className="flex items-start pb-5 border-b border-[#EAECF0] justify-between">
        <p className="text-[#111827] font-jost font-medium">Name</p>
        <div className="flex flex-col w-[576px] gap-1">
          <label className="text-[#475367] font-medium font-jost text-sm mb-1">
            Full name
          </label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="rounded-md border border-[#E5E7EB] h-[56px] outline-none px-3 py-2"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm">{formik.errors.name}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="flex items-start pb-5 border-b border-[#EAECF0] justify-between">
        <p className="text-[#111827] font-jost font-medium">Email address</p>
        <div className="flex flex-col w-[576px] gap-1">
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="rounded-md border border-[#E5E7EB] h-[56px] outline-none px-3 py-2"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}
        </div>
      </div>

      {/* Job */}
      <div className="flex items-start pb-5 border-b border-[#EAECF0] justify-between">
        <p className="text-[#111827] font-jost font-medium">Job</p>
        <div className="flex flex-col w-[576px] gap-1">
          <input
            type="text"
            name="job"
            value={formik.values.job}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="rounded-md border border-[#E5E7EB] h-[56px] outline-none px-3 py-2"
          />
          {formik.touched.job && formik.errors.job && (
            <p className="text-red-500 text-sm">{formik.errors.job}</p>
          )}
        </div>
      </div>

      {/* Phone */}
      <div className="flex items-start pb-5 border-b border-[#EAECF0] justify-between">
        <p className="text-[#111827] font-jost font-medium">Phone No.</p>
        <div className="flex flex-col w-[576px] gap-1">
          <input
            type="tel"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="rounded-md border border-[#E5E7EB] h-[56px] outline-none px-3 py-2"
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="text-red-500 text-sm">{formik.errors.phone}</p>
          )}
        </div>
      </div>

      {/* Photo upload */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <label className="text-[#374151] font-medium">Your photo</label>
          <p className="text-[#9CA3AF] text-sm">
            This will be displayed on your profile.
          </p>
        </div>
        <div className="flex items-center w-[576px] gap-4">
          <img
            src={photoPreview || "/default-avatar.png"}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
          <label className="flex items-center justify-center w-full h-28 border-2 border-dashed border-[#EAECF0] rounded-md cursor-pointer hover:border-orange-500 transition">
            <div className="flex flex-col items-center justify-center text-center">
              <img src={Upload} alt="Upload" className="w-10 h-10 mb-1" />
              <p className="text-sm text-gray-500">
                <span className="text-orange-500">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-400">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </p>
            </div>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
        </div>
        {formik.errors.photo && (
          <p className="text-red-500 text-sm">{formik.errors.photo}</p>
        )}
      </div>

      {/* Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#F48A1F] font-jost text-white px-6 py-2 rounded-md disabled:opacity-70 flex items-center gap-2"
        >
          {loading ? <CgSpinner className="animate-spin text-lg" /> : 'Edit Profile'}
        </button>
      </div>
    </form>
  );
};

export default BasicDetails;
