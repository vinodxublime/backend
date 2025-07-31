import React, { useEffect, useState } from 'react';
import { fetchFromBackend } from './api';

function BackendStatus() {
  const [status, setStatus] = useState('Checking...');

  useEffect(() => {
    fetchFromBackend('/')
      .then(() => setStatus('Backend is reachable!'))
      .catch(() => setStatus('Backend is not reachable.'));
  }, []);

  return <div>Backend status: {status}</div>;
}

export default BackendStatus;
