import React from 'react';
import { List, Comment, Avatar } from 'antd';
import PropTypes from 'prop-types';

const CommentList = ({ post }) => {
    return (
        <List
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments || []}
            renderItem={item => (
                <li>
                    <Comment
                        author={item.User.nickname}
                        avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                        content={item.content}
                    />
                </li>
            )}
        />
    )
}

CommentList.propTypes = {
    post: PropTypes.object.isRequired,
};

export default CommentList;