import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Backdrop from '@/utils/popups/application/Backdrop';
import { animate } from '@/utils/popups/application/animation';
import { showErrorToast } from '@/lib/utils/toasts/toast';

const AppForm = ({ handleClose }) => {
  const { control, handleSubmit, setValue, clearErrors, watch, formState: { errors } } = useForm({
    mode: 'onBlur',
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      job: "",
      rightToWork: "",
      resume: null,
    },
  });
  const router = useRouter();
  // Create a reference to the hidden file input element
  const hiddenFileInput = useRef(null);
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(true);

  // Give the selected file a name when selected
  let handleFile = (file) => {
    setFileName(file?.name || "")
    setValue("resume", file);
  }

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file 
  const handleFileChange = (e) => {
    const fileUploaded = e.target.files[0];
    if (fileUploaded) {
      handleFile(fileUploaded);
      console.log('upload successful')
    }
  };

  // Handles the submission of data to backend
  const onSubmit = async (data) => {
    setLoading(true);
    if (!data.resume) {
      showErrorToast('Please upload a valid CV before submitting.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('phoneNumber', data.phoneNumber);
      formData.append('job', data.job);
      formData.append('rightToWork', data.rightToWork);
      formData.append('resume', data.resume);

      const response = await fetch('/api/nodemailer/application', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      const result = await response.json();
      if (response.ok) {
        console.log('Application submitted successfully');
        router.push('/submit');
      } else {
        const errorMessage = result?.message || 'Submission failed';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      showErrorToast('Error submitting application. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Backdrop>
      <motion.div 
        onClick={(e) => e.stopPropagation()}
        className='app-card'
        variants={animate}
        initial='hidden'
        animate='visible'
        exit='exit'
      >
        <button
          onClick={handleClose}
          className='app-btn'
        >
          <X size={30} strokeWidth={1.5}/>
        </button>
        <img 
          src='/logo/Logo-ROASTAR-white.webp'
          width={150}
        />
        <form onSubmit={handleSubmit(onSubmit)} className='app-form'>
          <h3>APPLICATION FORM</h3>
          <div className='form-content'>
            <Controller
              name='firstName'
              control={control}
              rules={{
                required: 'First name is required',
                pattern: {
                  value: /^[A-Za-z]{2,16}$/,
                  message: "First Name must be at least 2 characters",
                },
              }}
              render={({ field }) => (
                <div className='first-name'>
                  <label htmlFor="first-name"/>
                  <input
                    {...field}
                    id='first-name'
                    name='first-name'
                    placeholder="First Name"
                    autoComplete="given-name"
                    onChange={(e) => {
                      field.onChange(e);
                      clearErrors("firstName")
                    }}
                    onBlur={(e) => field.onBlur(e)}
                  />
                  {errors.firstName && <p className='input-error'>{errors.firstName.message}</p>}
                </div>
              )}
            />
            <Controller
              name='lastName'
              control={control}
              rules={{
                required: 'Last name is required',
                pattern: {
                  value: /^[A-Za-z]{2,16}$/,
                  message: "Last Name must be at least 2 characters",
                },
              }}
              render={({ field }) => (
                <div className='last-name'>
                  <label htmlFor="last-name"/>
                  <input
                    {...field}
                    id='last-name'
                    name='last-name'
                    placeholder="Last Name"
                    autoComplete="family-name"
                    onChange={(e) => {
                      field.onChange(e);
                      clearErrors("lastName")
                    }}
                    onBlur={(e) => field.onBlur(e)}
                  />
                  {errors.lastName && <p className='input-error'>{errors.lastName.message}</p>}
                </div>
              )}
            />
            <Controller
              name='email'
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[^@]+@[^@]+\.[^@]+$/,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <div className='email'>
                  <label htmlFor="email"/>
                  <input
                    {...field}
                    id='email'
                    placeholder="Email"
                    autoComplete="off"
                    onChange={(e) => {
                      field.onChange(e);
                      clearErrors("email")
                    }}
                    onBlur={(e) => field.onBlur(e)}
                  />
                  {errors.email && <p className='input-error'>{errors.email.message}</p>}
                </div>
              )}
            />
            <Controller
              name='phoneNumber'
              control={control}
              rules={{
                required: 'Phone number is required',
                pattern: {
                  value: /^[+]{1}[0-9]{11,14}$/,
                  message: "Valid phone number and country code required",
                },
              }}
              render={({ field }) => (
                <div className='phone-number'>
                  <label htmlFor="phone-number"/>
                  <input
                    {...field}
                    id='phone-number'
                    placeholder="Phone number (please include country code)"
                    onChange={(e) => {
                      field.onChange(e);
                      clearErrors("phoneNumber")
                    }}
                    onBlur={(e) => field.onBlur(e)}
                  />
                  {errors.phoneNumber && <p className='input-error'>{errors.phoneNumber.message}</p>}
                </div>
              )}
            />
            <Controller
              name='job'
              control={control}
              rules={{ required: 'Job is required' }}
              render={({ field }) => (
                <div className='job'>
                  <p>What job role are you looking for?</p>
                  <label htmlFor="job"/>
                  <select 
                    {...field}
                    id='job'
                    onChange={(e) => {
                      field.onChange(e);
                      clearErrors("job")
                    }}
                    onBlur={(e) => field.onBlur(e)}
                  >
                    <option value="" disabled>Choose a role</option>
                    <option value="Barista">Barista</option>
                  </select>
                  {errors.job && <p className='error'>{errors.job.message}</p>}
                </div>
              )}
            />
            <Controller
              name='rightToWork'
              control={control}
              rules={{ required: 'Please confirm your right to work' }}
              render={({ field }) => (
                <div className='rtw'>
                  <p>Do you have a right to work in the UK?</p>
                  <label htmlFor="right-to-work"/>
                  <select 
                    {...field}
                    id='right-to-work'
                    onChange={(e) => {
                      field.onChange(e);
                      clearErrors("rightToWork")
                    }}
                    onBlur={(e) => field.onBlur(e)}
                  >
                    <option value="" disabled>Right to work?</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {errors.rightToWork && <p className='error'>{errors.rightToWork.message}</p>}
                </div>
              )}
            />
            <div className='cv'>
              <button 
                type='button' 
                className="button-upload" 
                onClick={handleClick}
              >
                {fileName ? <p>{fileName}</p> : <p>UPLOAD CV</p>}
              </button>
              <input
                id='cv'
                type="file"
                accept='.pdf, .docx'
                style={{ display: 'none' }}
                ref={hiddenFileInput}
                onChange={handleFileChange}
              />
              <span style={{ position: 'relative', top: '0.6em' }}>Please upload cv</span>
            </div>
            <button 
              disabled={!watch("resume") }
              className='submit-btn'
            >
              {loading ? 'SUBMIT APPLICATION': 'Processing...' }
            </button>
          </div>
        </form>
      </motion.div>
    </Backdrop>
  )
}

export default AppForm;