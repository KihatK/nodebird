import React,{ useState, useCallback } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Avatar, Popover, Button } from 'antd';
import { RetweetOutlined, HeartOutlined, MessageOutlined, EllipsisOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import CommentForm from './CommentForm';
import CommentList from '../components/CommentList';
import PostCardContent from '../components/PostCardContent';
import PostCardImages from '../components/PostCardImages';
import { LIKE_POST_REQUEST, UNLIKE_POST_REQUEST, RETWEET_POST_REQUEST, REMOVE_POST_REQUEST } from '../reducers/post';
import { FOLLOW_USER_REQUEST, UNFOLLOW_USER_REQUEST } from '../reducers/user';
import { PostCardDiv } from './style/PostCardStyle';

const PostCard = ({ post }) => {
    const dispatch = useDispatch();
    const id = useSelector(state => state.user.me && state.user.me.id);
    const followings = useSelector(state => state.user.me && state.user.me.Followings);

    const [commentOpen, setCommentOpen] = useState(false);

    const liked = post.Likers && post.Likers.find(v => v.id === id);
    const follow = followings && followings.find(v => v.id === post.User.id);
    
    const toggleCommentForm = useCallback(() => {
        setCommentOpen(!commentOpen);
    }, [commentOpen]);

    const likeUser = useCallback(postId => () => {
        dispatch({
            type: LIKE_POST_REQUEST,
            data: postId
        });
    }, []);
    const unlikeUser = useCallback(postId => () => {
        dispatch({
            type: UNLIKE_POST_REQUEST,
            data: postId,
        });
    }, []);

    const followUser = useCallback(userId => () => {
        dispatch({
            type: FOLLOW_USER_REQUEST,
            data: userId,
        });
    }, []);
    const unfollowUser = useCallback(userId => () => {
        dispatch({
            type: UNFOLLOW_USER_REQUEST,
            data: userId,
        });
    }, []);

    const clickRetweet = useCallback(postId => () => {
        dispatch({
            type: RETWEET_POST_REQUEST,
            data: postId,
        });
    }, []);

    const removePost = useCallback(postId => () => {
        dispatch({
            type: REMOVE_POST_REQUEST,
            data: postId,
        });
    }, []);

    const editPost = useCallback(postId => () => {
        Router.push('/post/[id]', `/post/${postId}`);
    }, []);

    return (
        <PostCardDiv>
            {post.RetweetId
                ? (
                    <Card
                        title={`${post.User.nickname}님이 리트윗하셨습니다.`}
                        extra={!id || post.User.id === id
                            ? null
                            : follow
                                ? <Button onClick={unfollowUser(post.User.id)}>언팔로우</Button>
                                : <Button onClick={followUser(post.User.id)}>팔로우</Button>
                        }
                        actions={[
                            <RetweetOutlined onClick={clickRetweet(post.id)} />,
                            <HeartOutlined
                                onClick={liked ? unlikeUser(post.id) : likeUser(post.id)} style={liked ? { color: 'red' } : { color: '' }}
                            />,
                            <MessageOutlined onClick={toggleCommentForm} />,
                            <Popover 
                                content={
                                    id && post.UserId === id
                                        ? (
                                            <div>
                                                <Button onClick={editPost(post.id)}>수정</Button>
                                                <Button danger onClick={removePost(post.id)}>삭제</Button>
                                            </div>   
                                        )
                                        : (
                                            <div>
                                                <Button>신고</Button>
                                            </div>
                                        )    
                                }
                            >
                                <EllipsisOutlined />
                            </Popover>
                        ]}
                    >
                        <Card
                            cover={post.Retweet.Images && post.Retweet.Images[0] && <PostCardImages images={post.Retweet.Images} />}
                        >
                            <Card.Meta
                                avatar={
                                    <Link href="/user/[id]" as={`/user/${post.Retweet.User.id}`}>
                                        <a>
                                            <Avatar>{post.Retweet.User.nickname[0]}</Avatar>
                                        </a>
                                    </Link>
                                }
                                title={post.Retweet.User.nickname}
                                description={<PostCardContent content={post.Retweet.content} />}
                            />
                        </Card>
                    </Card>
                )
                : (
                    <Card
                        cover={post.Images && post.Images[0] && <PostCardImages images={post.Images} />}
                        extra={!id || post.User.id === id
                            ? null
                            : follow
                                ? <Button onClick={unfollowUser(post.User.id)}>언팔로우</Button>
                                : <Button onClick={followUser(post.User.id)}>팔로우</Button>
                        }
                        actions={[
                            <RetweetOutlined onClick={clickRetweet(post.id)} />,
                            <HeartOutlined
                                onClick={liked ? unlikeUser(post.id) : likeUser(post.id)} style={liked ? { color: 'red' } : { color: '' }}
                            />,
                            <MessageOutlined onClick={toggleCommentForm} />,
                            <Popover 
                                content={
                                    id && post.UserId === id
                                        ? (
                                            <div>
                                                <Button onClick={editPost(post.id)}>수정</Button>
                                                <Button danger onClick={removePost(post.id)}>삭제</Button>
                                            </div>   
                                        )
                                        : (
                                            <div>
                                                <Button danger>신고</Button>
                                            </div>
                                        )    
                                }
                            >
                                <EllipsisOutlined />
                            </Popover>
                        ]}
                    >
                        <Card.Meta
                            avatar={
                                <Link href="/user/[id]" as={`/user/${post.User.id}`}>
                                    <a>
                                        <Avatar>{post.User.nickname[0]}</Avatar>
                                    </a>
                                </Link>
                            }
                            title={post.User.nickname}
                            description={<PostCardContent content={post.content} />}
                        />
                    </Card>
                )
            }
            {commentOpen && 
                <>
                    <CommentForm post={post} />
                    <CommentList post={post} />
                </>
            }
        </PostCardDiv>
    );
}

PostCard.propTypes = {
    post: PropTypes.object.isRequired,
};

export default PostCard;