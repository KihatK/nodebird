import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button } from 'antd';

import { EDIT_NICKNAME_REQUEST } from '../reducers/user';
import { ErrorMsg, EditNicknameCard } from './style/EditNicknameStyle';

const EditNickname = () => {
    const originNickname = useSelector(state => state.user.me && state.user.me.nickname);

    const [nickname, setNickname] = useState(originNickname);

    const dispatch = useDispatch();
    const { editingError } = useSelector(state => state.user);

    const errorRef = useRef(false);

    const changeNickname = useCallback((e) => {
        setNickname(e.target.value);
    }, []);

    const finishNickname = useCallback(() => {
        dispatch({
            type: EDIT_NICKNAME_REQUEST,
            data: nickname,
        });
        errorRef.current = true;
    }, [nickname]);

    useEffect(() => {
        setNickname(originNickname);
    }, [originNickname]);

    return (
        <EditNicknameCard>
                <Form onFinish={finishNickname}>
                    <Input addonBefore="닉네임" value={nickname} onChange={changeNickname} />
                    <Button type="primary" htmlType="submit">수정</Button>
                </Form>
                {errorRef.current
                    ? editingError && <ErrorMsg>{editingError}</ErrorMsg>
                    : null
                }
        </EditNicknameCard>
    );
}

export default EditNickname;