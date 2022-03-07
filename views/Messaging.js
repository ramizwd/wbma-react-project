import React, {useState, useLayoutEffect, useCallback, useContext} from 'react';
import {PropTypes} from 'prop-types';
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from 'firebase/firestore';
import {database} from '../config/firebase';
import {MainContext} from '../contexts/MainContext';

// Messages view
const Messaging = () => {
  const [messages, setMessages] = useState([]);
  const {user, avatar} = useContext(MainContext);

  // getting old messages from Firebase DB using the useLayoutEffect hook
  useLayoutEffect(() => {
    const collectionRef = collection(database, 'chats');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages(
        querySnapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });

    return unsubscribe;
  });

  // Handler method using useCallback hook for storing messages in Firebase collection ('chats')
  // using addDoc method to create a new document when a new message is sent
  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const {_id, createdAt, text, user} = messages[0];
    addDoc(collection(database, 'chats'), {
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

  // render GiftedChat component
  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={true}
      onSend={(messages) => onSend(messages)}
      renderBubble={(props) => {
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                color: '#E6E8E6',
              },
            }}
          />
        );
      }}
      user={{
        _id: user.user_id,
        avatar: avatar,
      }}
    />
  );
};

Messaging.propTypes = {
  navigation: PropTypes.object,
};

export default Messaging;
