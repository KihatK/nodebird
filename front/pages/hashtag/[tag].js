import React, { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';

import PostCard from '../../containers/PostCard';
import { LOAD_HASHTAG_POSTS_REQUEST } from '../../reducers/post';

const Tag = () => {
    const router = useRouter();
    const { tag } = router.query;

    const dispatch = useDispatch();
    const { mainPosts, hasMorePosts } = useSelector(state => state.post);

    const postRef = useRef(false);
    const countRef = useRef([]);

    useEffect(() => {
        if (!postRef.current) {
            postRef.current = true;
            return;
        }
        dispatch({
            type: LOAD_HASHTAG_POSTS_REQUEST,
            data: tag,
        });
    }, [tag]);

    const onScroll = useCallback(() => {
        if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
            if (hasMorePosts) {
                const lastId = mainPosts[mainPosts.length - 1].id;
                if (!countRef.current.includes(lastId)) {
                    dispatch({
                        type: LOAD_HASHTAG_POSTS_REQUEST,
                        data: tag,
                        lastId,
                    });
                    countRef.current.push(lastId);
                }
            }
        }
    }, [mainPosts.length, hasMorePosts, tag]);

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        }
    }, [mainPosts.length, hasMorePosts, tag]);

    return (
        <>
            {mainPosts.map(v => <PostCard key={v.id} post={v} />)}
        </>
    );
}

Tag.getInitialProps = (context) => {
    const { tag } = context.query;

    context.store.dispatch({
        type: LOAD_HASHTAG_POSTS_REQUEST,
        data: tag,
    });
}

export default Tag;