// src/components/ChatComponent/style.js
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const ping = keyframes`
  0% { transform: scale(1); opacity: 1; }
  75%, 100% { transform: scale(2); opacity: 0; }
`;

export const ChatToggle = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(24, 144, 255, 0.6);
  }

  &.has-unread {
    animation: ${pulse} 2s infinite;
  }

  .chat-toggle-content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chat-icon {
    font-size: 20px;
    color: #fff;
  }

  .unread-badge {
    .ant-badge-count {
      background: #ff4d4f;
      box-shadow: 0 0 0 2px #fff;
      font-size: 10px;
      font-weight: 600;
      min-width: 18px;
      height: 18px;
      line-height: 18px;
    }
  }

  .unread-pulse {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 20px;
    height: 20px;
    background: #ff4d4f;
    border-radius: 50%;
    animation: ${ping} 1.5s infinite;
  }

  @media (max-width: 768px) {
    bottom: 15px;
    right: 15px;
    width: 50px;
    height: 50px;
  }
`;

export const ChatContainer = styled.div`
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  border: 1px solid #f0f0f0;

  @media (max-width: 768px) {
    width: 300px;
    height: 400px;
    right: 10px;
    bottom: 80px;
  }
`;

export const ChatHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
  border-radius: 12px 12px 0 0;

  .chat-info {
    display: flex;
    align-items: center;
    gap: 8px;

    .user-details {
      display: flex;
      flex-direction: column;
      
      .admin-name {
        font-weight: 600;
        color: #262626;
        font-size: 14px;
      }
    }
  }

  .header-actions {
    .header-badge {
      .ant-badge-count {
        background: #ff4d4f;
        font-size: 10px;
        min-width: 16px;
        height: 16px;
        line-height: 16px;
      }
    }
  }

  .close-btn {
    color: #666;
    
    &:hover {
      color: #ff4d4f;
    }
  }
`;

export const ChatMessages = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #fafafa;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 2px;
  }
`;

export const MessageItem = styled.div`
  display: flex;
  justify-content: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .message-content {
    max-width: 80%;
    background: ${props => props.isOwn ? '#1890ff' : 'white'};
    color: ${props => props.isOwn ? 'white' : '#262626'};
    padding: 8px 12px;
    border-radius: 12px;
    word-wrap: break-word;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    opacity: ${props => props.isTemp ? 0.7 : 1};
    border: ${props => props.isOwn ? 'none' : '1px solid #f0f0f0'};

    .message-text {
      margin-bottom: 4px;
      line-height: 1.4;
    }

    .message-time {
      font-size: 10px;
      opacity: 0.7;
      text-align: right;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 4px;
      
      .sending-indicator {
        font-style: italic;
        font-size: 9px;
      }
    }
  }
`;

export const MessageInput = styled.div`
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 8px;
  align-items: flex-end;
  background: white;

  .message-textarea {
    flex: 1;
    
    textarea {
      border-radius: 6px;
      resize: none;
      border: 1px solid #e8e8e8;
      
      &:focus {
        border-color: #1890ff;
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
      }
    }
  }

  .send-btn {
    height: auto;
    border-radius: 6px;
  }
`;

export const EmptyChat = styled.div`
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
`;