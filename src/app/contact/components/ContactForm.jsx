"use client"
import React, { useState, useRef } from 'react';
import { CircleCheckBig } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { showErrorToast } from '@/lib/utils/toasts/toast';

const ContactForm = () => {
  // react states for required field inputs
  const { control, handleSubmit, clearErrors, reset, watch, formState: { errors } } = useForm({ 
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    }
  });
  const [show, setShow] = useState(true);

  const name = watch('name');
  const email = watch('email');
  const subject = watch('subject');
  const message = watch('message');

  const isFormReady = name && email && subject && message.length >= 100 && !Object.keys(errors).length;

  const onSubmit = async (formData) => {
    try {
      const response = await fetch('/api/web3forms/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to send email')

      const data = await response.json();
      console.log('Email sent successfully', data);

      reset();
      setShow(false); // Displays confirmation once form is submitted
    } catch (error) {
      console.error('Error sending email', error)
      showErrorToast('There was an error. Please try again.')
    }
  };

  return (
    <>
      {show ? (
        <form onSubmit={handleSubmit(onSubmit)} className='contact-form'>
          <div className='contact-form-content'>
            <Controller
              name='name'
              control={control}
              rules={{
                required: 'Name is required',
                pattern: {
                  value: /^[A-Za-z]{2,16}$/,
                  message: "Name needs to be at least 3 characters"
                }
              }}
              render={({ field }) => (
                <div className='textbox name'>
                  <label htmlFor='name'/>
                  <input
                    {...field}
                    id="name"
                    placeholder='Name'
                    autoComplete='given-name'
                    onChange={(e) => {
                      field.onChange(e);
                      clearErrors("name")
                    }}
                    onBlur={(e) => field.onBlur(e)}
                  />
                  {errors.name && <p className='input-error'>{errors.name.message}</p>}
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
                  message: "A valid email address is required"
                }
              }}
              render={({ field }) => (
                <div className='textbox email'>
                  <label htmlFor='email'/>
                  <input
                    {...field}
                    id="email"
                    placeholder='Email'
                    autoComplete='off'
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
              name="subject"
              control={control}
              rules={{ required: "Subject is required" }}
              render={({ field }) => (
                <div className='textbox subject'>
                  <label htmlFor="subject"/>
                  <select
                    {...field}
                    id="subject"
                    onChange={(e) => {
                      field.onChange(e);
                      clearErrors("subject")
                    }}
                    onBlur={(e) => field.onBlur(e)}
                  >
                    <option value='' disabled>What is your enquiry about?</option>
                    <option value='General'>General</option>
                    <option value='Review'>Review</option>
                    <option value='Business'>Business</option>
                    <option value='Other'>Other</option>
                  </select>
                  {errors.subject && <p className='error'>{errors.subject.message}</p>}
                </div>
              )}
            />
            <Controller
              name='message'
              control={control}
              rules={{ 
                required: 'Message needs to be 100 characters minimum',
                minLength: {
                  value: 100,
                  message: "Message must be at least 100 characters"
                }
              }}
              render={({ field }) => (
                <div className='textbox message'>
                  <label htmlFor='message'/>
                  <textarea
                    {...field}
                    id='message'
                    cols="30"
                    rows="15"
                    minLength={100}
                    placeholder='What is your message about? Message needs to be at least 100 characters long.'
                    onChange={(e) => {
                      field.onChange(e);
                      clearErrors("message")
                    }}
                    onBlur={(e) => field.onBlur(e)}
                  />
                  {errors.message && <p className='input-error'>{errors.message.message}</p>}
               </div>
              )}
            />
            <div>
              <button 
                disabled={!isFormReady}
                className='message-submit-btn'
                type='submit'
              >
                SUBMIT MESSAGE
              </button>
            </div>
          </div>
        </form>
        ) : (
        <div className='sent-confirm'>
          <CircleCheckBig 
            style={{ color: 'var(--btn-green)' }}
            strokeWidth={0.4} 
            size={400}/>
          <p className='sent-confirm-text'>Thank you for your message!</p>
          <p className='sent-confirm-text-two'>You should hear back from us soon.</p>
        </div>
      )}
    </>
  );
}

export default ContactForm