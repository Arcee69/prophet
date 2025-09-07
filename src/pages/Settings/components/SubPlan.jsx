import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { fetchSubSettings } from '../../../features/subSettings/getSubSettingsSlice';
import { api } from '../../../services/api';
import { appUrls } from '../../../services/urls';
import axios from 'axios';
import  Cookies from  "js-cookie"

const SubPlan = ({ handleClose }) => {
  const dispatch = useDispatch();
  const { subSettings, loading, error } = useSelector((state) => state.allSubSettings);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchSubSettings());
  }, [dispatch]);

   const token = Cookies.get("token")

  // Debug data structure
  console.log('SubSettings data:', subSettings);
  
  // Extract plans based on actual data structure
  const subscriptionPlans = subSettings?.data || subSettings?.data || [];
  const ondemandPlans = subSettings?.ondemandPlans || subSettings?.data?.ondemandPlans || [];

  const initialValues = {
    amount: '',
    type: 'subscription',
    subscription_plan_id: '',
    subscription_type: 'monthly',
    subscription_duration: '',
    ondemand_plan_id: '',
  };

  const validationSchema = Yup.object({
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive'),
  type: Yup.string()
    .oneOf(['subscription', 'ondemand'])
    .required('Type is required'),
  subscription_plan_id: Yup.string().when('type', {
    is: 'subscription',
    then: (schema) => schema.required('Subscription plan is required'),
  }),
  subscription_type: Yup.string().when('type', {
    is: 'subscription',
    then: (schema) => schema.required('Subscription type is required'),
  }),
  subscription_duration: Yup.number().when('type', {
    is: 'subscription',
    then: (schema) =>
      schema
        .required('Duration is required')
        .min(1, 'Duration must be at least 1')
        .test(
          'is-integer',
          'Duration must be a whole number',
          (val) => Number.isInteger(val)
        ),
  }),
  ondemand_plan_id: Yup.string().when('type', {
    is: 'ondemand',
    then: (schema) => schema.required('Ondemand plan is required'),
  }),
});


  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitError(null);
    
    // Prepare data for API - ensure we're only sending relevant fields
    const payload = {
      amount: parseFloat(values.amount),
      type: values.type,
      subscription_plan_id: values.type === 'subscription' ? values.subscription_plan_id : null,
      subscription_type: values.type === 'subscription' ? values.subscription_type : null,
      subscription_duration: values.type === 'subscription' ? parseInt(values.subscription_duration) : null,
      ondemand_plan_id: values.type === 'ondemand' ? values.ondemand_plan_id : null,
    };

    console.log('Submitting payload:', payload);

    try {
      const res = await axios.post("https://prophet.smhptech.com/api/v1/payments/initialize", payload, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
      });
      window.open(res?.data?.payment_url)
      console.log('API response:', res);
    } catch (err) {
      console.error('API error:', err);
      setSubmitError(err.response?.data?.message || 'Failed to submit payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate amount automatically when plan or duration changes
  const calculateAmount = (values, setFieldValue) => {
    if (values.type === 'subscription' && values.subscription_plan_id && values.subscription_duration) {
      const selectedPlan = subscriptionPlans.find(plan => plan.id === values.subscription_plan_id);
      if (selectedPlan) {
        const monthlyAmount = selectedPlan.monthly_amount || selectedPlan.amount;
        const amount = monthlyAmount * parseInt(values.subscription_duration);
        setFieldValue('amount', amount);
      }
    } else if (values.type === 'ondemand' && values.ondemand_plan_id) {
      const selectedPlan = ondemandPlans.find(plan => plan.id === values.ondemand_plan_id);
      if (selectedPlan) {
        setFieldValue('amount', selectedPlan.price || selectedPlan.amount);
      }
    }
  };

  if (loading) {
    return <div className="p-4">Loading plans...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading plans: {error}</div>;
  }

  return (
    <div className="bg-white w-full max-w-2xl h-[650px] mx-auto mt-8 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Subscription Payment</h2>
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              {/* Payment Type Selection */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Payment Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <Field
                      type="radio"
                      name="type"
                      value="subscription"
                      className="mr-2"
                    />
                    Subscription
                  </label>
                  <label className="flex items-center">
                    <Field
                      type="radio"
                      name="type"
                      value="ondemand"
                      className="mr-2"
                    />
                    Ondemand
                  </label>
                </div>
                <ErrorMessage name="type" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Conditional Fields based on Payment Type */}
              {values.type === 'subscription' && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Subscription Plan</label>
                    <Field 
                      as="select" 
                      name="subscription_plan_id"
                      className="w-full p-2 border border-gray-300 rounded"
                      onChange={(e) => {
                        setFieldValue('subscription_plan_id', e.target.value);
                        calculateAmount(values, setFieldValue);
                      }}
                    >
                      <option value="">Select Plan</option>
                      {subscriptionPlans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} - ${plan.monthly_amount || plan.amount}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="subscription_plan_id" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Subscription Type</label>
                    <Field 
                      as="select" 
                      name="subscription_type"
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </Field>
                    <ErrorMessage name="subscription_type" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Subscription Duration (months)</label>
                    <Field 
                      type="number" 
                      name="subscription_duration"
                      className="w-full p-2 border border-gray-300 rounded"
                      min="1"
                      onChange={(e) => {
                        setFieldValue('subscription_duration', e.target.value);
                        calculateAmount(values, setFieldValue);
                      }}
                    />
                    <ErrorMessage name="subscription_duration" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </>
              )}

              {values.type === 'ondemand' && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Ondemand Plan</label>
                  <Field 
                    as="select" 
                    name="ondemand_plan_id"
                    className="w-full p-2 border border-gray-300 rounded"
                    onChange={(e) => {
                      setFieldValue('ondemand_plan_id', e.target.value);
                      calculateAmount(values, setFieldValue);
                    }}
                  >
                    <option value="">Select Plan</option>
                    {ondemandPlans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - ${plan.price || plan.amount}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="ondemand_plan_id" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              )}

              {/* Amount Field */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Amount</label>
                <Field 
                  type="number" 
                  name="amount"
                  className="w-full p-2 border text-black border-gray-300 rounded"
                />
                <ErrorMessage name="amount" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Status Messages */}
              {submitError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {submitError}
                </div>
              )}
              
              {submitSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                  Payment submitted successfully!
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#F48A1F] text-white rounded hover:bg-orange-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Make Payment'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SubPlan;