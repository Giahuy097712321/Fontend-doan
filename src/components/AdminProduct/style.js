// style.js
import styled from "styled-components";
import { Upload } from 'antd';

// Header trang
export const WrapperHeader = styled.h1`
  color: #1f2937;
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

// Container cho các card thông tin
export const InfoCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
`;

export const InfoCard = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  border: 1px solid #e8e8e8;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const InfoNumber = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 8px;
`;

export const InfoLabel = styled.div`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

// Container cho biểu đồ
export const ChartContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  justify-content: center;
`;

export const ChartCard = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8e8e8;
  min-width: 350px;
`;

export const ChartTitle = styled.h3`
  text-align: center;
  margin-bottom: 15px;
  color: #333;
  font-weight: 600;
`;

// Table wrapper
export const TableWrapper = styled.div`
  margin-top: 20px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

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

// Button thêm sản phẩm (giữ lại nhưng không dùng trong layout mới)
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