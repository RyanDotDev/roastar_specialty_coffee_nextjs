"use client"
import React, { useState } from 'react';
import { CircleCheckBig } from 'lucide-react';

const ContactForm = () => {
  // react states for required field inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  // react state for confirmation of message sent
  const [show, setShow] = React.useState(true);

  // To set focus on each input field and return error when field is not properly filled
  const [focused, setFocused] = React.useState({});

  // Function that seperates each field for handling blur
  const handleBlur = (e) => {
    setFocused(prev => ({...prev, [e.target.name]: true}));
  };

  // For focusing the input field for correct information
  const isFocused = (name) => {
    return focused[name] === true;
  };

  // the handle submit function combined with EmailJs
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email')
      }

      const data = await response.json();
      console.log('Email sent successfully', data)

      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
      setShow(false); // Displays confirmation once form is submitted
    } catch (error) {
      console.error('Error sending email', error)
    }
  };

  return (
    <>
      {show ? (
        <form onSubmit={handleSubmit} className='form'>
          <div className='textbox name'>
            <label htmlFor='name'/>
            <input
              id='name'
              name='from_name'
              value={name}
              type='text'
              placeholder='Your Name'
              pattern='^[A-Za-z]{3,16}$'
              autoComplete='name'
              onBlur={handleBlur}
              onChange={(e) => setName(e.target.value)}
              data-focused={isFocused('from_name').toString()}
              required
            />
            <span>Please fill in this field</span>
          </div>
          <div className='textbox email'>
            <label htmlFor='email'/>
            <input
              id='email'
              name='from_email'
              value={email}
              type='email'
              autoComplete='off'
              placeholder='Your Email'
              onBlur={handleBlur}
              onChange={(e) => setEmail(e.target.value)}
              data-focused={isFocused('from_email').toString()}
              required
            />
            <span>Please fill in this field</span>
          </div>
          <div className='textbox subject'>
            <label htmlFor='subject'/>
            <select
              id='subject'
              name='from_subject'
              value={subject}
              onBlur={handleBlur}
              onChange={(e) => setSubject(e.target.value)}
              data-focused={isFocused('from_subject').toString()}
              required
            >
              <option value=''>What is your enquiry about?</option>
              <option value='General'>General</option>
              <option value='Review'>Review</option>
              <option value='Business'>Business</option>
              <option value='Other'>Other</option>
            </select>
            <span>Please select an appropiate subject</span>
          </div>
          <div className='textbox message'>
            <label htmlFor='message'/>
            <textarea
              id='message'
              name='message'
              value={message}
              cols="30"
              rows="15"
              minLength={100}
              placeholder='What is your message to us about? Any specifics, please add here.'
              onBlur={handleBlur}
              onChange={(e) => setMessage(e.target.value)}
              data-focused={isFocused('message').toString()}
              required
            />
            <span>Message needs to be at least 100 characters long</span>
          </div>
          <div >
            <button 
              disabled={!name | !email | !subject | !message }
              className='message-submit-btn'
              type='submit'
            >
              SUBMIT MESSAGE
            </button>
          </div>
        </form>
        ) : (
        <div className='sent-confirm'>
          <CircleCheckBig 
            style={{color: 'var(--btn-green)'}}
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