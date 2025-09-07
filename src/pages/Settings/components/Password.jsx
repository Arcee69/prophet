import { useState } from 'react'
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import { CgSpinner } from 'react-icons/cg';
import { api } from '../../../services/api';
import { appUrls } from '../../../services/urls';

const Password = () => {
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async (values) => {
        const data = {
            "current_password": values.currentPassword,
            "new_password": values.newPassword,
            "new_password_confirmation": values.confirmPassword
        }
        try {
            const res = await api.post(appUrls?.CHANGE_PASSWORD_URL, data);
            toast.success(`${res.data.message}`, {
                position: "top-right",
                autoClose: 3500,
                closeOnClick: true,
            }); 
        } catch (err) {
            console.log(err, "error");
            toast.error(`${err.response?.data?.message || "An error occurred"}`, {
                position: "top-right",
                autoClose: 3500,
                closeOnClick: true,
            });
        }
    }

    const validationSchema = Yup.object({
        currentPassword: Yup.string().required("Current password is required"),
        newPassword: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .required("New password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], "Passwords must match")
            .required("Confirm password is required")
    });

    const formik = useFormik({
        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await handleUpdatePassword(values);
            } catch (error) {
                console.error("Update error:", error);
            } finally {
                setLoading(false);
            }
        },
    });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-white border border-[#E0E0E0] rounded-[10px] p-8 flex flex-col gap-6"
    >
        <div className="flex flex-col border-b border-[#EAECF0] pb-5 gap-2">
            <p className="font-medium font-jost text-[#111827] text-[18px] leading-[28px]">
                Password
            </p>
            <p className="text-[#9CA3AF] font-jost leading-5">
                Update your Password here
            </p>
        </div>

         {/* Current Password */}
        <div className="flex items-start pb-5 border-b border-[#EAECF0] justify-between">
            <p className="text-[#111827] font-jost font-medium">Current Password</p>
            <div className="flex flex-col w-[576px] gap-1">
                <input
                    type="text"
                    name="currentPassword"
                    value={formik.values.currentPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="rounded-md border border-[#E5E7EB] h-[56px] outline-none px-3 py-2"
                />
                {formik.touched.currentPassword && formik.errors.currentPassword && (
                    <p className="text-red-500 text-sm">{formik.errors.currentPassword}</p>
                )}
            </div>
        </div>

        {/* New Password */}
        <div className="flex items-start pb-5 border-b border-[#EAECF0] justify-between">
            <p className="text-[#111827] font-jost font-medium">New Password</p>
            <div className="flex flex-col w-[576px] gap-1">
                <input
                    type="text"
                    name="newPassword"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="rounded-md border border-[#E5E7EB] h-[56px] outline-none px-3 py-2"
                />
                {formik.touched.newPassword && formik.errors.newPassword && (
                    <p className="text-red-500 text-sm">{formik.errors.newPassword}</p>
                )}
            </div>
        </div>

         {/* Confirm Password */}
        <div className="flex items-start pb-5 border-b border-[#EAECF0] justify-between">
            <p className="text-[#111827] font-jost font-medium">Confirm Password</p>
            <div className="flex flex-col w-[576px] gap-1">
                <input
                    type="text"
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="rounded-md border border-[#E5E7EB] h-[56px] outline-none px-3 py-2"
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{formik.errors.confirmPassword}</p>
                )}
            </div>
        </div>

          {/* Button */}
        <div className="flex justify-end pt-4">
            <button
                type="submit"
                disabled={loading}
                className="bg-[#F48A1F] font-jost text-white px-6 py-2 rounded-md disabled:opacity-70 flex items-center gap-2"
            >
                {loading ? <CgSpinner className="animate-spin text-lg" /> : 'Update Password'}
            </button>
        </div>

    </form>
  )
}

export default Password