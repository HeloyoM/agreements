import { useEffect, useState } from 'react';
import './App.css';
import ServiceAgreementForm from './ServiceAgreementForm';
import { Paper } from '@mui/material';

function App() {
  const [name, setName] = useState('');
  const [signature, setSignature] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, signature }),
      });

      const data = await res.json();
      setResponse(data.message);
    } catch (error) {
      setResponse('Submission failed');
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }} elevation={3}>
      <ServiceAgreementForm />
    </Paper>
  );
}

export default App;
