// src/components/AdminChat/style.js
import styled from 'styled-components';

export const AdminChatContainer = styled.div`
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;

  .chat-layout {
    display: flex;
    height: 500px;
    gap: 16px;
  }

  .ant-card-body {
    padding: 0;
  }
`;

export const UsersList = styled.div`
  width: 350px;
  background: white;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;

  .users-header {
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    background: #fafafa;

    h4 {
      margin: 0;
      color: #1890ff;
    }

    .unread-total {
      font-size: 12px;
      color: #ff4d4f;
      font-weight: 500;
    }
  }

  .ant-list {
    flex: 1;
    overflow-y: auto;
  }
`;

export const UserItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  border-bottom: 1px solid #f0f0f0;
  background: ${props => props.isSelected ? '#e6f7ff' : 'white'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  position: relative;

  &:hover {
    background: ${props => props.disabled ? 'white' : '#f5f5f5'};
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${props => props.hasUnread ? '#ff4d4f' : 'transparent'};
  }

  .user-info {
    flex: 1;
    margin-left: 12px;
    overflow: hidden;

    .user-name {
      font-weight: 500;
      color: #262626;
      display: flex;
      align-items: center;
      gap: 6px;

      .unread-indicator {
        width: 6px;
        height: 6px;
        background: #ff4d4f;
        border-radius: 50%;
        display: inline-block;
      }
    }

    .last-message {
      font-size: 12px;
      color: #8c8c8c;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .message-time {
      font-size: 11px;
      color: #bfbfbf;
    }
  }

  .unread-badge {
    .ant-badge-count {
      font-size: 10px;
      height: 16px;
      min-width: 16px;
      line-height: 16px;
      padding: 0 4px;
    }
  }
`;

export const ChatPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #f0f0f0;
`;

export const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;

  .user-details {
    flex: 1;
    margin-left: 12px;

    .user-name {
      font-weight: 500;
      color: #262626;
    }

    .user-id {
      font-size: 12px;
      color: #8c8c8c;
    }
  }

  .chat-actions {
    display: flex;
    gap: 8px;
  }
`;

export const ChatMessages = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #fafafa;

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
    color: #8c8c8c;

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

  .message-content {
    max-width: 70%;
    background: ${props => props.isOwn ? '#1890ff' : 'white'};
    color: ${props => props.isOwn ? 'white' : '#262626'};
    padding: 8px 12px;
    border-radius: 12px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    opacity: ${props => props.isTemp ? 0.7 : 1};

    .message-text {
      word-wrap: break-word;
      line-height: 1.4;
    }

    .message-time {
      font-size: 10px;
      margin-top: 4px;
      opacity: 0.8;
      display: flex;
      align-items: center;
      gap: 4px;

      .sending-indicator {
        font-style: italic;
      }

      .connection-warning {
        color: #ffa39e;
      }
    }
  }
`;

export const MessageInput = styled.div`
  display: flex;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  background: white;

  .ant-input {
    resize: none;
  }
`;

export const NoChatSelected = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #8c8c8c;

  h3 {
    margin: 8px 0;
    color: #262626;
  }

  p {
    margin-bottom: 24px;
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
        font-weight: bold;
        color: #1890ff;
      }

      .stat-label {
        font-size: 12px;
        color: #8c8c8c;
        margin-top: 4px;
      }
    }
  }
`;

export const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ff4d4f;
  font-size: 12px;
  font-weight: 500;
`;