// style.js
import styled from "styled-components";
import { Upload } from 'antd';

export const WrapperHeader = styled.h1`
    color: #333;
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
`;

export const WrapperUploadFile = styled(Upload)`
    & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 1px dashed #1890ff;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
    }
    &:hover .ant-upload.ant-upload-select-picture-card {
        border-color: #40a9ff;
        background: #e6f7ff;
    }
`;

export const WrapperButtonAdd = styled.button`
    width: 150px;
    height: 150px;
    border: 2px dashed #1890ff;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 60px;
    color: #1890ff;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
        background-color: #e6f7ff;
        transform: scale(1.05);
    }
`;
