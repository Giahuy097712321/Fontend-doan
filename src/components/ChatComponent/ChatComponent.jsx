// src/components/ChatComponent/ChatComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { useSelector } from 'react-redux';
import { Button, Input, Avatar, Badge, notification } from 'antd';
import {
    SendOutlined,
    MessageOutlined,
    CloseOutlined,
    CustomerServiceOutlined,
    BellOutlined
} from '@ant-design/icons';
import {
    ChatToggle,
    ChatContainer,
    ChatHeader,
    ChatMessages,
    MessageItem,
    MessageInput,
    EmptyChat
} from './style';

const ChatComponent = () => {
    const { socket } = useSocket();
    const user = useSelector((state) => state.user);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Hiển thị thông báo
    const showNotification = (message) => {
        notification.info({
            message: 'Tin nhắn mới từ hỗ trợ',
            description: message.length > 50 ? message.substring(0, 50) + '...' : message,
            placement: 'bottomRight',
            duration: 4,
            icon: <BellOutlined style={{ color: '#1890ff' }} />,
            onClick: () => {
                setIsOpen(true);
                setUnreadCount(0);
            }
        });
    };

    useEffect(() => {
        if (!socket || !user?.id || user?.isAdmin) return;

        console.log('🔗 User chat component mounted, user ID:', user.id);

        // Lấy lịch sử chat cho user
        socket.emit('getChatHistory', user.id);

        const handleChatHistory = (history) => {
            console.log('📚 Chat history received:', history.length, 'messages');
            setMessages(history || []);
        };

        const handleReceiveMessage = (message) => {
            console.log('📨 New message received in user chat:', message);

            // Cập nhật messages state một cách an toàn
            setMessages(prev => {
                // Kiểm tra trùng lặp
                const isDuplicate = prev.some(msg =>
                    msg._id === message._id ||
                    (msg.timestamp === message.timestamp && msg.message === message.message)
                );

                if (isDuplicate) {
                    console.log('🚫 Duplicate message, skipping');
                    return prev;
                }

                console.log('✅ Adding new message to state');
                return [...prev, message];
            });

            // Hiển thị thông báo và tăng unread count nếu chat đang đóng
            if (!isOpen) {
                setUnreadCount(prev => prev + 1);
                showNotification(message.message);
            }
        };

        const handleMessageSent = (data) => {
            console.log('✅ Message sent confirmation in user chat:', data);
            if (data.message) {
                setMessages(prev => {
                    const filteredMessages = prev.filter(msg => !msg.isTemp);
                    const isDuplicate = filteredMessages.some(msg => msg._id === data.message._id);

                    if (isDuplicate) {
                        return filteredMessages;
                    }

                    return [...filteredMessages, data.message];
                });
            }
        };

        socket.on('chatHistory', handleChatHistory);
        socket.on('receiveMessage', handleReceiveMessage);
        socket.on('messageSent', handleMessageSent);

        return () => {
            socket.off('chatHistory', handleChatHistory);
            socket.off('receiveMessage', handleReceiveMessage);
            socket.off('messageSent', handleMessageSent);
        };
    }, [socket, user?.id, isOpen]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        if (!socket || !user?.id) return;

        const messageData = {
            senderId: user.id,
            senderName: user.name,
            receiverId: 'admin',
            message: newMessage.trim(),
            timestamp: new Date()
        };

        console.log('📤 User sending message to admin:', messageData);

        // Thêm tin nhắn tạm vào UI
        const tempMessage = {
            ...messageData,
            _id: `temp-${Date.now()}`,
            isTemp: true
        };

        setMessages(prev => [...prev, tempMessage]);
        setNewMessage('');

        // Gửi qua socket
        socket.emit('sendMessage', messageData);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    };

    const handleToggleChat = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        if (newState) {
            setUnreadCount(0);
        }
    };

    if (!user?.id || user?.isAdmin) return null;

    return (
        <>
            {/* Nút mở chat - Floating button với badge */}
            <ChatToggle
                onClick={handleToggleChat}
                className={unreadCount > 0 ? 'has-unread' : ''}
            >
                <div className="chat-toggle-content">
                    <Badge
                        count={unreadCount}
                        offset={[-5, 5]}
                        className="unread-badge"
                        showZero={false}
                    >
                        <MessageOutlined className="chat-icon" />
                    </Badge>
                    {unreadCount > 0 && (
                        <div className="unread-pulse"></div>
                    )}
                </div>
            </ChatToggle>

            {/* Chat box */}
            {isOpen && (
                <ChatContainer>
                    <ChatHeader>
                        <div className="chat-info">
                            <Avatar
                                size="small"
                                icon={<CustomerServiceOutlined />}
                                style={{ backgroundColor: '#1890ff' }}
                            />
                            <div className="user-details">
                                <span className="admin-name">Hỗ trợ viên</span>
                                <Badge status="success" text="Online" />
                            </div>
                        </div>
                        <div className="header-actions">
                            <Badge
                                count={unreadCount}
                                size="small"
                                className="header-badge"
                            >
                                <Button
                                    type="text"
                                    icon={<CloseOutlined />}
                                    onClick={handleToggleChat}
                                    className="close-btn"
                                />
                            </Badge>
                        </div>
                    </ChatHeader>

                    <ChatMessages>
                        {messages.length === 0 ? (
                            <EmptyChat>
                                <MessageOutlined style={{ fontSize: '32px', color: '#ccc', marginBottom: '8px' }} />
                                <p>Chào mừng bạn đến với hỗ trợ!</p>
                                <span>Hãy gửi tin nhắn để được hỗ trợ.</span>
                            </EmptyChat>
                        ) : (
                            messages.map((message) => (
                                <MessageItem
                                    key={message._id || `temp-${message.timestamp}`}
                                    isOwn={message.senderId === user.id}
                                    isTemp={message.isTemp}
                                >
                                    <div className="message-content">
                                        <div className="message-text">{message.message}</div>
                                        <div className="message-time">
                                            {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                            {message.isTemp && (
                                                <span className="sending-indicator"> • Đang gửi</span>
                                            )}
                                        </div>
                                    </div>
                                </MessageItem>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </ChatMessages>

                    <MessageInput>
                        <Input.TextArea
                            value={newMessage}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập tin nhắn của bạn..."
                            autoSize={{ minRows: 1, maxRows: 3 }}
                            className="message-textarea"
                        />
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            className="send-btn"
                        >
                            Gửi
                        </Button>
                    </MessageInput>
                </ChatContainer>
            )}
        </>
    );
};

export default ChatComponent;