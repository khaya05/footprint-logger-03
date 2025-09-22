import { Form, useNavigate } from 'react-router-dom';
import { ActivityInput, ActivitySelect } from '..';
import {
  calculateEmissions,
  CATEGORIES,
  getActivityDetails,
  getActivityOptions,
} from '../../util/emissionFactors';
import { useState, useEffect } from 'react';
import customFetch from '../../util/customFetch';
import { toastService } from '../../util/toastUtil';
import { useDashboardContext } from '../../pages/DashboardLayout';

const ActivityForm = ({
  isEdit = false,
  initialData = null,
  activityId = null,
  onSuccess = null,
}) => {
  const [formData, setFormData] = useState({
    category: '',
    activity: '',
    amount: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  const navigate = useNavigate();
  const {setCurrentTab} = useDashboardContext()

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        category: initialData.category || '',
        activity: initialData.activity || '',
        amount: initialData.amount?.toString() || '',
        notes: initialData.notes || '',
        date: initialData.date
          ? initialData.date.split('T')[0]
          : new Date().toISOString().split('T')[0],
      });
    }
  }, [isEdit, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    if (name === 'category') {
      setFormData((prev) => ({
        ...prev,
        activity: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) newErrors.category = 'Please select a category!';
    if (!formData.activity) newErrors.activity = 'Please select an activity!';
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    if (!formData.date) newErrors.date = 'Please select a date';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const activityData = {
        ...formData,
        amount: parseFloat(formData.amount),
        emissions: parseFloat(calculateEmissions(formData)),
        unit: getActivityDetails(formData)?.unit || '',
      };

      setIsSubmitting(true);

      if (isEdit && activityId) {
        await customFetch.patch(`/activities/${activityId}`, activityData);
        toastService.success('Activity updated successfully');
      } else {
        await customFetch.post('/activities', {
          ...activityData,
          timestamp: new Date().toISOString(),
        });
        toastService.success('Activity added successfully');
        navigate('/dashboard');
        setCurrentTab('Dashboard')
      }

      setIsSubmitting(false);

      if (onSuccess) {
        onSuccess();
      } else if (!isEdit) {
        setTimeout(() => {
          setFormData({
            category: '',
            activity: '',
            amount: '',
            notes: '',
            date: new Date().toISOString().split('T')[0],
          });
        }, 1000);
      }
    } catch (error) {
      setIsSubmitting(false);
      const errorMessage = isEdit
        ? 'Failed to update activity'
        : 'Failed to add activity';

      toastService.error(error?.response?.data?.msg || errorMessage);
      console.error(error);
    }
  };

  const activityDetails = getActivityDetails(formData);
  const estimatedEmissions = calculateEmissions(formData);

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded shadow-2xl'>
      <div className='mb-8'>
        <h4 className='text-4xl text-gray-900 mb-2'>
          {isEdit ? 'Update Carbon Activity' : 'Add Carbon Activity'}
        </h4>
        <p className='text-gray-600'>
          {isEdit
            ? 'Update your activity details and environmental impact'
            : 'Track your daily activities and their environmental impact'}
        </p>
      </div>

      <Form method='post' className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <ActivitySelect
            name='category'
            options={CATEGORIES}
            value={formData.category}
            onChange={handleInputChange}
            error={errors.category}
            placeholder='Choose category...'
          />

          <ActivityInput
            name='date'
            label='Date'
            type='date'
            value={formData.date}
            onChange={handleInputChange}
            error={errors.date}
          />
        </div>

        {formData.category && (
          <ActivitySelect
            name='activity'
            options={getActivityOptions(formData)}
            value={formData.activity}
            onChange={handleInputChange}
            error={errors.activity}
            placeholder='Select Activity...'
          />
        )}

        {activityDetails && (
          <div className='bg-blue-50 p-4 rounded-lg'>
            <p className='text-sm text-gray-600 mb-2'>
              <strong>Activity:</strong> {activityDetails.description}
            </p>
            <p className='text-sm text-gray-600'>
              <strong>Unit:</strong> per {activityDetails.unit}
            </p>
          </div>
        )}

        {formData.activity && (
          <ActivityInput
            name='amount'
            label={`Amount (${activityDetails?.unit || 'units'})`}
            type='number'
            placeholder={`Enter ${activityDetails?.unit || 'amount'}...`}
            value={formData.amount}
            onChange={handleInputChange}
            error={errors.amount}
          />
        )}

        {estimatedEmissions > 0 && (
          <div className='bg-green-200 p-4 rounded-lg shadow'>
            <p className='text-lg font-semibold text-green-800'>
              Estimated Emissions: {estimatedEmissions} Kg CO₂
            </p>
          </div>
        )}

        <div className='w-full mt-2'>
          <label
            htmlFor='notes'
            className='capitalize text-sm font-medium text-gray-700'
          >
            Notes (optional)
          </label>
          <textarea
            id='notes'
            name='notes'
            placeholder='Add any additional details...'
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            className='block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500'
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full ${
            isSubmitting ? 'bg-green-600 cursor-not-allowed' : 'bg-green-500'
          } text-white py-3 px-4 rounded-lg hover:bg-green-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50`}
        >
          {isSubmitting
            ? isEdit
              ? 'Updating Activity...'
              : 'Adding Activity...'
            : isEdit
            ? 'Update Activity'
            : 'Add Activity'}
        </button>
      </Form>
    </div>
  );
};

export default ActivityForm;
