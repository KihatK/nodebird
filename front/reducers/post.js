import produce from 'immer';

export const initialState = {
    mainPosts: [],
    singlePost: [],
    imagePaths: [],
    isAddingPost: false,
    isAddingComment: false,
    hasMorePosts: true,
    isEditedPost: false,
};

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const LOAD_MAIN_POSTS_REQUEST = 'LOAD_MAIN_POSTS_REQUEST';
export const LOAD_MAIN_POSTS_SUCCESS = 'LOAD_MAIN_POSTS_SUCCESS';
export const LOAD_MAIN_POSTS_FAILURE = 'LOAD_MAIN_POSTS_FAILURE';

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export const RETWEET_POST_REQUEST = 'RETWEET_POST_REQUEST';
export const RETWEET_POST_SUCCESS = 'RETWEET_POST_SUCCESS';
export const RETWEET_POST_FAILURE = 'RETWEET_POST_FAILURE';

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_REQUEST';

export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';

export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';

export const EDIT_POST_REQUEST = 'EDIT_POST_REQUEST';
export const EDIT_POST_SUCCESS = 'EDIT_POST_SUCCESS';
export const EDIT_POST_FAILURE = 'EDIT_POST_FAILURE';

export const REMOVE_IMAGE = 'REMOVE_IMAGE';

const reducer = (state=initialState, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case ADD_POST_REQUEST: {
                draft.isAddingPost = true;
                break;
            }
            case ADD_POST_SUCCESS: {
                draft.isAddingPost = false;
                draft.mainPosts.unshift(action.data);
                draft.imagePaths = [];
                break;
            }
            case ADD_POST_FAILURE: {
                draft.isAddingPost = false;
                break;
            }
            case ADD_COMMENT_REQUEST: {
                draft.isAddingComment = true;
                break;
            }
            case ADD_COMMENT_SUCCESS: {
                draft.isAddingComment = false;
                const postIndex = draft.mainPosts.findIndex(v => v.id === action.data.PostId);
                draft.mainPosts[postIndex].Comments.push(action.data);
                break;
            }
            case ADD_COMMENT_FAILURE: {
                draft.isAddingComment = false;
                break;
            }
            case LOAD_HASHTAG_POSTS_REQUEST:
            case LOAD_USER_POSTS_REQUEST:
            case LOAD_MAIN_POSTS_REQUEST: {
                draft.mainPosts = action.lastId ? draft.mainPosts : [];
                draft.hasMorePosts = action.lastId ? draft.hasMorePosts : true;
                draft.imagePaths = [];
                draft.isEditedPost = false;
                break;
            }
            case LOAD_HASHTAG_POSTS_SUCCESS:
            case LOAD_USER_POSTS_SUCCESS:
            case LOAD_MAIN_POSTS_SUCCESS: {
                action.data.forEach(p => {
                    draft.mainPosts.push(p);
                });
                draft.hasMorePosts = action.data.length === 10;
                break;
            }
            case LOAD_HASHTAG_POSTS_FAILURE:
            case LOAD_USER_POSTS_FAILURE:
            case LOAD_MAIN_POSTS_FAILURE: {
                break;
            }
            case LIKE_POST_REQUEST: {
                break;
            }
            case LIKE_POST_SUCCESS: {
                const index = draft.mainPosts.findIndex(v => v.id === action.data.postId);
                draft.mainPosts[index].Likers.push(action.data.userId);
                break;
            }
            case LIKE_POST_FAILURE: {
                break;
            }
            case UNLIKE_POST_REQUEST: {
                break;
            }
            case UNLIKE_POST_SUCCESS: {
                const index = draft.mainPosts.findIndex(v => v.id === action.data.postId);
                const index2 = draft.mainPosts[index].Likers.findIndex(v => v.id === action.data.userId);
                draft.mainPosts[index].Likers.splice(index2, 1);
                break;
            }
            case UNLIKE_POST_FAILURE: {
                break;
            }
            case RETWEET_POST_REQUEST: {
                break;
            }
            case RETWEET_POST_SUCCESS: {
                draft.mainPosts.unshift(action.data);
                break;
            }
            case RETWEET_POST_FAILURE: {
                break;
            }
            case UPLOAD_IMAGES_REQUEST: {
                draft.imagePaths = [];
                break;
            }
            case UPLOAD_IMAGES_SUCCESS: {
                action.data.forEach(i => {
                    draft.imagePaths.push(i);
                });
                break;
            }
            case UPLOAD_IMAGES_FAILURE: {
                break;
            }
            case REMOVE_POST_REQUEST: {
                break;
            }
            case REMOVE_POST_SUCCESS: {
                const index = draft.mainPosts.findIndex(v => v.id === action.data);
                draft.mainPosts.splice(index, 1);
                break;
            }
            case REMOVE_POST_FAILURE: {
                break;
            }
            case LOAD_POST_REQUEST: {
                draft.singlePost = null
                draft.imagePaths = [];
                break;
            }
            case LOAD_POST_SUCCESS: {
                draft.singlePost = action.data;
                action.data.Images.forEach(i => {
                    draft.imagePaths.push(i.src);
                });
                break;
            }
            case LOAD_POST_FAILURE: {
                break;
            }
            case EDIT_POST_REQUEST: {
                draft.isEditedPost = false;
                break;
            }
            case EDIT_POST_SUCCESS: {
                draft.isEditedPost = true;
                break;
            }
            case EDIT_POST_FAILURE: {
                draft.isEditedPost = false;
                break;
            }
            case REMOVE_IMAGE: {
                draft.imagePaths.splice(action.index, 1);
            }
            default: {
                break;
            }
        }
    });
}

export default reducer;