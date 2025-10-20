import styled from 'styled-components';
// Thêm vào file style.js
export const WrapperComment = styled.div`
    margin-top: 24px;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    max-width: 100%;
    min-height: 500px;
    overflow: hidden;
    
    .fb-comments {
        width: 100% !important;
        
        span {
            width: 100% !important;
        }
        
        iframe {
            width: 100% !important;
        }
    }
`;