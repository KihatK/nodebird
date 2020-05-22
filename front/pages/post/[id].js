import React, { useCallback, useState, useRef, useEffect } from 'react';
import Router from 'next/router';
import { useRouter } from 'next/router';
import { Input, Button, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { UPLOAD_IMAGES_REQUEST, LOAD_POST_REQUEST, EDIT_POST_REQUEST, REMOVE_IMAGE } from '../../reducers/post';
import { FormPost, FormPostDiv, PostBtn, ImageDiv } from '../../components/style/PostIdStyle';

const id = () => {
    const router = useRouter();
    const { id } = router.query;

    const dispatch = useDispatch();
    const { imagePaths, mainPosts, isEditedPost } = useSelector(state => state.post);

    const postIndex = mainPosts.findIndex(v => v.id === parseInt(id, 10));

    const [content, setContent] = useState(mainPosts[postIndex] && mainPosts[postIndex].content);
    const imageRef = useRef();

    const changeContent = useCallback((e) => {
        setContent(e.target.value);
    }, []);

    const finishEditPost = useCallback(() => {
        if (!content || !content.trim()) {
            return alert('게시글을 작성해주세요.');
        }
        const formData = new FormData();
        imagePaths.forEach(i => {
            formData.append('image', i);
        });
        formData.append('content', content);
        dispatch({
            type: EDIT_POST_REQUEST,
            data: formData,
            postId: id,
        });
    }, [id, content, imagePaths]);

    useEffect(() => {
        if (isEditedPost) {
            alert('수정되었습니다.');
            Router.push('/');
        }
    }, [isEditedPost]);

    const clickImage = useCallback(() => {
        imageRef.current.click();
    }, []);

    const changeImages = useCallback((e) => {
        const imagesFormData = new FormData();
        [].forEach.call(e.target.files, (f) => {
            imagesFormData.append('image', f);
        });
        dispatch({
            type: UPLOAD_IMAGES_REQUEST,
            data: imagesFormData,
        });
    }, []);

    const removeImage = useCallback(index => () => {
        dispatch({
            type: REMOVE_IMAGE,
            index,
        });
    }, []);

    return (
        <FormPost onFinish={finishEditPost} encType="multipart/form-data">
            <Input.TextArea maxLength={140}
                value={content} onChange={changeContent}
            />
            <FormPostDiv>
                <Button onClick={clickImage}>이미지 업로드</Button>
                <input type="file" multiple hidden ref={imageRef} onChange={changeImages} />
                <PostBtn type="primary" htmlType="submit">짹짹</PostBtn>
            </FormPostDiv>
            <div>
                {imagePaths.map((v, i) => (
                    <ImageDiv key={v}>
                        <img src={`http://localhost:3065/${v}`} alt={v} />
                        <div>
                            <Button onClick={removeImage(i)}>제거</Button>
                        </div>
                    </ImageDiv>
                ))}
            </div>
        </FormPost>
    );
}

id.getInitialProps = (context) => {
    const { id } = context.query;

    context.store.dispatch({
        type: LOAD_POST_REQUEST,
        data: id,
    });
}

export default id;