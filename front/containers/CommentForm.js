import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';
import PropTypes from 'prop-types';

import { ADD_COMMENT_REQUEST } from '../reducers/post';

import { FormComment } from './style/CommentFormStyle';

const CommentForm = ({ post }) => {
    const dispatch = useDispatch();
    const { isAddingComment } = useSelector(state => state.post);

    const [comment, setComment] = useState('');

    const changeComment = useCallback((e) => {
        setComment(e.target.value)
    }, []);

    const finishComment = useCallback(() => {
        dispatch({
            type: ADD_COMMENT_REQUEST,
            data: {
                comment,
                postId: post.id,
            },
        });
    }, [comment]);

    useEffect(() => {
        if (!isAddingComment) {
            setComment('');
        }
    }, [isAddingComment]);

    return (
        <FormComment onFinish={finishComment}>
            <Form.Item>
                <Input.TextArea rows={4} value={comment} onChange={changeComment} />
                <Button type="primary" htmlType="submit" loading={isAddingComment}>삐약</Button>
            </Form.Item>
        </FormComment>
    );
}

CommentForm.propTypes = {
    post: PropTypes.object.isRequired,
};

export default CommentForm;