import React from 'react';

const ImageCell = (params) => (
    <div
        className="image-cell"
        style={{
            backgroundImage: `url(${params.value})`,
            backgroundColor: '#f0f0f0',
        }}
    />
);

export default ImageCell;
