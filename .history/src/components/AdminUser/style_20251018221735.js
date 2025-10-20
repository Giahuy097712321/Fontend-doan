// AdminUser/style.js
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
    color: #333;
  }

  .ant-table-tbody > tr:hover {
    background-color: #e6f7ff;
  }

  .ant-checkbox-wrapper {
    margin-right: 8px;
  }

  .ant-table-container {
    border-radius: 8px;
    overflow: hidden;
  }
`;

// Button thêm người dùng (giữ lại nhưng không dùng trong layout mới)
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

// Modal xóa người dùng
export const WrapperModalDelete = styled.div`
  text-align: center;
  font-size: 16px;
  color: #ef4444;
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
    color: #f59e0b;
  }
  .delete-icon:hover {
    color: #dc2626;
  }
`;

// Container chính
export const PageContainer = styled.div`
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

// Button container
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  
  .ant-btn {
    border-radius: 6px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

// Responsive design
export const ResponsiveContainer = styled.div`
  @media (max-width: 768px) {
    ${InfoCardContainer} {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    
    ${ChartContainer} {
      flex-direction: column;
      align-items: center;
    }
    
    ${ChartCard} {
      min-width: 100%;
      width: 100%;
    }
    
    ${TableWrapper} {
      padding: 10px;
      overflow-x: auto;
    }
  }

  @media (max-width: 480px) {
    ${InfoCardContainer} {
      grid-template-columns: 1fr;
    }
    
    ${WrapperHeader} {
      font-size: 20px;
    }
  }
`;

// Loading container
export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

// Empty state container
export const EmptyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  flex-direction: column;
  gap: 16px;
  
  .ant-empty-description {
    color: #666;
    font-size: 16px;
  }
`;

// Form container
export const FormContainer = styled.div`
  .ant-form-item-label > label {
    font-weight: 500;
    color: #333;
  }
  
  .ant-input, .ant-select-selector {
    border-radius: 6px;
  }
  
  .ant-btn {
    border-radius: 6px;
    font-weight: 500;
  }
`;

// Modal styles
export const ModalContent = styled.div`
  .ant-modal-header {
    border-bottom: 1px solid #e8e8e8;
    border-radius: 8px 8px 0 0;
  }
  
  .ant-modal-title {
    font-weight: 600;
    color: #333;
  }
  
  .ant-modal-body {
    padding: 24px;
  }
`;

// Drawer styles
export const DrawerContent = styled.div`
  .ant-drawer-header {
    border-bottom: 1px solid #e8e8e8;
  }
  
  .ant-drawer-title {
    font-weight: 600;
    color: #333;
  }
  
  .ant-drawer-body {
    padding: 24px;
  }
`;

// Search filter styles
export const SearchFilterContainer = styled.div`
  .ant-input-search {
    border-radius: 6px;
  }
  
  .ant-input-group .ant-input {
    border-radius: 6px 0 0 6px;
  }
  
  .ant-input-search-button {
    border-radius: 0 6px 6px 0;
  }
`;

// Table action styles
export const TableActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  
  .ant-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    border-radius: 4px;
  }
`;

// Status badges
export const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  
  &.active {
    background-color: #d1fae5;
    color: #065f46;
  }
  
  &.inactive {
    background-color: #fee2e2;
    color: #991b1b;
  }
  
  &.admin {
    background-color: #dbeafe;
    color: #1e40af;
  }
  
  &.user {
    background-color: #f3e8ff;
    color: #7c3aed;
  }
`;

// Card hover effects
export const HoverCard = styled.div`
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

// Section title
export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e8e8e8;
`;

// Grid layout
export const GridLayout = styled.div`
  display: grid;
  gap: 20px;
  
  &.two-columns {
    grid-template-columns: 1fr 1fr;
  }
  
  &.three-columns {
    grid-template-columns: 1fr 1fr 1fr;
  }
  
  @media (max-width: 768px) {
    &.two-columns,
    &.three-columns {
      grid-template-columns: 1fr;
    }
  }
`;

// Utility classes
export const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FlexBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FlexEnd = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const TextCenter = styled.div`
  text-align: center;
`;

export const TextRight = styled.div`
  text-align: right;
`;

// Spacing utilities
export const Spacing = styled.div`
  margin-bottom: ${props => props.size || '16px'};
  
  &.small {
    margin-bottom: 8px;
  }
  
  &.medium {
    margin-bottom: 16px;
  }
  
  &.large {
    margin-bottom: 24px;
  }
  
  &.xlarge {
    margin-bottom: 32px;
  }
`;

export default {
  WrapperHeader,
  WrapperUploadFile,
  TableWrapper,
  InfoCardContainer,
  InfoCard,
  InfoNumber,
  InfoLabel,
  ChartContainer,
  ChartCard,
  ChartTitle,
  WrapperAddButton,
  WrapperDrawerContent,
  WrapperModalDelete,
  WrapperActionButtons,
  PageContainer,
  ButtonContainer,
  ResponsiveContainer,
  LoadingContainer,
  EmptyContainer,
  FormContainer,
  ModalContent,
  DrawerContent,
  SearchFilterContainer,
  TableActions,
  StatusBadge,
  HoverCard,
  SectionTitle,
  GridLayout,
  FlexCenter,
  FlexBetween,
  FlexEnd,
  TextCenter,
  TextRight,
  Spacing
};