import React from 'react';
import { List } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import { ListStyle, LoadMoreBtn, CardStyle, CardMetaStyle } from './style/FollowListStyle';

const FollowList = ({ header, hasMore, clickMore, data, clickRemove }) => {
    return (
        <ListStyle
            header={<div>{header}</div>}
            loadMore={hasMore && <LoadMoreBtn onClick={clickMore}>더보기</LoadMoreBtn>}
            bordered
            grid={{ gutter: 4, xs: 2, md: 3 }}
            dataSource={data || []}
            renderItem={item => (
                <List.Item>
                    <CardStyle
                        actions={[
                            <StopOutlined onClick={clickRemove(item.id)} />
                        ]}
                    >
                        <CardMetaStyle description={item.nickname} />
                    </CardStyle>
                </List.Item>
            )}
        />
    );
}

FollowList.propTypes = {
    header: PropTypes.string.isRequired,
    hasMore: PropTypes.bool.isRequired,
    clickMore: PropTypes.func.isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    clickRemove: PropTypes.func.isRequired,
};

export default FollowList;