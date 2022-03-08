import {Image, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {
  Text,
  Layout,
  Spinner,
  Icon,
  Button,
  OverflowMenu,
  MenuItem,
  Popover,
} from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useComment, useMedia, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import Avatar from './Avatar';
import moment from 'moment';
import Likes from './Likes';
import {TouchableWithoutFeedback} from '@ui-kitten/components/devsupport';
import SavePost from './SavePost';
import Tags from './Tags';
import {Video} from 'expo-av';
import {ThemeContext} from '../contexts/ThemeContext';

// Media post content component that takes navigation and post props and renders poster's avatar,
// username and the post information
const CardContent = ({navigation, post, userPost, singlePost = false}) => {
  const {getUserById} = useUser();
  const {deleteMedia, loading} = useMedia();
  const {getCommentsByPost} = useComment();
  const [postOwner, setPostOwner] = useState({username: 'Loading username...'});
  const [comments, setComments] = useState([]);
  const {update, setUpdate, user} = useContext(MainContext);
  const [visible, setVisible] = useState(false);
  const videoRef = useRef(null);
  const themeContext = useContext(ThemeContext);
  const [showMore, setShowMore] = useState(false);
  const [popover, setPopover] = useState(false);

  // fetching post owner data by ID and setting it to the posterOwner state hook
  const fetchOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await getUserById(post.user_id, token);
      console.log('user', user);
      setPostOwner(user);
    } catch (error) {
      console.error('fetching owner error', error);
    }
  };

  // fetch comments for comment count
  const fetchComments = async () => {
    try {
      const comments = await getCommentsByPost(post.file_id);
      setComments(comments);
    } catch (error) {
      console.error('fetching comments error', error);
    }
  };

  // delete the selected post
  const deletePost = () => {
    Alert.alert('Delete', 'This file will be deleted!', [
      {text: 'Cancel'},
      {
        text: 'OK',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            const response = await deleteMedia(post.file_id, token);
            console.log('delete', response);
            response && setUpdate(update + 1);
          } catch (error) {
            console.error(error);
          }
        },
      },
    ]);
  };

  const showMoreDesc = () => {
    const toggleShowMore = showMore === false ? true : false;
    setShowMore(toggleShowMore);
  };

  // fetch both owner and avatar on component render
  useEffect(() => {
    fetchOwner();
  }, []);

  // update the comments count when a new comment is posted
  useEffect(() => {
    fetchComments();
  }, [update]);

  const renderCommentIcon = () => (
    <Icon
      color={themeContext.theme === 'light' ? 'black' : 'white'}
      style={styles.icon}
      name="comment"
    />
  );

  const renderOptionsIcon = () => (
    <Icon
      color={themeContext.theme === 'light' ? 'black' : 'white'}
      style={styles.iconOpt}
      name="ios-ellipsis-vertical-outline"
      pack="ionIcons"
    />
  );

  const renderMoreIcon = () => (
    <Icon
      name={showMore ? 'remove-sharp' : 'add'}
      pack="ionIcons"
      style={styles.moreIcon}
    />
  );

  const optionsBtn = () => (
    <Button
      onPress={() => {
        setVisible(true);
      }}
      style={styles.optionsBtn}
      accessoryLeft={renderOptionsIcon}
      appearance="ghost"
    />
  );

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        navigation.navigate('Single post', {
          file: post,
          owner: postOwner,
        });
      }}
    >
      <Layout style={{marginBottom: 8}}>
        <Layout
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Layout style={styles.postHeader}>
            <TouchableWithoutFeedback
              onPress={() => {
                post.user_id === user.user_id
                  ? navigation.navigate('Profile')
                  : navigation.navigate('User profile', {
                      file: post,
                    });
              }}
            >
              {!userPost && <Avatar userAvatar={post.user_id} />}
            </TouchableWithoutFeedback>
            <Layout style={styles.headerContent}>
              {!userPost && (
                <TouchableWithoutFeedback
                  onPress={() =>
                    navigation.navigate('User profile', {file: post})
                  }
                >
                  {postOwner.full_name ? (
                    <Text category="p1">
                      {postOwner.full_name}
                      <Text appearance="hint" style={styles.username}>
                        &nbsp;@{postOwner.username}
                      </Text>
                    </Text>
                  ) : (
                    <Text appearance="hint" style={styles.username}>
                      @{postOwner.username}
                    </Text>
                  )}
                </TouchableWithoutFeedback>
              )}
              <Text category="h6" style={styles.title}>
                {post.title}
              </Text>
            </Layout>
          </Layout>
          {post.user_id === user.user_id && (
            <OverflowMenu
              visible={visible}
              anchor={optionsBtn}
              onBackdropPress={() => setVisible(false)}
            >
              <MenuItem
                title="Modify"
                onPress={() => {
                  navigation.navigate('Modify post', {file: post});
                  setVisible(false);
                }}
              />
              <MenuItem
                title="Delete"
                onPress={() => {
                  deletePost();
                  setVisible(false);
                }}
              />
            </OverflowMenu>
          )}
        </Layout>

        <Layout style={styles.postContent}>
          {!loading ? (
            <Layout>
              {post.media_type === 'image' ? (
                singlePost ? (
                  <Popover
                    style={styles.popover}
                    backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
                    visible={popover}
                    onBackdropPress={() => setPopover(false)}
                    anchor={() => (
                      <TouchableWithoutFeedback
                        style={{height: 250}}
                        onPress={() => setPopover(true)}
                      >
                        <Image
                          source={{uri: uploadsUrl + post.filename}}
                          style={styles.image}
                          PlaceholderContent={<Spinner />}
                        />
                      </TouchableWithoutFeedback>
                    )}
                  >
                    <Image
                      source={{uri: uploadsUrl + post.filename}}
                      resizeMode="contain"
                      style={{
                        width: 400,
                        height: 400,
                      }}
                    />
                  </Popover>
                ) : (
                  <Image
                    source={{uri: uploadsUrl + post.thumbnails.w640}}
                    style={styles.image}
                    PlaceholderContent={<Spinner />}
                  />
                )
              ) : (
                <TouchableWithoutFeedback>
                  <Video
                    ref={videoRef}
                    style={styles.image}
                    source={{
                      uri: uploadsUrl + post.filename,
                    }}
                    usePoster={{
                      uri: uploadsUrl + post.screenshot,
                    }}
                    useNativeControls
                    isLooping
                    resizeMode="contain"
                    onError={(error) => {
                      console.log('<Video> error', error);
                    }}
                  ></Video>
                </TouchableWithoutFeedback>
              )}
            </Layout>
          ) : (
            <Layout style={styles.spinner}>
              <Spinner size="medium" />
            </Layout>
          )}

          <Text category="p2" appearance="hint" style={styles.time}>
            {moment(post.time_added).fromNow()}
          </Text>

          <Layout style={styles.bottomContent}>
            <Text numberOfLines={!showMore ? 2 : 0} style={styles.description}>
              {post.description}
            </Text>

            {singlePost && post.description.length > 150 && (
              <Button
                style={styles.showMoreBtn}
                size="tiny"
                appearance="ghost"
                status="basic"
                accessoryRight={renderMoreIcon}
                onPress={() => {
                  showMoreDesc();
                }}
              >
                {showMore ? 'Show Less' : 'Show More'}
              </Button>
            )}

            <Tags post={post} navigation={navigation} />
          </Layout>
        </Layout>

        <Layout style={styles.feedback}>
          <Likes file={post} />
          <SavePost file={post} />
          <Button
            onPress={() => {
              navigation.navigate('Single post', {
                navigation: navigation,
                file: post,
                owner: postOwner,
              });
            }}
            appearance="ghost"
            accessoryLeft={renderCommentIcon}
          >
            {(props) => (
              <Text {...props} style={styles.commentTxt}>
                {comments.length > 1
                  ? comments.length + ' comments'
                  : comments.length + ' comment'}
              </Text>
            )}
          </Button>
        </Layout>
      </Layout>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  postHeader: {
    flexDirection: 'row',
    padding: 10,
    paddingRight: 0,
    marginRight: 0,
  },
  headerContent: {
    marginLeft: 10,
    flexDirection: 'column',
    maxWidth: 283,
    margin: 0,
  },
  username: {
    fontFamily: 'IBMPlexMonoMed',
    fontSize: 14,
  },
  title: {
    fontFamily: 'JetBrainsMonoReg',
    fontSize: 16,
  },
  postContent: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '95%',
  },
  image: {
    height: 250,
    maxWidth: 600,
    marginBottom: 10,
    marginTop: 5,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  spinner: {
    marginLeft: 'auto',
    marginRight: 'auto',
    justifyContent: 'center',
    height: 250,
  },
  time: {
    textAlign: 'right',
    marginRight: 5,
  },
  optionsBtn: {
    width: 30,
    height: 45,
  },
  iconOpt: {
    height: 20,
    width: 20,
  },
  bottomContent: {
    padding: 10,
  },
  description: {
    fontFamily: 'JetBrainsMonoReg',
    fontSize: 14,
  },
  showMoreBtn: {
    width: 100,
    height: 35,
    alignSelf: 'flex-end',
  },
  moreIcon: {
    height: 19,
  },
  feedback: {
    flexDirection: 'row',
    padding: 10,
  },
  commentTxt: {
    marginLeft: 5,
    fontFamily: 'JetBrainsMonoReg',
    fontSize: 14,
  },
  icon: {
    height: 30,
  },
  button: {
    color: 'black',
    marginRight: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 20,
  },
  popover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

CardContent.propTypes = {
  post: PropTypes.object.isRequired,
  navigation: PropTypes.object,
  userPost: PropTypes.bool,
  singlePost: PropTypes.bool,
};

export default CardContent;
