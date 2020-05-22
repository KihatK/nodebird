import React, { useCallback } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Avatar, Button } from 'antd';

import { LOG_OUT_REQUEST } from '../reducers/user';

const UserProfile = () => {
    const dispatch = useDispatch();
    const { me } = useSelector(state => state.user);
    const Posts = useSelector(state => state.user.me && state.user.me.Posts);
    const Followings = useSelector(state => state.user.me && state.user.me.Followings);
    const Followers = useSelector(state => state.user.me && state.user.me.Followers);

    const clickLogout = useCallback(() => {
        dispatch({
            type: LOG_OUT_REQUEST,
        });
    }, []);

    return (
        <Card
            actions={[
                <Link href="/profile" prefetch>
                    <a>
                        짹짹
                        <br />
                        {Posts && Posts.length}
                    </a>
                </Link>,
                <Link href="/profile" prefetch>
                    <a>
                        팔로잉
                        <br />
                        {Followings && Followings.length}
                    </a>
                </Link>,
                <Link href="/profile" prefetch>
                    <a>
                        팔로워
                        <br />
                        {Followers && Followers.length}
                    </a>
                </Link>
            ]}
        >
            <Card.Meta
                avatar={<Avatar>{me && me.nickname[0]}</Avatar>}
                title={me && me.nickname}
            />
            <Button onClick={clickLogout}>로그아웃</Button>
        </Card>
    );
}

export default UserProfile;