import React, {useState, useLayoutEffect, useCallback, useContext} from 'react';
import {PropTypes} from 'prop-types';
import {GiftedChat} from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from 'firebase/firestore';
import {database} from '../config/firebase';
import {MainContext} from '../contexts/MainContext';

const Messaging = ({navigation}) => {
  const [messages, setMessages] = useState([]);
  const {user, avatar} = useContext(MainContext);

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

  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={true}
      onSend={(messages) => onSend(messages)}
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
