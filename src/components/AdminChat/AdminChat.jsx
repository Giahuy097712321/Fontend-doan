// src/components/AdminChat/AdminChat.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { useSelector } from 'react-redux';
import { Input, Button, Avatar, Badge, List, Card, message as antMessage } from 'antd';
import { SendOutlined, UserOutlined, MessageOutlined, CommentOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import {
    AdminChatContainer,
    UsersList,
    UserItem,
    ChatPanel,
    ChatHeader,
    ChatMessages,
    MessageItem,
    MessageInput,
    NoChatSelected
} from './style';

const AdminChat = () => {
    const { socket } = useSocket();
    // Xóa biến user không sử dụng
    // const user = useSelector((state) => state.user);
    const [selectedUser, setSelectedUser] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState({});
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    const chatMessagesRef = useRef(null);

    // Scroll to bottom function
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Auto scroll when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedUser]);

    // Socket event handlers
    const handleConversationsList = useCallback((conversationsData) => {
        console.log('📞 Conversations received:', conversationsData);
        setConversations(conversationsData);
        setLoading(false);
    }, []);

    // User selection handler - ĐỊNH NGHĨA TRƯỚC để sử dụng trong handleReceiveMessage
    const handleSelectUser = useCallback((userId) => {
        console.log('👤 Selecting user:', userId);
        setSelectedUser(userId);
        setNewMessage('');

        // Mark messages as read when selecting user
        if (socket && userId) {
            socket.emit('markMessagesAsRead', userId);
        }
    }, [socket]);

    // Trong AdminChat - sửa handleReceiveMessage
    const handleReceiveMessage = useCallback((message) => {
        console.log('📨 ADMIN: New message received:', message);
        console.log('📨 Message details - senderId:', message.senderId, 'receiverId:', message.receiverId);

        setMessages(prev => {
            const existingMessages = prev[message.senderId] || [];
            const isDuplicate = existingMessages.some(msg => msg._id === message._id);

            if (isDuplicate) {
                console.log('🚫 Duplicate message, skipping');
                return prev;
            }

            console.log('✅ Adding message to state for user:', message.senderId);
            return {
                ...prev,
                [message.senderId]: [...existingMessages, message]
            };
        });

        // Show notification if not viewing this conversation
        if (selectedUser !== message.senderId && message.senderId !== 'admin') {
            const conversation = conversations.find(c => c.userId === message.senderId);
            if (conversation) {
                antMessage.info({
                    content: `Tin nhắn mới từ ${conversation.userName}`,
                    duration: 3,
                    onClick: () => handleSelectUser(message.senderId)
                });
            }
        }
    }, [selectedUser, conversations, handleSelectUser]); // THÊM handleSelectUser vào dependencies

    const handleChatHistory = useCallback((history) => {
        console.log('📚 Chat history received:', history.length, 'messages');
        if (selectedUser) {
            setMessages(prev => ({
                ...prev,
                [selectedUser]: history
            }));
        }
    }, [selectedUser]);

    const handleMessageSent = useCallback((data) => {
        console.log('✅ Message sent confirmation:', data);
        if (data.message && selectedUser) {
            setMessages(prev => {
                const existingMessages = prev[selectedUser] || [];
                const filteredMessages = existingMessages.filter(msg => !msg.isTemp);
                return {
                    ...prev,
                    [selectedUser]: [...filteredMessages, data.message]
                };
            });
        }
        setIsSending(false);
    }, [selectedUser]);

    const handleMessagesRead = useCallback((data) => {
        console.log('✅ Messages marked as read:', data);
        // Refresh conversations to update unread counts
        if (socket) {
            socket.emit('getConversations');
        }
    }, [socket]);

    // Socket setup
    useEffect(() => {
        if (!socket) return;

        console.log('🔗 AdminChat socket connected. Setting up listeners...');

        socket.on('conversationsList', handleConversationsList);
        socket.on('receiveMessage', handleReceiveMessage);
        socket.on('chatHistory', handleChatHistory);
        socket.on('messageSent', handleMessageSent);
        socket.on('messagesRead', handleMessagesRead);

        // Lấy danh sách hội thoại ngay khi vào
        socket.emit('getConversations');

        return () => {
            console.log('🧹 Cleaning up AdminChat listeners...');
            socket.off('conversationsList', handleConversationsList);
            socket.off('receiveMessage', handleReceiveMessage);
            socket.off('chatHistory', handleChatHistory);
            socket.off('messageSent', handleMessageSent);
            socket.off('messagesRead', handleMessagesRead);
        };
    }, [
        socket,
        handleConversationsList,
        handleReceiveMessage,
        handleChatHistory,
        handleMessageSent,
        handleMessagesRead
    ]);

    // Load chat history when user is selected
    useEffect(() => {
        if (socket && selectedUser) {
            console.log('🔄 Loading chat history for:', selectedUser);
            socket.emit('getChatHistory', selectedUser);
        }
    }, [selectedUser, socket]);

    // Send message handler
    const handleSendMessage = useCallback(() => {
        if (newMessage.trim() && socket && selectedUser && !isSending) {
            setIsSending(true);

            const messageData = {
                senderId: 'admin',
                senderName: 'Admin',
                receiverId: selectedUser,
                message: newMessage.trim(),
                timestamp: new Date()
            };

            console.log('📤 Sending message:', messageData);

            // Add temporary message to UI
            const tempMessage = {
                ...messageData,
                _id: `temp-${Date.now()}`,
                timestamp: new Date(),
                isTemp: true
            };

            setMessages(prev => ({
                ...prev,
                [selectedUser]: [...(prev[selectedUser] || []), tempMessage]
            }));

            // Send via socket
            socket.emit('sendMessage', messageData);
            setNewMessage('');
        }
    }, [newMessage, socket, selectedUser, isSending]);

    // Input handlers
    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);

    const handleInputChange = useCallback((e) => {
        setNewMessage(e.target.value);
    }, []);

    // Utility functions
    const refreshConversations = useCallback(() => {
        if (socket) {
            setLoading(true);
            socket.emit('getConversations');
            antMessage.success('Đã làm mới danh sách hội thoại');
        }
    }, [socket]);

    const markAllAsRead = useCallback(() => {
        if (socket) {
            socket.emit('markAllMessagesAsRead');
            antMessage.success('Đã đánh dấu tất cả tin nhắn là đã đọc');
        }
    }, [socket]);

    const getSelectedConversation = () => {
        return conversations.find(c => c.userId === selectedUser);
    };

    // Calculate stats
    const totalUnread = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
    const unreadConversations = conversations.filter(conv => conv.unreadCount > 0).length;

    return (
        <AdminChatContainer>
            <Card
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CommentOutlined style={{ color: '#1890ff' }} />
                        <span>Quản lý Chat</span>
                        {totalUnread > 0 && (
                            <Badge count={totalUnread} style={{ backgroundColor: '#ff4d4f' }} />
                        )}
                        <Button
                            size="small"
                            icon={<ReloadOutlined />}
                            onClick={refreshConversations}
                            style={{ marginLeft: 'auto' }}
                            loading={loading}
                        >
                            Làm mới
                        </Button>
                        {totalUnread > 0 && (
                            <Button
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={markAllAsRead}
                            >
                                Đánh dấu đã đọc tất cả
                            </Button>
                        )}
                    </div>
                }
                style={{ height: '600px' }}
            >
                <div className="chat-layout">
                    {/* Users List */}
                    <UsersList>
                        <div className="users-header">
                            <h4>Hội thoại ({conversations.length})</h4>
                            {totalUnread > 0 && (
                                <span className="unread-total">
                                    {totalUnread} tin nhắn chưa đọc
                                </span>
                            )}
                        </div>
                        <List
                            dataSource={conversations}
                            loading={loading}
                            renderItem={(conversation) => (
                                <UserItem
                                    key={conversation._id}
                                    onClick={() => handleSelectUser(conversation.userId)}
                                    isSelected={selectedUser === conversation.userId}
                                    hasUnread={conversation.unreadCount > 0}
                                >
                                    <Avatar
                                        icon={<UserOutlined />}
                                        size="small"
                                        style={{
                                            backgroundColor: conversation.unreadCount > 0 ? '#ff4d4f' : '#1890ff'
                                        }}
                                    />
                                    <div className="user-info">
                                        <div className="user-name">
                                            {conversation.userName}
                                            {conversation.unreadCount > 0 && (
                                                <span className="unread-indicator"></span>
                                            )}
                                        </div>
                                        <div className="last-message">
                                            {conversation.lastMessage || 'Chưa có tin nhắn'}
                                        </div>
                                        <div className="message-time">
                                            {conversation.lastMessageTime ?
                                                new Date(conversation.lastMessageTime).toLocaleTimeString('vi-VN') :
                                                ''
                                            }
                                        </div>
                                    </div>
                                    {conversation.unreadCount > 0 && (
                                        <Badge
                                            count={conversation.unreadCount}
                                            className="unread-badge"
                                        />
                                    )}
                                </UserItem>
                            )}
                            locale={{ emptyText: 'Chưa có hội thoại nào' }}
                        />
                    </UsersList>

                    {/* Chat Panel */}
                    <ChatPanel>
                        {selectedUser ? (
                            <>
                                <ChatHeader>
                                    <Avatar
                                        icon={<UserOutlined />}
                                        size="default"
                                        style={{ backgroundColor: '#1890ff' }}
                                    />
                                    <div className="user-details">
                                        <div className="user-name">
                                            {getSelectedConversation()?.userName || 'Người dùng'}
                                        </div>
                                        <div className="user-id">
                                            ID: {selectedUser}
                                        </div>
                                    </div>
                                    <div className="chat-actions">
                                        <Button
                                            size="small"
                                            icon={<EyeOutlined />}
                                            onClick={() => socket.emit('markMessagesAsRead', selectedUser)}
                                        >
                                            Đánh dấu đã đọc
                                        </Button>
                                    </div>
                                </ChatHeader>

                                <ChatMessages ref={chatMessagesRef}>
                                    {messages[selectedUser]?.length > 0 ? (
                                        <div className="messages-container">
                                            {messages[selectedUser].map((message) => (
                                                <MessageItem
                                                    key={message._id || `temp-${message.timestamp}`}
                                                    isOwn={message.senderId === 'admin'}
                                                    isTemp={message.isTemp}
                                                >
                                                    <div className="message-content">
                                                        <div className="message-text">{message.message}</div>
                                                        <div className="message-time">
                                                            {new Date(message.timestamp).toLocaleTimeString('vi-VN')}
                                                            {message.isTemp && (
                                                                <span className="sending-indicator"> • Đang gửi</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </MessageItem>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="no-messages">
                                            <MessageOutlined style={{ fontSize: '32px', color: '#ccc', marginBottom: '8px' }} />
                                            <p>Chưa có tin nhắn nào</p>
                                            <span>Hãy bắt đầu cuộc trò chuyện</span>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </ChatMessages>

                                <MessageInput>
                                    <Input.TextArea
                                        value={newMessage}
                                        onChange={handleInputChange}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Nhập tin nhắn hỗ trợ..."
                                        autoSize={{ minRows: 1, maxRows: 4 }}
                                    />
                                    <Button
                                        type="primary"
                                        icon={<SendOutlined />}
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim()}
                                        loading={isSending}
                                    >
                                        Gửi
                                    </Button>
                                </MessageInput>
                            </>
                        ) : (
                            <NoChatSelected>
                                <CommentOutlined style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
                                <h3>Chọn hội thoại để bắt đầu trò chuyện</h3>
                                <p>Danh sách hội thoại với khách hàng hiển thị ở bên trái</p>
                                <div className="stats">
                                    <div className="stat-item">
                                        <span className="stat-number">{conversations.length}</span>
                                        <span className="stat-label">Tổng hội thoại</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">{totalUnread}</span>
                                        <span className="stat-label">Tin nhắn chưa đọc</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">{unreadConversations}</span>
                                        <span className="stat-label">Hội thoại chưa đọc</span>
                                    </div>
                                </div>
                            </NoChatSelected>
                        )}
                    </ChatPanel>
                </div>
            </Card>
        </AdminChatContainer>
    );
};

export default AdminChat;