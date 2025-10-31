// style.js
import styled from "styled-components";
import { Upload } from 'antd';

export const DashboardContainer = styled.div`
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
`;

export const WrapperHeader = styled.h1`
  color: #1f2937;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const StatsContainer = styled.div`
  margin-bottom: 32px;
  
  .ant-card {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: none;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
  }
  
  .ant-statistic-title {
    font-size: 14px;
    color: #666;
    font-weight: 500;
  }
  
  .ant-statistic-content {
    font-size: 24px;
    font-weight: 600;
  }
`;

export const ChartGrid = styled.div`
  margin-bottom: 32px;
`;

export const ChartCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: none;
  height: 100%;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

export const ChartTitle = styled.h3`
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 12px;
`;

export const TableWrapper = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  .ant-table-thead > tr > th {
    background: #f8f9fa;
    font-weight: 600;
    color: #1f2937;
    border-bottom: 2px solid #e5e7eb;
  }
  
  .ant-table-tbody > tr:hover > td {
    background-color: #f0f9ff !important;
  }
  
  .ant-table-container {
    border-radius: 8px;
    overflow: hidden;
  }
  
  .ant-pagination {
    margin-top: 20px;
  }
`;

export const WrapperUploadFile = styled(Upload)`
  & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    border: 2px dashed #d1d5db;
    background: #fafafa;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #1890ff;
      background: #f0f9ff;
    }
  }
  
  .ant-upload-list-item-container {
    display: none;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  
  .ant-btn {
    border-radius: 6px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

// Responsive adjustments
export const ResponsiveStyles = styled.div`
  @media (max-width: 768px) {
    ${DashboardContainer} {
      padding: 16px;
    }
    
    ${WrapperHeader} {
      font-size: 24px;
    }
    
    ${ChartCard} {
      padding: 16px;
    }
    
    ${TableWrapper} {
      padding: 16px;
      overflow-x: auto;
    }
    
    .ant-table-wrapper {
      overflow-x: auto;
    }
  }
  
  @media (max-width: 576px) {
    ${StatsContainer} {
      .ant-col {
        margin-bottom: 16px;
      }
    }
    
    ${ActionButtons} {
      flex-direction: column;
      gap: 4px;
    }
  }
`;