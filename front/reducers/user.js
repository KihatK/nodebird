import produce from 'immer';

export const initialState = {
    me: null,
    followingList: [],
    followerList: [],
    isLoggingIn: false,
    isSigningUp: false,
    signupMessage: '',
    userInfo: null,
    hasMoreFollowings: true,
    hasMoreFollowers: true,
    removedFollowing: false,
    removedFollower: false,
    editedNickname: false,
    editingError: '',
};

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

export const FOLLOW_USER_REQUEST = 'FOLLOW_USER_REQUEST';
export const FOLLOW_USER_SUCCESS = 'FOLLOW_USER_SUCCESS';
export const FOLLOW_USER_FAILURE = 'FOLLOW_USER_FAILURE';

export const UNFOLLOW_USER_REQUEST = 'UNFOLLOW_USER_REQUEST';
export const UNFOLLOW_USER_SUCCESS = 'UNFOLLOW_USER_SUCCESS';
export const UNFOLLOW_USER_FAILURE = 'UNFOLLOW_USER_FAILURE';

export const LOAD_FOLLOWERS_REQUEST = 'LOAD_FOLLOWERS_REQUEST';
export const LOAD_FOLLOWERS_SUCCESS = 'LOAD_FOLLOWERS_SUCCESS';
export const LOAD_FOLLOWERS_FAILURE = 'LOAD_FOLLOWERS_FAILURE';

export const LOAD_FOLLOWINGS_REQUEST = 'LOAD_FOLLOWINGS_REQUEST';
export const LOAD_FOLLOWINGS_SUCCESS = 'LOAD_FOLLOWINGS_SUCCESS';
export const LOAD_FOLLOWINGS_FAILURE = 'LOAD_FOLLOWINGS_FAILURE';

export const REMOVE_FOLLOWER_REQUEST = 'REMOVE_FOLLOWER_REQUEST';
export const REMOVE_FOLLOWER_SUCCESS = 'REMOVE_FOLLOWER_SUCCESS';
export const REMOVE_FOLLOWER_FAILURE = 'REMOVE_FOLLOWER_FAILURE';

export const EDIT_NICKNAME_REQUEST = 'EDIT_NICKNAME_REQUEST';
export const EDIT_NICKNAME_SUCCESS = 'EDIT_NICKNAME_SUCCESS';
export const EDIT_NICKNAME_FAILURE = 'EDIT_NICKNAME_FAILURE';

export const ADD_POST_OF_ME = 'ADD_POST_OF_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

const reducer = (state=initialState, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case LOG_IN_REQUEST: {
                draft.isLoggingIn = true;
                break;
            }
            case LOG_IN_SUCCESS: {
                draft.isLoggingIn = false;
                draft.me = action.data;
                break;
            }
            case LOG_IN_FAILURE: {
                draft.isLoggingIn = false;
                break;
            }
            case LOG_OUT_REQUEST: {
                break;
            }
            case LOG_OUT_SUCCESS: {
                draft.me = null;
                break;
            }
            case LOG_OUT_FAILURE: {
                break;
            }
            case SIGN_UP_REQUEST: {
                draft.isSigningUp = true;
                draft.signupMessage = '';
                break;
            }
            case SIGN_UP_SUCCESS: {
                draft.isSigningUp = false;
                draft.signupMessage = action.data;
                break;
            }
            case SIGN_UP_FAILURE: {
                draft.isSigningUp = false;
                draft.signupMessage = action.error;
                break;
            }
            case LOAD_USER_REQUEST: {
                break;
            }
            case LOAD_USER_SUCCESS: {
                if (action.me) {
                    draft.me = action.data;
                    break;
                }
                draft.userInfo = action.data;
                break;
            }
            case LOAD_USER_FAILURE: {
                break;
            }
            case FOLLOW_USER_REQUEST: {
                break;
            }
            case FOLLOW_USER_SUCCESS: {
                draft.me.Followings.unshift({ id: action.data });
                draft.followingList.unshift({ id: action.data });
                break;
            }
            case FOLLOW_USER_FAILURE: {
                break;
            }
            case UNFOLLOW_USER_REQUEST: {
                draft.removedFollowing = false;
                break;
            }
            case UNFOLLOW_USER_SUCCESS: {
                const index = draft.me.Followings.findIndex(v => v.id === action.data);
                draft.me.Followings.splice(index, 1);
                const index2 = draft.followingList.findIndex(v => v.id === action.data);
                draft.followingList.splice(index2, 1);
                draft.removedFollowing = true;
                break;
            }
            case UNFOLLOW_USER_FAILURE: {
                draft.removedFollowing = false;
                break;
            }
            case ADD_POST_OF_ME: {  
                draft.me.Posts.push({ id: action.data });
                draft.me.Posts.push({ id: action.data });
            }
            case REMOVE_POST_OF_ME: {
                const index = draft.me.Posts.findIndex(v => v.id === action.data);
                draft.me.Posts.splice(index, 1);
            }
            case LOAD_FOLLOWERS_REQUEST: {
                draft.followerList = action.offset ? draft.followerList : [];
                draft.hasMoreFollowers = action.offset ? draft.hasMoreFollowers : true;
                break;
            }
            case LOAD_FOLLOWERS_SUCCESS: {
                action.data.forEach(user => {
                    draft.followerList.push(user);
                });
                draft.hasMoreFollowers = action.data.length === 3;
                break;
            }
            case LOAD_FOLLOWERS_FAILURE: {
                break;
            }
            case LOAD_FOLLOWINGS_REQUEST: {
                draft.followingList = action.offset ? draft.followingList : [];
                draft.hasMoreFollowings = action.offset ? draft.hasMoreFollowings : true;
                break;
            }
            case LOAD_FOLLOWINGS_SUCCESS: {
                action.data.forEach(user => {
                    draft.followingList.push(user);
                });
                draft.hasMoreFollowings = action.data.length === 3;
                break;
            }
            case LOAD_FOLLOWINGS_FAILURE: {
                break;
            }
            case REMOVE_FOLLOWER_REQUEST: {
                draft.removedFollower = false;
                break;
            }
            case REMOVE_FOLLOWER_SUCCESS: {
                const index = draft.me.Followers.findIndex(v => v.id === action.data);
                draft.me.Followers.splice(index, 1);
                const index2 = draft.followerList.findIndex(v => v.id === action.data);
                draft.followerList.splice(index2, 1);
                draft.removedFollower = true;
                break;
            }
            case REMOVE_FOLLOWER_FAILURE: {
                draft.removedFollower = false;
                break;
            }
            case EDIT_NICKNAME_REQUEST: {
                draft.editedNickname = false;
                draft.editingError = '';
                break;
            }
            case EDIT_NICKNAME_SUCCESS: {
                draft.me.nickname = action.data;
                draft.editedNickname = true;
                break;
            }
            case EDIT_NICKNAME_FAILURE: {
                draft.editedNickname = true;
                draft.editingError = action.error;
                break;
            }
            default: {
                break;
            }
        }
    });
}

export default reducer;