import React, { useEffect, useRef } from 'react';

const LikeButtonComponent = ({ datailref, layout = "standard", size = "small" }) => {
    const likeRef = useRef(null);

    useEffect(() => {
        if (window.FB && likeRef.current) {
            window.FB.XFBML.parse(likeRef.current); // parse lại khi URL hoặc component thay đổi
        }
    }, [datailref, layout, size]);

    return (
        <div
            ref={likeRef}
            style={{
                margin: '16px 0',
                padding: '12px',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                backgroundColor: '#fafafa',
                maxWidth: '100%',
            }}
        >
            <div
                className="fb-like"
                data-href={datailref}
                data-width=""
                data-layout={layout}
                data-action="like"
                data-size={size}
                data-share="true"
            ></div>
        </div>
    );
};

export default LikeButtonComponent;
