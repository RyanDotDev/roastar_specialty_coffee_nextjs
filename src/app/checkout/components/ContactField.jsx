import React from 'react'

const ContactField = ({ email, setEmail }) => {
  return (
    <>
      <h2 style={{ fontWeight: '600', fontSize: '1.3rem' }}>Contact</h2>
      <label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
          className='name-on-card-field'
          required
        />
      </label>
    </>
  )
}

export default ContactField