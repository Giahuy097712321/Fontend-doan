// style.js
import styled from "styled-components";
import { Upload } from "antd";

export const WrapperHeader = styled.div`
    color: #000;
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
`;

export const WrapperContentProfile = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 24px;
`;

export const WrapperLabel = styled.label`
    color: #000;
    font-size: 14px;
    font-weight: 600;
    width: 120px;
    text-align: left;
    display: flex;
    align-items: center;
    min-width: 120px;
`;

export const WrapperInput = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
`;

export const WrapperUploadFile = styled(Upload)`
    & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: none;
        background: transparent;
    }
    & .ant-upload-list-item-info {
        display: none;
    }
    
    .ant-upload-list-item {
        display: none !important;
    }
     `   