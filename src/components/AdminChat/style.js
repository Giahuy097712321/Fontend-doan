// styled components - file style.js
import styled from 'styled-components';

export const AdminChatContainer = styled.div`
  height: 100%;
  
  .ant-card-body {
    height: 100%;
    padding: 0;
  }

  .chat-layout {
    display: flex;
    height: 550px;
    border-radius: 8px;
    overflow: hidden;
  }
`;

export const UsersList = styled.div`
  width: 350px;
  background: #fafafa;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  
  .users-header {
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    background: white;
    
    h4 {
      margin: 0 0 8px 0;
      color: #262626;
      font-weight: 600;
    }
    
    .conversation-stats {
      .unread-total {
        font-size: 12px;
        color: #ff4d4f;
        font-weight: 500;
        background: #fff2f0;
        padding: 2px 8px;
        border-radius: 10px;
        border: 1px solid #ffccc7;
      }
    }
  }
  
  .ant-list {
    flex: 1;
    overflow-y: auto;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
      
      &:hover {
        background: #a8a8a8;
      }
    }
  }
`;

export const UserItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  background: ${props => props.isSelected ? '#e6f7ff' : 'transparent'};
  border-left: 3px solid ${props => props.isSelected ? '#1890ff' : 'transparent'};
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: ${props => props.isSelected ? '#e6f7ff' : '#f5f5f5'};
    transform: translateX(2px);
  }

  .user-info {
    flex: 1;
    min-width: 0;
    
    .user-name {
      font-weight: 500;
      color: #262626;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
      
      .unread-indicator {
        width: 8px;
        height: 8px;
        background: #ff4d4f;
        border-radius: 50%;
        display: inline-block;
        animation: pulse 2s infinite;
      }
    }
    
    .last-message {
      font-size: 12px;
      color: #666;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 2px;
    }
    
    .message-time {
      font-size: 11px;
      color: #999;
    }
  }

  .unread-badge {
    .ant-badge-count {
      background: #ff4d4f;
      font-size: 10px;
      min-width: 18px;
      height: 18px;
      line-height: 18px;
      box-shadow: 0 0 0 1px #fff;
    }
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;

export const ChatPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
`;

export const ChatHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  
  .user-details {
    flex: 1;
    
    .user-name {
      font-weight: 600;
      color: #262626;
      font-size: 16px;
    }
    
    .user-id {
      font-size: 12px;
      color: #999;
      margin-top: 2px;
    }
  }
  
  .chat-actions {
    margin-left: auto;
  }
`;

export const ChatMessages = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  position: relative;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
    
    &:hover {
      background: #a8a8a8;
    }
  }
  
  .messages-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .no-messages {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #666;
    text-align: center;
    
    p {
      margin: 4px 0;
      font-weight: 500;
    }
    
    span {
      font-size: 12px;
    }
  }
`;

export const MessageItem = styled.div`
  display: flex;
  justify-content: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  animation: ${props => props.isTemp ? 'pulse 2s infinite' : 'fadeIn 0.3s ease'};

  .message-content {
    max-width: 70%;
    background: ${props => props.isOwn ? '#1890ff' : 'white'};
    color: ${props => props.isOwn ? 'white' : '#262626'};
    padding: 10px 14px;
    border-radius: 16px;
    word-wrap: break-word;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: ${props => props.isTemp ? '1px dashed #d9d9d9' : 'none'};
    opacity: ${props => props.isTemp ? 0.8 : 1};

    .message-text {
      margin-bottom: 6px;
      line-height: 1.4;
      white-space: pre-wrap;
    }

    .message-time {
      font-size: 11px;
      opacity: 0.8;
      text-align: right;
      display: flex;
      align-items: center;
      gap: 4px;
      justify-content: flex-end;
      
      .sending-indicator {
        font-style: italic;
        opacity: 0.7;
      }
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const MessageInput = styled.div`
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 12px;
  align-items: flex-end;
  background: white;

  .ant-input {
    flex: 1;
    
    textarea {
      resize: none;
    }
  }
`;

export const NoChatSelected = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  text-align: center;
  padding: 40px;

  h3 {
    margin: 16px 0 8px 0;
    color: #262626;
    font-weight: 600;
  }

  p {
    margin-bottom: 24px;
    color: #666;
    max-width: 300px;
    line-height: 1.5;
  }

  .stats {
    display: flex;
    gap: 32px;
    margin-top: 24px;
    
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .stat-number {
        font-size: 24px;
        font-weight: 700;
        color: #1890ff;
        margin-bottom: 4px;
      }
      
      .stat-label {
        font-size: 12px;
        color: #666;
      }
    }
  }
`;