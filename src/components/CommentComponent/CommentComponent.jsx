import React, { useEffect, useRef } from 'react';
import { WrapperComment } from './style';

const CommentComponent = ({ datainer, width = "100%", numPosts = 5 }) => {
    const commentRef = useRef(null);

    useEffect(() => {
        // Đợi một chút để đảm bảo DOM đã render xong
        const timer = setTimeout(() => {
            if (window.FB && commentRef.current) {
                window.FB.XFBML.parse(commentRef.current);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [datainer, width, numPosts]);

    return (
        <div style={{ marginTop: '30px' }}>
            <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                color: '#333',
                paddingLeft: '8px'
            }}>
                Đánh giá & Bình luận
            </h3>
            <WrapperComment ref={commentRef}>
                <div
                    className="fb-comments"
                    data-href={datainer}
                    data-width={width}
                    data-numposts={numPosts}
                    data-order-by="reverse_time"
                    data-colorscheme="light"
                ></div>
            </WrapperComment>
        </div>
    );
};

export default CommentComponent;