// src/components/AdminChat/AdminChat.jsx - HOÀN CHỈNH VỚI AVATAR
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { useSelector } from 'react-redux';
import { Input, Button, Avatar, Badge, List, Card, message as antMessage, Spin, Tooltip } from 'antd';
import {
    SendOutlined,
    UserOutlined,
    MessageOutlined,
    CommentOutlined,
    EyeOutlined,
    ReloadOutlined,
    ExclamationCircleOutlined,
    MailOutlined
} from '@ant-design/icons';
import SocketStatus from '../SocketStatus/SocketStatus';

const AdminChat = () => {
    const { socket, isConnected } = useSocket();
    const user = useSelector((state) => state.user);
    const [selectedUser, setSelectedUser] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState({});
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const messagesEndRef = useRef(null);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedUser]);

    const conversationsRef = useRef(conversations);

    useEffect(() => {
        conversationsRef.current = conversations;
    }, [conversations]);

    // Socket event handlers
    const handleConversationsList = useCallback((conversationsData) => {
        console.log('📞 Conversations received:', conversationsData.length);
        console.log('👤 User data sample:', conversationsData[0]); // Debug để xem dữ liệu user
        setConversations(conversationsData);
        setLoading(false);
        setInitialLoad(false);
    }, []);

    const handleReceiveMessage = useCallback((message) => {
        console.log('📨 ADMIN: New message received:', message);

        setMessages(prev => {
            const existingMessages = prev[message.senderId] || [];
            const isDuplicate = existingMessages.some(msg => msg._id === message._id);

            if (isDuplicate) {
                return prev;
            }

            return {
                ...prev,
                [message.senderId]: [...existingMessages, message]
            };
        });

        const currentConversations = conversationsRef.current;
        if (selectedUser !== message.senderId && message.senderId !== 'admin') {
            const conversation = currentConversations.find(c => c.userId === message.senderId);
            if (conversation) {
                antMessage.info({
                    content: `Tin nhắn mới từ ${conversation.userName}`,
                    duration: 3,
                    onClick: () => handleSelectUser(message.senderId)
                });
            }
        }
    }, [selectedUser]);

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

    // Socket setup
    useEffect(() => {
        if (!socket || !isConnected) {
            console.log('⏳ Waiting for socket connection...');
            return;
        }

        console.log('🔗 Setting up AdminChat socket listeners...');

        const listeners = {
            conversationsList: handleConversationsList,
            receiveMessage: handleReceiveMessage,
            chatHistory: handleChatHistory,
            messageSent: handleMessageSent,
            conversationsError: (error) => {
                console.error('❌ Conversations error:', error);
                antMessage.error('Lỗi khi tải danh sách hội thoại');
                setLoading(false);
            },
            chatHistoryError: (error) => {
                console.error('❌ Chat history error:', error);
                antMessage.error('Lỗi khi tải lịch sử chat');
            },
            messageError: (error) => {
                console.error('❌ Message send error:', error);
                antMessage.error('Lỗi khi gửi tin nhắn');
                setIsSending(false);
            }
        };

        Object.entries(listeners).forEach(([event, handler]) => {
            socket.on(event, handler);
        });

        if (conversations.length === 0) {
            console.log('📡 Requesting conversations...');
            setLoading(true);
            socket.emit('getConversations');
        }

        return () => {
            console.log('🧹 Cleaning up AdminChat listeners...');
            Object.entries(listeners).forEach(([event, handler]) => {
                socket.off(event, handler);
            });
        };
    }, [socket, isConnected, handleConversationsList, handleReceiveMessage, handleChatHistory, handleMessageSent, conversations.length]);

    useEffect(() => {
        if (socket && isConnected && selectedUser) {
            console.log('🔄 Loading chat history for:', selectedUser);
            socket.emit('getChatHistory', selectedUser);
        }
    }, [selectedUser, socket, isConnected]);

    const handleSelectUser = useCallback((userId) => {
        console.log('👤 Selecting user:', userId);
        setSelectedUser(userId);
        setNewMessage('');

        if (socket && isConnected && userId) {
            socket.emit('markMessagesAsRead', userId);
        }
    }, [socket, isConnected]);

    const handleSendMessage = useCallback(() => {
        if (!isConnected) {
            antMessage.error('Mất kết nối, không thể gửi tin nhắn');
            return;
        }

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

            socket.emit('sendMessage', messageData);
            setNewMessage('');
        }
    }, [newMessage, socket, selectedUser, isSending, isConnected]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);

    const handleInputChange = useCallback((e) => {
        setNewMessage(e.target.value);
    }, []);

    const refreshConversations = useCallback(() => {
        if (socket && isConnected) {
            setLoading(true);
            socket.emit('getConversations');
            antMessage.success('Đã làm mới danh sách hội thoại');
        } else {
            antMessage.error('Không có kết nối, không thể làm mới');
        }
    }, [socket, isConnected]);

    const markAllAsRead = useCallback(() => {
        if (socket && isConnected) {
            socket.emit('markAllMessagesAsRead');
            antMessage.success('Đã đánh dấu tất cả tin nhắn là đã đọc');
        } else {
            antMessage.error('Không có kết nối, không thể đánh dấu đã đọc');
        }
    }, [socket, isConnected]);

    const getSelectedConversation = () => {
        return conversations.find(c => c.userId === selectedUser);
    };

    // ✅ HÀM HIỂN THỊ AVATAR
    const renderUserAvatar = (conversation, size = 'small') => {
        if (conversation.userAvatar) {
            return (
                <Avatar
                    src={conversation.userAvatar}
                    size={size}
                    alt={conversation.userName}
                />
            );
        }
        return (
            <Avatar
                icon={<UserOutlined />}
                size={size}
                style={{
                    backgroundColor: conversation.unreadCount > 0 ? '#ff4d4f' : '#1890ff',
                    ...(size === 'default' ? { fontSize: '24px' } : {})
                }}
            />
        );
    };

    const totalUnread = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
    const unreadConversations = conversations.filter(conv => conv.unreadCount > 0).length;

    return (
        <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
            <Card
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <CommentOutlined style={{ color: '#1890ff' }} />
                        <span>Quản lý Chat</span>
                        <SocketStatus />
                        {totalUnread > 0 && (
                            <Badge count={totalUnread} style={{ backgroundColor: '#ff4d4f' }} />
                        )}
                        <Button
                            size="small"
                            icon={<ReloadOutlined />}
                            onClick={refreshConversations}
                            style={{ marginLeft: 'auto' }}
                            loading={loading}
                            disabled={!isConnected}
                        >
                            Làm mới
                        </Button>
                        {totalUnread > 0 && (
                            <Button
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={markAllAsRead}
                                disabled={!isConnected}
                            >
                                Đánh dấu đã đọc
                            </Button>
                        )}
                    </div>
                }
                style={{ height: '600px' }}
            >
                {initialLoad ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                        <Spin size="large" tip="Đang kết nối chat..." />
                    </div>
                ) : (
                    <div style={{ display: 'flex', height: '500px', gap: '16px' }}>
                        {/* Users List */}
                        <div style={{ width: '350px', background: 'white', border: '1px solid #f0f0f0' }}>
                            <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                                <h4 style={{ margin: 0 }}>Hội thoại ({conversations.length})</h4>
                                {totalUnread > 0 && (
                                    <span style={{ fontSize: '12px', color: '#ff4d4f' }}>
                                        {totalUnread} tin nhắn chưa đọc
                                    </span>
                                )}
                            </div>
                            <List
                                dataSource={conversations}
                                loading={loading}
                                renderItem={(conversation) => (
                                    <div
                                        key={conversation._id}
                                        onClick={() => handleSelectUser(conversation.userId)}
                                        style={{
                                            padding: '12px 16px',
                                            borderBottom: '1px solid #f0f0f0',
                                            cursor: 'pointer',
                                            background: selectedUser === conversation.userId ? '#e6f7ff' : 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            position: 'relative'
                                        }}
                                    >
                                        {/* ✅ AVATAR NGƯỜI DÙNG */}
                                        {renderUserAvatar(conversation, 'small')}

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span style={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {conversation.userName}
                                                </span>
                                                {conversation.unreadCount > 0 && (
                                                    <span style={{
                                                        width: '6px',
                                                        height: '6px',
                                                        background: '#ff4d4f',
                                                        borderRadius: '50%',
                                                        flexShrink: 0
                                                    }}></span>
                                                )}
                                            </div>
                                            <div style={{
                                                fontSize: '12px',
                                                color: '#8c8c8c',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {conversation.lastMessage || 'Chưa có tin nhắn'}
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#bfbfbf' }}>
                                                {conversation.lastMessageTime ?
                                                    new Date(conversation.lastMessageTime).toLocaleTimeString('vi-VN') :
                                                    ''
                                                }
                                            </div>
                                        </div>
                                        {conversation.unreadCount > 0 && (
                                            <Badge count={conversation.unreadCount} />
                                        )}
                                    </div>
                                )}
                                locale={{ emptyText: 'Chưa có hội thoại nào' }}
                            />
                        </div>

                        {/* Chat Panel */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid #f0f0f0', background: 'white' }}>
                            {selectedUser ? (
                                <>
                                    <div style={{
                                        padding: '16px',
                                        borderBottom: '1px solid #f0f0f0',
                                        background: '#fafafa',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px'
                                    }}>
                                        {/* ✅ AVATAR TRONG HEADER */}
                                        {renderUserAvatar(getSelectedConversation() || {}, 'default')}

                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                                {getSelectedConversation()?.userName || 'Người dùng'}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#8c8c8c', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                <span>ID: {selectedUser}</span>
                                                {getSelectedConversation()?.userEmail && (
                                                    <>
                                                        <span>•</span>
                                                        <Tooltip title="Email người dùng">
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <MailOutlined />
                                                                {getSelectedConversation()?.userEmail}
                                                            </span>
                                                        </Tooltip>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <Button
                                                size="small"
                                                icon={<EyeOutlined />}
                                                onClick={() => socket.emit('markMessagesAsRead', selectedUser)}
                                                disabled={!isConnected}
                                            >
                                                Đánh dấu đã đọc
                                            </Button>
                                        </div>
                                    </div>

                                    <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: '#fafafa' }}>
                                        {messages[selectedUser]?.length > 0 ? (
                                            <div>
                                                {messages[selectedUser].map((message) => (
                                                    <div
                                                        key={message._id || `temp-${message.timestamp}`}
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: message.senderId === 'admin' ? 'flex-end' : 'flex-start',
                                                            marginBottom: '12px'
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                background: message.senderId === 'admin' ? '#1890ff' : 'white',
                                                                color: message.senderId === 'admin' ? 'white' : '#262626',
                                                                padding: '8px 12px',
                                                                borderRadius: '12px',
                                                                maxWidth: '70%',
                                                                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                                                                opacity: message.isTemp ? 0.7 : 1
                                                            }}
                                                        >
                                                            <div>{message.message}</div>
                                                            <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                {new Date(message.timestamp).toLocaleTimeString('vi-VN')}
                                                                {message.isTemp && (
                                                                    <span style={{ fontStyle: 'italic' }}>• Đang gửi</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div ref={messagesEndRef} />
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#8c8c8c' }}>
                                                <MessageOutlined style={{ fontSize: '32px', color: '#ccc', marginBottom: '8px' }} />
                                                <p style={{ margin: '4px 0', fontWeight: '500' }}>Chưa có tin nhắn nào</p>
                                                <span style={{ fontSize: '12px' }}>Hãy bắt đầu cuộc trò chuyện</span>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '8px' }}>
                                        <Input.TextArea
                                            value={newMessage}
                                            onChange={handleInputChange}
                                            onKeyPress={handleKeyPress}
                                            placeholder={isConnected ? "Nhập tin nhắn hỗ trợ..." : "Đang mất kết nối..."}
                                            autoSize={{ minRows: 1, maxRows: 4 }}
                                            disabled={!isConnected}
                                        />
                                        <Button
                                            type="primary"
                                            icon={<SendOutlined />}
                                            onClick={handleSendMessage}
                                            disabled={!newMessage.trim() || !isConnected}
                                            loading={isSending}
                                        >
                                            Gửi
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#8c8c8c' }}>
                                    <CommentOutlined style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
                                    <h3 style={{ margin: '8px 0', color: '#262626' }}>Chọn hội thoại để bắt đầu trò chuyện</h3>
                                    <p style={{ marginBottom: '24px' }}>Danh sách hội thoại với khách hàng hiển thị ở bên trái</p>
                                    {!isConnected && (
                                        <div style={{
                                            background: '#fff2f0',
                                            border: '1px solid #ffccc7',
                                            padding: '12px',
                                            borderRadius: '6px',
                                            margin: '16px 0'
                                        }}>
                                            <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                                            <span style={{ marginLeft: '8px' }}>
                                                Đang chờ kết nối chat server...
                                            </span>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', gap: '32px', marginTop: '24px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>{conversations.length}</span>
                                            <span style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>Tổng hội thoại</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>{totalUnread}</span>
                                            <span style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>Tin nhắn chưa đọc</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>{unreadConversations}</span>
                                            <span style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>Hội thoại chưa đọc</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AdminChat;