import React, { useState, useCallback } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import ImagesZoom from './ImagesZoom';
import { PostCardImageDiv } from './style/PostCardImagesStyle';

const PostCardImages = ({ images }) => {
    const [showImagesZoom, setShowImagesZoom] = useState(false);

    const onZoom = useCallback(() => {
        setShowImagesZoom(true);
    }, []);
    const onClose = useCallback(() => {
        setShowImagesZoom(false);
    }, []);

    if (images.length === 1) {
        return (
            <>
                <div>
                    <img src={`http://localhost:3065/${images[0].src}`} alt={images[0].src} width="100%" onClick={onZoom} />
                </div>
                {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
            </>
        );
    }
    else if (images.length === 2) {
        return (
            <>
                <div>
                    <img src={`http://localhost:3065/${images[0].src}`} alt={images[0].src} width="50%" onClick={onZoom} />
                    <img src={`http://localhost:3065/${images[1].src}`} alt={images[1].src} width="50%" onClick={onZoom}/>
                </div>
                {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
            </>
        );
    }
    else {
        return (
            <>
                <div>
                    <img src={`http://localhost:3065/${images[0].src}`} alt={images[0].src} width="50%" onClick={onZoom} />
                    <PostCardImageDiv onClick={onZoom}>
                        <PlusOutlined />
                        <br />
                        {`${images.length - 1}개의 사진 더보기`}
                    </PostCardImageDiv>
                    {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
                </div>
            </>
        );
    }
}

PostCardImages.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape({
        src: PropTypes.string,
    })).isRequired,
};

export default PostCardImages;