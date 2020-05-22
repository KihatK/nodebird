import React, { useState, useCallback } from 'react';
import Router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { LOG_IN_REQUEST } from '../reducers/user';
import { SignupBtn } from './style/LoginFormStyle';

const LoginForm = () => {
    const dispatch = useDispatch();
    const { isLoggingIn } = useSelector(state => state.user);

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const changeId = useCallback((e) => {
        setId(e.target.value);
    }, []);
    const changePassword = useCallback((e) => {
        setPassword(e.target.value);
    }, []);

    const clickSignup = useCallback(() => {
        Router.push('/signup');
    }, []);

    const finishLogin = useCallback(() => {
        dispatch({
            type: LOG_IN_REQUEST,
            data: {
                userId: id,
                password,
            }
        });
    }, [id, password]);

    return (
        <Form onFinish={finishLogin}>
            <Form.Item
                rules={[
                    {
                        required: true,
                        message: 'Please input your Username!',
                    },
                ]}
            >
                <Input prefix={<UserOutlined />} placeholder="Username" value={id} onChange={changeId} />
            </Form.Item>
            <Form.Item
                rules={[
                    {
                        required: true,
                        message: 'Please input your Password!',
                    },
                ]}
            >
                <Input
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="Password"
                    value={password} onChange={changePassword}
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={isLoggingIn}>로그인</Button>
                <SignupBtn onClick={clickSignup}>회원가입</SignupBtn>
            </Form.Item>
        </Form>
    );
}

export default LoginForm;