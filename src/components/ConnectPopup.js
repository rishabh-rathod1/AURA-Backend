import React, { useState } from 'react';

const ConnectPopup = ({ onConnect }) => {
  const [ipAddress, setIpAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateIpAddress(ipAddress)) {
      onConnect(ipAddress);
    } else {
      alert('Please enter a valid IP address');
    }
  };

  const validateIpAddress = (ip) => {
    const regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-5 rounded-lg shadow-xl">
        <h2 className="text-xl mb-4">Enter Server IP Address</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            placeholder="e.g., 192.168.1.100"
            className="border p-2 w-full mb-4"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Connect
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConnectPopup;