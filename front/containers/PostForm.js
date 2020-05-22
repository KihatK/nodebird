import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input } from 'antd';

import { ADD_POST_REQUEST, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE } from '../reducers/post';
import { FormPost, FormPostDiv, PostBtn, ImageDiv } from './style/PostFormStyle';

const PostForm = () => {
    const dispatch = useDispatch();
    const { isAddingPost, imagePaths } = useSelector(state => state.post);

    const [text, setText] = useState('');
    const imageInput = useRef();

    const changeText = useCallback((e) => {
        setText(e.target.value);
    }, []);

    const finishPost = useCallback(() => {
        const formData = new FormData();
        imagePaths.forEach(f => {
            formData.append('image', f);
        });
        formData.append('content', text);
        dispatch({
            type: ADD_POST_REQUEST,
            data: formData,
        });
    }, [text, imagePaths]);

    const clickInput = useCallback(() => {
        imageInput.current.click();
    }, [imageInput.current]);
    const changeImages = useCallback((e) => {
        const formData = new FormData();
        [].forEach.call(e.target.files, (f) => {
            formData.append('image', f);
        });
        dispatch({
            type: UPLOAD_IMAGES_REQUEST,
            data: formData,
        });
    }, []);

    const removeImage = useCallback(index => () => {
        dispatch({
            type: REMOVE_IMAGE,
            index,
        });
    }, []);

    useEffect(() => {
        if (!isAddingPost) {
            setText('');
        }
    }, [isAddingPost]);

    return (
        <FormPost onFinish={finishPost} encType="multipart/form-data">
            <Input.TextArea maxLength={140} value={text} onChange={changeText} />
            <FormPostDiv>
                <input type="file" multiple hidden ref={imageInput} onChange={changeImages} />
                <Button onClick={clickInput}>이미지 업로드</Button>
                <PostBtn type="primary" htmlType="submit" loading={isAddingPost}>짹짹</PostBtn>
            </FormPostDiv>
            {imagePaths.map((v, i) => (
                <ImageDiv key={v}>
                    <img src={`http://localhost:3065/${v}`} alt={v} />
                    <div>
                        <Button onClick={removeImage(i)}>제거</Button>
                    </div>
                </ImageDiv>
            ))}
        </FormPost>
    );
}

export default PostForm;