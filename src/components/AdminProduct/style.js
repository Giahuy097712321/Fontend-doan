// style.js
import styled from "styled-components";
import { Upload } from 'antd';

export const WrapperHeader = styled.h1`
    color: #333;
    font-size: 22px;
    margin-bottom: 24px;
    font-weight: bold;
`;

export const InfoCardContainer = styled.div`
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 24px;
`;

export const InfoCard = styled.div`
    flex: 1 1 20%;
    background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.15);
    }
`;

export const InfoLabel = styled.div`
    font-size: 14px;
    color: #555;
    margin-bottom: 8px;
`;

export const InfoNumber = styled.div`
    font-size: 20px;
    font-weight: bold;
    color: #222;
`;

export const ChartContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
`;

export const ChartCard = styled.div`
    flex: 1 1 45%;
    background: #fff;
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.15);
    }
`;

export const ChartTitle = styled.h3`
    text-align: center;
    margin-bottom: 16px;
    font-weight: bold;
`;

export const TableWrapper = styled.div`
    background: #fff;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
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