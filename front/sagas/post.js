import { all, fork, put, call, takeEvery, takeLatest, throttle } from 'redux-saga/effects';
import axios from 'axios';

import {
    ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_POST_FAILURE,
    ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE,
    LOAD_MAIN_POSTS_REQUEST, LOAD_MAIN_POSTS_SUCCESS, LOAD_MAIN_POSTS_FAILURE,
    LIKE_POST_REQUEST, LIKE_POST_SUCCESS, LIKE_POST_FAILURE,
    UNLIKE_POST_REQUEST, UNLIKE_POST_SUCCESS, UNLIKE_POST_FAILURE,
    RETWEET_POST_REQUEST, RETWEET_POST_SUCCESS, RETWEET_POST_FAILURE,
    UPLOAD_IMAGES_REQUEST, UPLOAD_IMAGES_SUCCESS, UPLOAD_IMAGES_FAILURE,
    REMOVE_POST_REQUEST, REMOVE_POST_SUCCESS, REMOVE_POST_FAILURE,
    LOAD_USER_POSTS_REQUEST, LOAD_USER_POSTS_SUCCESS, LOAD_USER_POSTS_FAILURE,
    LOAD_HASHTAG_POSTS_REQUEST, LOAD_HASHTAG_POSTS_SUCCESS, LOAD_HASHTAG_POSTS_FAILURE,
    LOAD_POST_REQUEST, LOAD_POST_SUCCESS, LOAD_POST_FAILURE,
    EDIT_POST_REQUEST, EDIT_POST_SUCCESS, EDIT_POST_FAILURE,
} from '../reducers/post';
import {
    ADD_POST_OF_ME,
    REMOVE_POST_OF_ME
} from '../reducers/user';

function addPostAPI(postFormData) {
    return axios.post(`/post`, postFormData, {
        withCredentials: true,
    });
}

function* addPost(action) {
    try {
        const result = yield call(addPostAPI, action.data);
        yield put({
            type: ADD_POST_SUCCESS,
            data: result.data,
        });
        yield put({
            type: ADD_POST_OF_ME,
            data: result.data.id,
        });
    }
    catch (e) {
        console.error(e);
        yield put({
            type: ADD_POST_FAILURE,
            error: e,
        });
    }
}

function* watchAddPost() {
    yield takeEvery(ADD_POST_REQUEST, addPost);
}

function addCommentAPI(postId, commentData) {
    return axios.post(`/post/${postId}/comment`, { content: commentData }, {
        withCredentials: true,
    });
}

function* addComment(action) {
    try {
        const result = yield call(addCommentAPI, action.data.postId, action.data.comment);
        yield put({
            type: ADD_COMMENT_SUCCESS,
            data: result.data,
        });
    }
    catch (e) {
        console.error(e);
        yield put({
            type: ADD_COMMENT_FAILURE,
            error: e,
        })
    }
}

function* watchAddComment() {
    yield takeEvery(ADD_COMMENT_REQUEST, addComment);
}

function loadPostsAPI(lastId = 0) {
    return axios.get(`/posts?lastId=${lastId}`);
}

function* loadPosts(action) {
    try {
        const result = yield call(loadPostsAPI, action.lastId);
        yield put({
            type: LOAD_MAIN_POSTS_SUCCESS,
            data: result.data,
        });
    }
    catch (e) {
        console.error(e);
        yield put({
            type: LOAD_MAIN_POSTS_FAILURE,
            error: e,
        });
    }
}

function* watchLoadPosts() {
    yield throttle(2000, LOAD_MAIN_POSTS_REQUEST, loadPosts);
}

function likeUserAPI(postId) {
    return axios.post(`/post/${postId}/like`, {}, {
        withCredentials: true,
    });
}

function* likeUser(action) {
    try {
        const result = yield call(likeUserAPI, action.data);
        yield put({
            type: LIKE_POST_SUCCESS,
            data: {
                postId: action.data,
                userId: result.data,
            },
        });
    }
    catch (e) {
        console.error(e);
        yield put({
            type: LIKE_POST_FAILURE,
            error: e,
        });
    }
}

function* watchLikeUser() {
    yield takeEvery(LIKE_POST_REQUEST, likeUser);
}

function unlikeUserAPI(postId) {
    return axios.delete(`/post/${postId}/like`, {
        withCredentials: true,
    });
}

function* unlikeUser(action) {
    try {
        const result = yield call(unlikeUserAPI, action.data);
        yield put({
            type: UNLIKE_POST_SUCCESS,
            data: {
                postId: action.data,
                userId: result.data,
            },
        });
    }
    catch (e) {
        console.error(e);
        yield put({
            type: UNLIKE_POST_FAILURE,
            error: e,
        });
    }
}

function* watchUnlikeUser() {
    yield takeEvery(UNLIKE_POST_REQUEST, unlikeUser);
}

function retweetPostAPI(postId) {
    return axios.post(`/post/${postId}/retweet`, {}, {
        withCredentials: true,
    });
}

function* retweetPost(action) {
    try {
        const result = yield call(retweetPostAPI, action.data);
        yield put({
            type: RETWEET_POST_SUCCESS,
            data: result.data,
        });
    }
    catch (e) {
        console.error(e);
        yield put({
            type: RETWEET_POST_FAILURE,
            error: e,
        });
    }
}

function* watchRetweetPost() {
    yield takeEvery(RETWEET_POST_REQUEST, retweetPost);
}

function uploadImagesAPI(formData) {
    return axios.post(`/post/images`, formData, {
        withCredentials: true,
    });
}

function* uploadImages(action) {
    try {
        const result = yield call(uploadImagesAPI, action.data);
        yield put({
            type: UPLOAD_IMAGES_SUCCESS,
            data: result.data,
        })
    }
    catch (e) {
        console.error(e);
        yield put({
            type: UPLOAD_IMAGES_FAILURE,
            error: e,
        });
    }
}

function* watchUploadImages() {
    yield takeEvery(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function removePostAPI(postId) {
    return axios.delete(`/post/${postId}`, {
        withCredentials: true,
    });
}

function* removePost(action) {
    try {
        yield call(removePostAPI, action.data);
        yield put({
            type: REMOVE_POST_SUCCESS,
            data: action.data,
        });
        yield put({
            type: REMOVE_POST_OF_ME,
            data: action.data,
        });
    }
    catch (e) {
        console.error(e);
        yield put({
            type: REMOVE_POST_FAILURE,
            error: e,
        });
    }
}

function* watchRemovePost() {
    yield takeEvery(REMOVE_POST_REQUEST, removePost);
}

function loadUserPostsAPI(userId, lastId = 0) {
    return axios.get(`/user/${userId || 0}/posts?lastId=${lastId}`);
}

function* loadUserPosts(action) {
    try {
        const result = yield call(loadUserPostsAPI, action.data, action.lastId);
        yield put({
            type: LOAD_USER_POSTS_SUCCESS,
            data: result.data,
        });
    }
    catch (e) {
        console.error(e);
        yield put({
            type: LOAD_USER_POSTS_FAILURE,
            error: e,
        });
    }
}

function* watchLoadUserPosts() {
    yield throttle(2000, LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

function loadHashtagPostsAPI(tag, lastId = 0) {
    return axios.get(`/hashtag/${encodeURIComponent(tag)}?lastId=${lastId}`);
}

function* loadHashtagPosts(action) {
    try {
        const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);
        yield put({
            type: LOAD_HASHTAG_POSTS_SUCCESS,
            data: result.data,
        });
    }
    catch (e) {
        console.error(e);
        yield put({
            type: LOAD_HASHTAG_POSTS_FAILURE,
            error: e,
        });
    }
}

function* watchLoadHashtagPosts() {
    yield throttle(2000, LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

function loadPostAPI(postId) {
    return axios.get(`/post/${postId}`, {
        withCredentials: true,
    });
}

function* loadPost(action) {
    try {
        const result = yield call(loadPostAPI, action.data);
        yield put({
            type: LOAD_POST_SUCCESS,
            data: result.data,
        })
    }
    catch (e) {
        console.error(e);
        yield put({
            type: LOAD_POST_FAILURE,
            error: e,
        });
    }
}

function* watchLoadPost() {
    yield takeLatest(LOAD_POST_REQUEST, loadPost);
}

function editPostAPI(postData, postId) {
    return axios.patch(`/post/${postId}`, postData, {
        withCredentials: true,
    });
}

function* editPost(action) {
    try {
        yield call(editPostAPI, action.data, action.postId);
        yield put({
            type: EDIT_POST_SUCCESS,
        });
    }
    catch (e) {
        console.error(e);
        yield put({
            type: EDIT_POST_FAILURE,
            error: e,
        });
    }
}

function* watchEditPost() {
    yield takeEvery(EDIT_POST_REQUEST, editPost);
}

export default function* postSaga() {
    yield all([
        fork(watchAddPost),
        fork(watchAddComment),
        fork(watchLoadPosts),
        fork(watchLikeUser),
        fork(watchUnlikeUser),
        fork(watchRetweetPost),
        fork(watchUploadImages),
        fork(watchRemovePost),
        fork(watchLoadUserPosts),
        fork(watchLoadHashtagPosts),
        fork(watchLoadPost),
        fork(watchEditPost),
    ]);
}