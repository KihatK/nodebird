import React, { useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import PostCard from '../containers/PostCard';
import PostForm from '../containers/PostForm';
import { LOAD_MAIN_POSTS_REQUEST } from '../reducers/post';

const Home = () => {
    const dispatch = useDispatch();
    const id = useSelector(state => state.user.me && state.user.me.id);
    const { mainPosts, hasMorePosts } = useSelector(state => state.post);

    const countRef = useRef([]);

    const onScroll = useCallback(() => {
        if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
            if (hasMorePosts) {
                const lastId = mainPosts[mainPosts.length - 1].id;
                if (!countRef.current.includes(lastId)) {
                    dispatch({
                        type: LOAD_MAIN_POSTS_REQUEST,
                        lastId,
                    });
                    countRef.current.push(lastId);
                }
            }
        }
    }, [mainPosts.length, hasMorePosts]);

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        }
    }, [mainPosts.length, hasMorePosts]);

    return (
        <>
            {id && <PostForm />}
            {mainPosts.map(v => <PostCard key={v.id} post={v} />)}
        </>
    );
}

Home.getInitialProps = (context) => {
    context.store.dispatch({
        type: LOAD_MAIN_POSTS_REQUEST
    });
}

export default Home;