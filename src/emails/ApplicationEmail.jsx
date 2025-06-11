import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Hr
} from '@react-email/components';

const ApplicationEmail = ({ firstName, lastName, email, phoneNumber, job, rightToWork, resume }) => {
  return (
    <Html>
      <Head>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>📩 New Application Received</Heading>

          <Text style={field}><strong>First Name:</strong> {firstName}</Text>
          
          <Text style={field}><strong>Last Name:</strong> {lastName}</Text>
          
          <Text style={field}><strong>Email:</strong> {email}</Text>
         
          <Text style={field}><strong>Phone Number:</strong> {phoneNumber}</Text>
          
          <Text style={field}><strong>Job:</strong> {job}</Text>
          
          <Text style={field}><strong>Right To Work?:</strong> {rightToWork}</Text>
          
          <Text style={field}><strong>CV/Resume:</strong> {resume}</Text>
          
          <Hr style={divider} />
          <Text style={footer}>This message was sent from Roastar Coffee's careers page.</Text>
        </Container>
      </Body>
      </Head>
    </Html>
  )
}

export default ApplicationEmail;

const main = {
  backgroundColor: 'var(--main-green)',
  padding: '20px 0',
};

const container = {
  backgroundColor: 'white',
  borderRadius: '8px',
  padding: '20px',
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
  fontFamily: 'Arial, san-serif',
};

const heading = {
  fontSize: '22px',
  marginBottom: '16px',
}

const field = {
  marginBottom: '1rem'
}

const divider = {
  border: 'none',
  borderTop: '1px solid #e0e0e0',
  margin: '20px 0',
}

const footer = {
  fontSize: '12px',
  color: '#999999'
}