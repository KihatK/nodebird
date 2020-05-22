import React, { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Avatar } from 'antd';

import PostCard from '../../containers/PostCard';
import { LOAD_USER_REQUEST } from '../../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../../reducers/post';
import { UserCard } from '../../components/style/UserIdStyle';

const Id = () => {
    const router = useRouter();
    const { id } = router.query;

    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.user);
    const { mainPosts, hasMorePosts } = useSelector(state => state.post);

    const postRef = useRef(false);
    const userRef = useRef(false);
    const countRef = useRef([]);

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
        if (!userRef.current) {
            userRef.current = true;
            return;
        }
        dispatch({
            type: LOAD_USER_REQUEST,
            data: id,
        });
    }, [id]);

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
            <UserCard
                actions={[
                    <div>짹짹<br/>{userInfo && userInfo.Posts}</div>,
                    <div>팔로잉<br/>{userInfo && userInfo.Followings}</div>,
                    <div>팔로워<br/>{userInfo && userInfo.Followers}</div>
                ]}
            >
                <Card.Meta
                    avatar={
                        <Link href="/user/[id]" as={`/user/${id}`}>
                            <a>
                                <Avatar>{userInfo && userInfo.nickname[0]}</Avatar>
                            </a>
                        </Link>
                    }
                    title={userInfo && userInfo.nickname}
                />
            </UserCard>
            {mainPosts.map(v => <PostCard key={v.id} post={v} />)}
        </>
    );
}

Id.getInitialProps = (context) => {
    const { id } = context.query;

    context.store.dispatch({
        type: LOAD_USER_POSTS_REQUEST,
        data: id,
    });
    context.store.dispatch({
        type: LOAD_USER_REQUEST,
        data: id,
    });
}

export default Id;