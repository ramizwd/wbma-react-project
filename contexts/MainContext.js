import React, {useState} from 'react';
import PropTypes from 'prop-types';

const MainContext = React.createContext({});

const MainProvider = ({children}) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [update, setUpdate] = useState(0);
  const [avatar, setAvatar] = useState('http://placekitten.com/640');

  return (
    <MainContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        user,
        setUser,
        update,
        setUpdate,
        avatar,
        setAvatar,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

MainProvider.propTypes = {
  children: PropTypes.node,
};

export {MainContext, MainProvider};
