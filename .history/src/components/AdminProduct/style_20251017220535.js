// style.js
import styled from "styled-components";
import { Upload, Button } from 'antd';

/* Header lớn, nổi bật */
export const WrapperHeader = styled.h1`
    color: #1890ff; // màu xanh nổi bật
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 20px;
`;

/* Upload avatar/ảnh sản phẩm */
export const WrapperUploadFile = styled(Upload)`
    & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
        width: 80px;
        height: 80px;
        border-radius: 10px;
        border: 2px dashed #1890ff;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
    }
    &:hover .ant-upload.ant-upload-select-picture-card {
        border-color: #40a9ff;
        background: #e6f7ff;
    }
    img {
        border-radius: 10px;
        object-fit: cover;
        width: 80px;
        height: 80px;
        margin-left: 10px;
    }
`;

/* Button tạo sản phẩm */
export const WrapperAddButton = styled(Button)`
    width: 150px;
    height: 150px;
    border: 2px dashed #1890ff;
    border-radius: 12px;
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

/* Bảng sản phẩm */
export const WrapperTable = styled.div`
    margin-top: 20px;
    .ant-table-thead > tr > th {
        background-color: #f0f5ff;
        font-weight: 600;
    }
    .ant-table-tbody > tr:hover > td {
        background-color: #e6f7ff;
    }
`;

/* Modal và Drawer header */
export const WrapperModalTitle = styled.div`
    font-size: 20px;
    font-weight: 600;
    color: #1890ff;
`;

/* Các input trong form */
export const WrapperFormItem = styled.div`
    margin-bottom: 15px;
    .ant-input {
        border-radius: 8px;
        border: 1.5px solid #1890ff;
    }
`;

/* Button submit trong form */
export const WrapperSubmitButton = styled(Button)`
    background-color: #1890ff;
    border-color: #1890ff;
    color: #fff;
    font-weight: 600;
    border-radius: 8px;
    width: 100%;
    &:hover {
        background-color: #40a9ff;
        border-color: #40a9ff;
        color: #fff;
    }
`;
