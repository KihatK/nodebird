import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const PostCardContent = ({ content }) => {
    return (
        <>
            {content.split(/(#[^\s]+)/g).map(v => {
                if (v.match(/#[^\s]+/)) {
                    return (
                        <Link href="/hashtag/[tag]" as={`/hashtag/${v.slice(1)}`} key={v}>
                            <a>{v}</a>
                        </Link>
                    );
                }
                return v;
            })}
        </>
    );
};

PostCardContent.propTypes = {
    content: PropTypes.string.isRequired,
};

export default PostCardContent;