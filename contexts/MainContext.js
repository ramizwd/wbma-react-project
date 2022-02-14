import React, {useState} from 'react';
import PropTypes from 'prop-types';

const MainContext = React.createContext({});

const MainProvider = ({children}) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [update, setUpdate] = useState(0);

  return (
    <MainContext.Provider value={{loggedIn, setLoggedIn, update, setUpdate}}>
      {children}
    </MainContext.Provider>
  );
};

MainProvider.propTypes = {
  children: PropTypes.node,
};

export {MainContext, MainProvider};
