import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Backdrop from '@/utils/popups/application/Backdrop';
import { animate } from '@/utils/popups/application/animation';
import { showErrorToast } from '@/lib/utils/toasts/toast';

const AppForm = ({ handleClose }) => {
  // To set focus on each input field and return error when field is not properly filled
  const [focused, setFocused] = React.useState({});
  const router = useRouter();

  // For file name
  const [fileName, setFileName] = useState('')

  // Give the selected file a name when selected
  let handleFile = (file) => {
    setFileName(file?.name)
  }

  // Create a reference to the hidden file input element
  const hiddenFileInput = useRef(null);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file 
  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    handleFile(fileUploaded);
    console.log('upload successful')
  };

  // For params in email.js
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [job, setJob] = useState("");
  const [rightToWork, setRightToWork] = useState("");
  const [resume, setResume] = useState(0);
  
  // This target each specific input field
  const handleBlur = (e) => {
    setFocused(prev => ({...prev, [e.target.name]: true}))
  }

  // For focusing the input field for correct information
  const isFocused = (name) => {
    return focused[name] === true
  }

  // This submits the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Example validations
  if (!/^[A-Za-z]{2,16}$/.test(firstName)) {
    showErrorToast('First name must be between 2 and 16 letters.');
    return;
  }
  if (!/^[A-Za-z]{2,16}$/.test(lastName)) {
    showErrorToast('Last name must be between 2 and 16 letters.');
    return;
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    showErrorToast('Please enter a valid email address.');
    return;
  }
  if (!/^[+][0-9]{11,14}$/.test(phoneNumber)) {
    showErrorToast('Phone number must include a country code and be 11-14 digits.');
    return;
  }
  if (!job) {
    showErrorToast('Please select a job role.');
    return;
  }
  if (!rightToWork) {
    showErrorToast('Please confirm your right to work in the UK.');
    return;
  }
  if (!resume || (resume.size > 5 * 1024 * 1024)) {
    showErrorToast('Please upload a resume under 5MB.');
    return;
  }

    try {
      const formData = new FormData();
      formData.append('file', resume);

      const uploadResponse = await fetch('api/firebase/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error('Failed to upload resume');
      const { downloadUrl } = await uploadResponse.json();

      const applicationData = {
        firstName,
        lastName,
        email,
        phoneNumber,
        job,
        rightToWork,
        resumeUrl: downloadUrl,
      };

      const response = await fetch('/api/firebase/apply', {
        method: 'POST',
        body: JSON.stringify(applicationData),
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }
      console.log('Application submitted successfully')
      router.push('/submit')
    } catch(error) {
      console.error('Error submitting application:', error);
      showErrorToast('Error submitting application. Please try again later.');
    }
  }

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
          <X size={30}/>
        </button>
        <img 
          src='/logo/Logo-ROASTAR-white.webp'
          width={150}
        />
        <form onSubmit={handleSubmit} className='app-form'>
          <h3>APPLICATION DETAILS</h3>
          <div className='form-content'>
            <div className='first-name'>
              <input
                type='text'
                name='from_firstname'
                value={firstName}
                placeholder='First Name'
                autoComplete='given-name'
                pattern='^[A-Za-z]{2,16}$'
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={handleBlur}
                data-focused={isFocused('from_firstname').toString()}
                required
              >
              </input>
              <span>First Name must be at least 2 characters or more</span>
            </div>
            <div className='last-name'>
              <input
                type='text'
                name="from_lastname"
                value={lastName}
                placeholder='Last Name'
                autoComplete='family-name'
                pattern='^[A-Za-z]{2,16}$'
                onChange={(e) => setLastName(e.target.value)}
                onBlur={handleBlur}
                data-focused={isFocused('from_lastname').toString()}
                required
              >
              </input>
              <span>Last Name must be at least 2 characters or more</span>
            </div>
            <div className='email'>
              <input
                type='email'
                name='from_email'
                value={email}
                placeholder='Email'
                autoComplete='off'
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleBlur}
                data-focused={isFocused('from_email').toString()}
                required
              >
              </input>
              <span>Please provide a valid email address</span>
            </div>
            <div className='phone-number'>
              <input
                type='tel'
                name='from_phonenumber'
                value={phoneNumber}
                placeholder='Phone number (please include country code)'
                pattern="[+]{1}[0-9]{11,14}"
                autoComplete='off'
                onChange={(e) => setPhoneNumber(e.target.value)}
                onBlur={handleBlur}
                data-focused={isFocused('from_phonenumber').toString()}
                required
              >
              </input>
              <span>Valid phone number and Country code is required</span>
            </div>
            <div className='job'>
              <p>What job role are you applying for?</p>
              <select 
                name='job'
                value={job}
                onChange={(e) => setJob(e.target.value)}
                onBlur={handleBlur}
                data-focused={isFocused('job').toString()}
                required 
              >
                <option value=''>Choose a role</option>
                <option value='Barista'>Barista</option>
              </select>
              <span>Please choose a role</span>
            </div>
            <div className='rtw'>
              <p>Do you have the right to work in the UK?</p>
              <select 
                name='right_to_work'
                onChange={(e) => setRightToWork(e.target.value)}
                onBlur={handleBlur}
                data-focused={isFocused('right_to_work').toString()}
                required  
              >
                <option value=''>Right to work?</option>
                <option value='Yes'>Yes</option>
                <option value='No'>No</option>
              </select>
              <span>Please choose Yes or No</span>
            </div>
            <div className='cv'>
              <button type='button' className="button-upload" onClick={handleClick}>
                {fileName ? <p>{fileName}</p> : <p>UPLOAD CV</p>}
              </button>
              <input
                name='resume'
                type="file"
                accept='.pdf, .docx'
                onChange={(e) => {
                  handleChange(e);
                  setResume(e.target.files[0]);
                }}
                ref={hiddenFileInput}
                required
                style={{ display: 'none'}}
              />
              <span style={{position: 'relative', top: '0.6em'}}>Please upload cv</span>
            </div>
          </div>
          <Link href='/submit'>
            <button 
              disabled={!firstName | !lastName | !email | !phoneNumber | !job | !rightToWork | !resume }
              className='submit-btn'
            >
              <span>SUBMIT</span>
            </button>
          </Link>
        </form>
      </motion.div>
    </Backdrop>
  )
}

export default AppForm