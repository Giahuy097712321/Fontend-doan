import styled from "styled-components";
import { Upload } from 'antd';

// Header trang
export const WrapperHeader = styled.h1`
  color: #1f2937; // màu tối, rõ ràng
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
`;

// Upload file ảnh
export const WrapperUploadFile = styled(Upload)`
  & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 2px dashed #d1d5db;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    &:hover {
      border-color: #2563eb;
      background-color: #f0f9ff;
    }
  }
`;

// Button thêm sản phẩm nổi bật
export const WrapperAddButton = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  button {
    width: 150px;
    height: 150px;
    border-radius: 12px;
    border: 2px dashed #9ca3af;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 60px;
    color: #2563eb;
    transition: all 0.3s ease;
    &:hover {
      background-color: #e0f2fe;
      border-color: #3b82f6;
      color: #1e40af;
    }
  }
`;

// Table wrapper
export const WrapperTable = styled.div`
  margin-top: 20px;

  .ant-table-thead > tr > th {
    background: #f5f5f5;
    font-weight: 600;
  }

  .ant-table-tbody > tr:hover {
    background-color: #e6f7ff;
  }

  .ant-checkbox-wrapper {
    margin-right: 8px;
  }
`;


// Drawer content wrapper
export const WrapperDrawerContent = styled.div`
  padding: 20px;
  form {
    .ant-form-item {
      margin-bottom: 16px;
    }
    button {
      width: 100px;
    }
  }
`;

// Modal xóa sản phẩm
export const WrapperModalDelete = styled.div`
  text-align: center;
  font-size: 16px;
  color: #ef4444; // đỏ nổi bật
  padding: 20px 0;
`;

// Action buttons (Edit/Delete) trong Table
export const WrapperActionButtons = styled.div`
  display: flex;
  gap: 12px;
  .edit-icon, .delete-icon {
    font-size: 24px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .edit-icon:hover {
    color: #f59e0b; // vàng nổi bật
  }
  .delete-icon:hover {
    color: #dc2626; // đỏ nổi bật
  }
`
    ;
