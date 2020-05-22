import React, { useState, useCallback, useEffect } from 'react';
import Router from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Checkbox, Button } from 'antd';

import { SIGN_UP_REQUEST } from '../reducers/user';
import { ErrorMsg } from '../components/style/SignupStyle';

const useInput = (initValue = null) => {
    const [value, setter] = useState(initValue);
    const handler = useCallback((e) => {
        setter(e.target.value);
    }, []);
    return [value, handler];
}

const signup = () => {
    const dispatch = useDispatch();
    const { isSigningUp, signupMessage, me } = useSelector(state => state.user);

    const [passwordCheck, setPasswordCheck] = useState('');
    const [check, setCheck] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [checkError, setCheckError] = useState(true);

    const [id, changeId] = useInput('');
    const [nickname, changeNickname] = useInput('');
    const [password, changePassword] = useInput('');

    const changePasswordCheck = useCallback((e) => {
        setPasswordCheck(e.target.value);
        setPasswordError(password !== e.target.value);
    }, [password]);
    const changeCheck = useCallback((e) => {
        setCheck(e.target.checked);
        setCheckError(!e.target.checked);
    }, []);

    const finishSignup = useCallback(() => {
        if (passwordError) {
            return alert('비밀번호가 다릅니다.');
        }
        if (checkError) {
            return alert('약관 동의를 하셔야합니다.');
        }
        dispatch({
            type: SIGN_UP_REQUEST,
            data: {
                userId: id,
                password,
                nickname,
            }
        })
    }, [passwordError, checkError, id, password, nickname]);

    useEffect(() => {
        if (me) {
            Router.push('/');
            alert('메인 페이지로 이동합니다.');
        }
    }, [me]);

    return (
        <Form onFinish={finishSignup}>
            <Form.Item>
                <label>아이디</label>
                <br />
                <Input value={id} onChange={changeId} required />
            </Form.Item>
            <Form.Item>
                <label>닉네임</label>
                <br />
                <Input value={nickname} onChange={changeNickname} required />
            </Form.Item>
            <Form.Item>
                <label>비밀번호</label>
                <br />
                <Input type="password" value={password} onChange={changePassword} required />
            </Form.Item>
            <Form.Item>
                <label>비밀번호 확인</label>
                <br />
                <Input type="password" value={passwordCheck} onChange={changePasswordCheck} required />
                {passwordError && <ErrorMsg>비밀번호가 다릅니다.</ErrorMsg>}
            </Form.Item>
            <Form.Item>
                <Checkbox checked={check} onChange={changeCheck} >약관 동의</Checkbox>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={isSigningUp}>가입하기</Button>
            </Form.Item>
            {signupMessage && <div>{signupMessage}</div>}
        </Form>
    );
}

export default signup;