import React, { createContext, useState } from 'react';

export const IpAddressContext = createContext();

export const IpAddressProvider = ({ children }) => {
  const [ipAddress, setIpAddress] = useState('');

  return (
    <IpAddressContext.Provider value={{ ipAddress, setIpAddress }}>
      {children}
    </IpAddressContext.Provider>
  );
};
