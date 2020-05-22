import React, { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PostCard from '../containers/PostCard';
import EditNickname from '../containers/EditNickname';
import FollowList from '../components/FollowList';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST, UNFOLLOW_USER_REQUEST, REMOVE_FOLLOWER_REQUEST } from '../reducers/user';

const Profile = () => {
    const dispatch = useDispatch();
    const id = useSelector(state => state.user.me && state.user.me.id);
    const {
        followerList, followingList, hasMoreFollowers, hasMoreFollowings, removedFollowing, removedFollower
    } = useSelector(state => state.user);
    const { mainPosts, hasMorePosts } = useSelector(state => state.post);

    const postRef = useRef(false);
    const followerRef = useRef(false);
    const followingRef = useRef(false);
    const countRef = useRef([]);

    const moreFollowings = useCallback(() => {
        dispatch({
            type: LOAD_FOLLOWINGS_REQUEST,
            data: id,
            offset: followingList.length,
        });
    }, [id, followingList.length]);
    const moreFollowers = useCallback(() => {
        dispatch({
            type: LOAD_FOLLOWERS_REQUEST,
            data: id,
            offset: followerList.length,
        });
    }, [id, followerList.length]);

    useEffect(() => {
        if (!postRef.current) {
            postRef.current = true;
            return;
        }
        dispatch({
            type: LOAD_USER_POSTS_REQUEST,
            data: id,
        });
    }, [id]);
    useEffect(() => {
        if (!followerRef.current) {
            followerRef.current = true;
            return;
        }
        dispatch({
            type: LOAD_FOLLOWERS_REQUEST,
            data: id,
        });
    }, [id]);
    useEffect(() => {
        if (!followingRef.current) {
            followingRef.current = true;
            return;
        }
        dispatch({
            type: LOAD_FOLLOWINGS_REQUEST,
            data: id,
        });
    }, [id]);

    const removeFollowing = useCallback(userId => () => {
        dispatch({
            type: UNFOLLOW_USER_REQUEST,
            data: userId,
        });
    }, []);
    const removeFollower = useCallback(userId => () => {
        dispatch({
            type: REMOVE_FOLLOWER_REQUEST,
            data: userId,
        });
    }, []);

    useEffect(() => {
        if (removedFollower) {
            dispatch({
                type: LOAD_FOLLOWERS_REQUEST,
                data: id,
                offset: followerList.length,
            });
        }
    }, [removedFollower, id, followerList.length]);
    useEffect(() => {
        if (removedFollowing) {
            dispatch({
                type: LOAD_FOLLOWINGS_REQUEST,
                data: id,
                offset: followingList.length,
            });
        }
    }, [removedFollowing, id, followingList.length]);

    const onScroll = useCallback(() => {
        if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
            if (hasMorePosts) {
                const lastId = mainPosts[mainPosts.length - 1].id;
                if (!countRef.current.includes(lastId)) {
                    dispatch({
                        type: LOAD_USER_POSTS_REQUEST,
                        data: id,
                        lastId,
                    });
                    countRef.current.push(lastId);
                }
            }
        }
    }, [mainPosts.length, hasMorePosts, id]);

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        }
    }, [mainPosts.length, hasMorePosts, id]);

    return (
        <>
            <EditNickname />
            <FollowList 
                header="팔로잉 목록" hasMore={hasMoreFollowings} clickMore={moreFollowings} 
                data={followingList} clickRemove={removeFollowing}
            />
            <FollowList 
                header="팔로워 목록" hasMore={hasMoreFollowers} clickMore={moreFollowers}
                data={followerList} clickRemove={removeFollower}
            />
            {mainPosts.map(v => <PostCard key={v.id} post={v} />)}
        </>
    );
}

Profile.getInitialProps = (context) => {
    const state = context.store.getState();
    context.store.dispatch({
        type: LOAD_USER_POSTS_REQUEST,
        data: state.user.me && state.user.me.id,
    });
    context.store.dispatch({
        type: LOAD_FOLLOWERS_REQUEST,
        data: state.user.me && state.user.me.id,
    });
    context.store.dispatch({
        type: LOAD_FOLLOWINGS_REQUEST,
        data: state.user.me && state.user.me.id,
    });
}

export default Profile;