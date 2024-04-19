import React, {createContext, useContext, useState} from 'react';

const ItemContext = createContext();

export const useItemContext = () => useContext(ItemContext);

export const ItemProvider = ({children}) => {
  const [items, setItems] = useState([]);

  const addItem = newItem => {
    setItems([...items, newItem]);
  };

  return (
    <ItemContext.Provider value={{items, addItem}}>
      {children}
    </ItemContext.Provider>
  );
};
