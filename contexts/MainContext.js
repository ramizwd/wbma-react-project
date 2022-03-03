import React, {useState} from 'react';
import PropTypes from 'prop-types';

const MainContext = React.createContext({});

// The main Context provider for sharing data across the app
const MainProvider = ({children}) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [update, setUpdate] = useState(0);
  const [likeUpdate, setLikeUpdate] = useState(0);
  const [saveUpdate, setSaveUpdate] = useState(0);
  const [avatar, setAvatar] = useState();
  const [tags, setTags] = useState([]);

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
        likeUpdate,
        setLikeUpdate,
        tags,
        setTags,
        saveUpdate,
        setSaveUpdate,
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
