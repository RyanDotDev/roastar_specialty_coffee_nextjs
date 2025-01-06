import React from 'react'

const DialingCodes = () => {
  return (
    <div>
      <select name='dial-codes' required>
        <option value=''>Choose a Country Code</option>
        <option value='united-kingdom'>🇬🇧 +44</option>
        <option value='united-states'>🇺🇸 +1</option>
        <option value='sweden'>🇸🇪 +46</option>
        <option value='germany'>🇩🇪 +49</option>
      </select>
    </div>
  )
}

export default DialingCodes