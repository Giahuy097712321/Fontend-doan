// src/components/CustomCommentComponent/style.js
import { styled } from 'styled-components';
import { Empty, Pagination, Tag, Divider } from 'antd';

export const CommentSection = styled.div`
  padding: 0;
`;

export const RatingSummary = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  .rating-overview {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 24px;
    }
  }

  .average-rating {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-width: 180px;

    .rating-score {
      font-size: 56px;
      font-weight: 700;
      line-height: 1;
      margin-bottom: 8px;
      
      .rating-max {
        font-size: 20px;
        opacity: 0.8;
        margin-left: 4px;
      }
    }

    .rating-stars {
      margin-bottom: 8px;
      
      .ant-rate {
        font-size: 24px;
        
        .ant-rate-star {
          margin-inline-end: 4px;
          color: #ffd666;
        }
      }
    }

    .rating-count {
      font-size: 14px;
      opacity: 0.9;
      font-weight: 500;
    }
  }
`;

export const RatingStats = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
`;

export const StarProgress = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  
  .star-info {
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 60px;
    
    .star-number {
      font-weight: 600;
      font-size: 14px;
    }
    
    .star-icon {
      color: #ffd666;
      font-size: 14px;
    }
  }
  
  .progress-container {
    flex: 1;
    height: 8px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    
    .progress-bar {
      height: 100%;
      background: #ffd666;
      border-radius: 4px;
      transition: width 0.3s ease;
      box-shadow: 0 2px 8px rgba(255, 214, 102, 0.3);
    }
  }
  
  .star-count {
    font-size: 14px;
    font-weight: 600;
    min-width: 30px;
    text-align: right;
  }
`;

export const CommentForm = styled.div`
  background: #fff;
  border: 1px solid #e8f4fd;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  .form-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    
    h3 {
      color: #1890ff;
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .editing-tag {
      margin: 0;
    }
  }

  .rating-input {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    
    .rating-label {
      font-weight: 500;
      color: #333;
    }
    
    .rating-stars-input {
      font-size: 24px;
      
      .ant-rate-star {
        margin-inline-end: 4px;
      }
    }
    
    .rating-value {
      color: #ff6b35;
      font-weight: 600;
    }
  }

  .comment-textarea {
    border-radius: 8px;
    border: 1px solid #e8e8e8;
    resize: vertical;
    
    &:hover, &:focus {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
    }
    
    &::placeholder {
      color: #999;
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
    
    .cancel-btn {
      border-radius: 6px;
      font-weight: 500;
    }
    
    .submit-btn {
      border-radius: 6px;
      font-weight: 500;
      background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
      border: none;
      box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
      
      &:hover {
        background: linear-gradient(135deg, #096dd9 0%, #0050b3 100%);
        box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
      }
    }
  }
`;

export const CommentList = styled.div`
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`;

export const CommentHeader = styled.div`
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #e8e8e8;
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
    }
    
    h3 {
      color: #333;
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      
      .comment-count {
        color: #1890ff;
        font-weight: 700;
      }
    }
    
    .sort-options {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .sort-label {
        color: #666;
        font-size: 14px;
      }
    }
  }
`;

export const CommentItem = styled.div`
  display: flex;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.2s;
  
  &:hover {
    background: #fafafa;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  .comment-avatar {
    .avatar {
      border: 2px solid #e8f4fd;
    }
  }
  
  .comment-content {
    flex: 1;
  }
`;

export const CommentMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 8px;
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    
    .user-name {
      font-weight: 600;
      color: #333;
      font-size: 16px;
    }
    
    .comment-rating {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .rating-text {
        color: #ff6b35;
        font-weight: 500;
        font-size: 13px;
      }
    }
  }
  
  .comment-time {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #999;
    font-size: 12px;
    
    .edited-indicator {
      color: #ffa940;
      font-style: italic;
    }
  }
`;

export const UserBadge = styled.div`
  span {
    background: linear-gradient(135deg, #ffa940 0%, #ff7a45 100%);
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
  }
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
  
  &:hover {
    background: #f0f0f0;
    color: #1890ff;
  }
  
  &.liked {
    color: #1890ff;
    background: #e6f7ff;
  }
  
  &.edit-btn:hover {
    color: #52c41a;
    background: #f6ffed;
  }
  
  &.delete-btn:hover {
    color: #ff4d4f;
    background: #fff2f0;
  }
`;

export const EmptyComments = styled.div`
  padding: 60px 24px;
  text-align: center;
  
  .ant-empty {
    .ant-empty-image {
      height: 100px;
      margin-bottom: 16px;
    }
  }
`;

export const LoadingContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
  
  .ant-spin {
    .ant-spin-dot {
      font-size: 32px;
      
      .ant-spin-dot-item {
        background-color: #1890ff;
      }
    }
  }
  
  p {
    margin-top: 16px;
    color: #666;
  }
`;