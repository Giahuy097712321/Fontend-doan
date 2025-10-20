import styled from "styled-components";
import { Upload, Button } from 'antd';

/* Header lớn, nổi bật */
export const WrapperHeader = styled.h1`
    color: #0052cc;
    font-size: 36px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 30px;
    text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
`;

/* Button tạo sản phẩm */
export const WrapperAddButton = styled(Button)`
    width: 150px;
    height: 150px;
    border: 3px dashed #0052cc;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 60px;
    color: #0052cc;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
        background-color: #e6f0ff;
        transform: scale(1.1);
    }
`;

/* Upload avatar/ảnh sản phẩm */
export const WrapperUploadFile = styled(Upload)`
    & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
        width: 100px;
        height: 100px;
        border-radius: 12px;
        border: 2px dashed #0052cc;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
    }
    &:hover .ant-upload.ant-upload-select-picture-card {
        border-color: #1890ff;
        background: #f0f5ff;
    }
    img {
        border-radius: 12px;
        object-fit: cover;
        width: 100px;
        height: 100px;
        margin-left: 10px;
    }
`;

/* Bảng sản phẩm */
export const WrapperTable = styled.div`
    margin-top: 20px;
    .ant-table-thead > tr > th {
        background-color: #f0f5ff;
        font-weight: 600;
        color: #0052cc;
        font-size: 16px;
    }
    .ant-table-tbody > tr:hover > td {
        background-color: #e6f7ff;
        transition: all 0.2s;
    }
`;

/* Modal và Drawer header */
export const WrapperModalTitle = styled.div`
    font-size: 22px;
    font-weight: 700;
    color: #0052cc;
`;

/* Các input trong form */
export const WrapperFormItem = styled.div`
    margin-bottom: 18px;
    .ant-input, .ant-input-number, .ant-select-selector {
        border-radius: 12px;
        border: 1.5px solid #0052cc;
        transition: all 0.3s;
        &:focus, &:hover {
            border-color: #1890ff;
            box-shadow: 0 0 5px rgba(24,144,255,0.3);
        }
    }
`;

/* Button submit trong form */
export const WrapperSubmitButton = styled(Button)`
    background-color: #0052cc;
    border-color: #0052cc;
    color: #fff;
    font-weight: 600;
    border-radius: 12px;
    width: 100%;
    height: 45px;
    font-size: 16px;
    transition: all 0.3s;
    &:hover {
        background-color: #1890ff;
        border-color: #1890ff;
        color: #fff;
    }
`;

/* Drawer Footer Button */
export const WrapperDrawerFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    gap: 10px;
`;
