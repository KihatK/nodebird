import React from 'react';
import Router from 'next/router';
import { useSelector } from 'react-redux';
import { Menu, Col } from 'antd';
import Link from 'next/link';
import PropTypes from 'prop-types';

import LoginForm from '../containers/LoginForm';
import UserProfile from '../containers/UserProfile';
import { InputSearch, RowStyle } from './style/AppLayoutStyle';

const AppLayout = ({ children }) => {
    const { me } = useSelector(state => state.user);

    const searchTag = (value) => {
        Router.push('/hashtag/[tag]', `/hashtag/${value}`);
    }

    return (
        <>
            <Menu mode="horizontal">
                <Menu.Item>
                    <Link href="/">
                        <a>
                            노드버드
                        </a>
                    </Link>
                </Menu.Item>
                <Menu.Item>
                    <Link href="/profile" prefetch>
                        <a>
                            프로필
                        </a>
                    </Link>
                </Menu.Item>
                <Menu.Item>
                    <InputSearch enterButton onSearch={searchTag} />
                </Menu.Item>
            </Menu>
            <RowStyle gutter={10}>
                <Col xs={24} md={6}>
                    {me
                        ? <UserProfile />
                        : <LoginForm />
                    }
                </Col>
                <Col xs={24} md={12}>
                    {children}
                </Col>
                <Col xs={24} md={6}>
                    Made by Kihat
                </Col>
            </RowStyle>
        </>
    );
}

AppLayout.propTypes = {
    children: PropTypes.object.isRequired,
}

export default AppLayout;