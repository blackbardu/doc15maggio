import React, { createContext, useState } from 'react';

const MyArrayContext = createContext();

const MyArrayProvider = ({ children }) => {
  const [myArray, setMyArray] = useState([]);

  return (
    <MyArrayContext.Provider value={{ myArray, setMyArray }}>
      {children}
    </MyArrayContext.Provider>
  );
};

export { MyArrayContext, MyArrayProvider };
