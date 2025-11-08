// src/components/AdminChat/AdminChat.jsx - FIX HIỂN THỊ TÊN NGƯỜI DÙNG
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { useSelector } from 'react-redux';
import { Input, Button, Badge, List, Card, message as antMessage, Spin, Tooltip, Tag } from 'antd';
import {
    SendOutlined,
    UserOutlined,
    MessageOutlined,
    CommentOutlined,
    EyeOutlined,
    ReloadOutlined,
    ExclamationCircleOutlined,
    ClockCircleOutlined
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
        console.log('📞 Conversations received:', conversationsData);

        // ✅ KIỂM TRA VÀ XỬ LÝ DỮ LIỆU TRÙNG LẶP
        const uniqueConversations = conversationsData.reduce((acc, current) => {
            // Kiểm tra xem conversation đã tồn tại chưa
            const existing = acc.find(item => item.userId === current.userId);
            if (!existing) {
                acc.push(current);
            } else {
                // Nếu đã tồn tại, ưu tiên conversation có unreadCount cao hơn hoặc lastMessageTime mới hơn
                if ((current.unreadCount || 0) > (existing.unreadCount || 0) ||
                    new Date(current.lastMessageTime || 0) > new Date(existing.lastMessageTime || 0)) {
                    const index = acc.indexOf(existing);
                    acc[index] = current;
                }
            }
            return acc;
        }, []);

        console.log('✅ Unique conversations:', uniqueConversations);
        setConversations(uniqueConversations);
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

        // Cập nhật conversations khi có tin nhắn mới
        setConversations(prev => {
            const updatedConversations = prev.map(conv => {
                if (conv.userId === message.senderId) {
                    return {
                        ...conv,
                        lastMessage: message.message,
                        lastMessageTime: message.timestamp,
                        unreadCount: (conv.unreadCount || 0) + (message.senderId !== 'admin' ? 1 : 0)
                    };
                }
                return conv;
            });

            // Đưa conversation có tin nhắn mới lên đầu
            const conversationIndex = updatedConversations.findIndex(conv => conv.userId === message.senderId);
            if (conversationIndex > 0) {
                const [movedConversation] = updatedConversations.splice(conversationIndex, 1);
                updatedConversations.unshift(movedConversation);
            }

            return updatedConversations;
        });

        const currentConversations = conversationsRef.current;
        if (selectedUser !== message.senderId && message.senderId !== 'admin') {
            const conversation = currentConversations.find(c => c.userId === message.senderId);
            if (conversation) {
                antMessage.info({
                    content: `Tin nhắn mới từ ${getDisplayName(conversation)}`,
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

            // Cập nhật last message trong conversations
            setConversations(prev => {
                return prev.map(conv => {
                    if (conv.userId === selectedUser) {
                        return {
                            ...conv,
                            lastMessage: data.message.message,
                            lastMessageTime: data.message.timestamp
                        };
                    }
                    return conv;
                });
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

    // ✅ HÀM LẤY TÊN HIỂN THỊ - FIXED
    const getDisplayName = (conversation) => {
        if (!conversation) return 'Người dùng';

        // Ưu tiên hiển thị tên theo thứ tự: displayName -> userName -> userId
        if (conversation.displayName && conversation.displayName !== 'Người dùng') {
            return conversation.displayName;
        }
        if (conversation.userName && conversation.userName !== 'Người dùng') {
            return conversation.userName;
        }
        if (conversation.userId) {
            // Cắt ngắn userId để hiển thị đẹp hơn
            return `User-${conversation.userId.slice(-6)}`;
        }

        return 'Người dùng';
    };

    const handleSelectUser = useCallback((userId) => {
        console.log('👤 Selecting user:', userId);
        setSelectedUser(userId);
        setNewMessage('');

        if (socket && isConnected && userId) {
            socket.emit('markMessagesAsRead', userId);

            // Cập nhật unreadCount trong local state
            setConversations(prev =>
                prev.map(conv =>
                    conv.userId === userId
                        ? { ...conv, unreadCount: 0 }
                        : conv
                )
            );
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
            setConversations(prev =>
                prev.map(conv => ({ ...conv, unreadCount: 0 }))
            );
            antMessage.success('Đã đánh dấu tất cả tin nhắn là đã đọc');
        } else {
            antMessage.error('Không có kết nối, không thể đánh dấu đã đọc');
        }
    }, [socket, isConnected]);

    const getSelectedConversation = () => {
        return conversations.find(c => c.userId === selectedUser);
    };

    // ✅ HÀM ĐỊNH DẠNG THỜI GIAN
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays < 7) return `${diffDays} ngày trước`;

        return date.toLocaleDateString('vi-VN');
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
                        <div style={{ width: '350px', background: 'white', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
                            <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0', background: '#fafafa', borderRadius: '8px 8px 0 0' }}>
                                <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <MessageOutlined />
                                    Hội thoại ({conversations.length})
                                </h4>
                                {totalUnread > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                        <Tag color="red" style={{ margin: 0 }}>
                                            {totalUnread} tin nhắn chưa đọc
                                        </Tag>
                                        <Tag color="orange" style={{ margin: 0 }}>
                                            {unreadConversations} hội thoại
                                        </Tag>
                                    </div>
                                )}
                            </div>
                            <List
                                dataSource={conversations}
                                loading={loading}
                                style={{ height: '428px', overflowY: 'auto' }}
                                renderItem={(conversation) => (
                                    <div
                                        key={conversation._id || conversation.userId}
                                        onClick={() => handleSelectUser(conversation.userId)}
                                        style={{
                                            padding: '12px 16px',
                                            borderBottom: '1px solid #f0f0f0',
                                            cursor: 'pointer',
                                            background: selectedUser === conversation.userId ? '#e6f7ff' : 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            position: 'relative',
                                            transition: 'all 0.2s',
                                            borderLeft: selectedUser === conversation.userId ? '3px solid #1890ff' : '3px solid transparent'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = selectedUser === conversation.userId ? '#e6f7ff' : '#f5f5f5';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = selectedUser === conversation.userId ? '#e6f7ff' : 'white';
                                        }}
                                    >
                                        {/* Icon user thay cho avatar */}
                                        <UserOutlined style={{
                                            color: conversation.unreadCount > 0 ? '#ff4d4f' : '#1890ff',
                                            fontSize: '16px'
                                        }} />

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                marginBottom: '4px'
                                            }}>
                                                <span style={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    color: conversation.unreadCount > 0 ? '#1890ff' : '#262626',
                                                    fontWeight: conversation.unreadCount > 0 ? '600' : '500'
                                                }}>
                                                    {getDisplayName(conversation)}
                                                </span>
                                            </div>
                                            <div style={{
                                                fontSize: '13px',
                                                color: '#595959',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                marginBottom: '2px'
                                            }}>
                                                {conversation.lastMessage || 'Chưa có tin nhắn'}
                                            </div>
                                            <div style={{
                                                fontSize: '11px',
                                                color: '#8c8c8c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                <ClockCircleOutlined style={{ fontSize: '10px' }} />
                                                {conversation.lastMessageTime ?
                                                    formatTime(conversation.lastMessageTime) :
                                                    'Chưa có tin nhắn'
                                                }
                                            </div>
                                        </div>
                                        {conversation.unreadCount > 0 && (
                                            <Badge
                                                count={conversation.unreadCount}
                                                style={{
                                                    backgroundColor: '#ff4d4f',
                                                    flexShrink: 0
                                                }}
                                            />
                                        )}
                                    </div>
                                )}
                                locale={{
                                    emptyText: (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '40px 20px',
                                            color: '#8c8c8c'
                                        }}>
                                            <MessageOutlined style={{ fontSize: '32px', marginBottom: '8px' }} />
                                            <div>Chưa có hội thoại nào</div>
                                        </div>
                                    )
                                }}
                            />
                        </div>

                        {/* Chat Panel */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid #f0f0f0', background: 'white', borderRadius: '8px' }}>
                            {selectedUser ? (
                                <>
                                    <div style={{
                                        padding: '16px',
                                        borderBottom: '1px solid #f0f0f0',
                                        background: '#fafafa',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        borderRadius: '8px 8px 0 0'
                                    }}>
                                        {/* Icon user */}
                                        <UserOutlined style={{
                                            fontSize: '24px',
                                            color: '#1890ff'
                                        }} />

                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {getDisplayName(getSelectedConversation() || {})}
                                                <Tag color="green" size="small">Đang hoạt động</Tag>
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#8c8c8c', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
                                                <Tooltip title="ID người dùng">
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <UserOutlined />
                                                        {selectedUser}
                                                    </span>
                                                </Tooltip>
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
                                                            marginBottom: '12px',
                                                            alignItems: 'flex-start',
                                                            gap: '8px'
                                                        }}
                                                    >
                                                        {message.senderId !== 'admin' && (
                                                            <UserOutlined style={{
                                                                color: '#52c41a',
                                                                fontSize: '14px',
                                                                marginTop: '4px'
                                                            }} />
                                                        )}
                                                        <div
                                                            style={{
                                                                background: message.senderId === 'admin' ? '#1890ff' : 'white',
                                                                color: message.senderId === 'admin' ? 'white' : '#262626',
                                                                padding: '8px 12px',
                                                                borderRadius: '12px',
                                                                maxWidth: '70%',
                                                                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                                                                opacity: message.isTemp ? 0.7 : 1,
                                                                border: message.senderId !== 'admin' ? '1px solid #f0f0f0' : 'none'
                                                            }}
                                                        >
                                                            <div>{message.message}</div>
                                                            <div style={{
                                                                fontSize: '10px',
                                                                opacity: 0.8,
                                                                marginTop: '4px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px'
                                                            }}>
                                                                {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                                {message.isTemp && (
                                                                    <span style={{ fontStyle: 'italic' }}>• Đang gửi</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {message.senderId === 'admin' && (
                                                            <UserOutlined style={{
                                                                color: '#1890ff',
                                                                fontSize: '14px',
                                                                marginTop: '4px'
                                                            }} />
                                                        )}
                                                    </div>
                                                ))}
                                                <div ref={messagesEndRef} />
                                            </div>
                                        ) : (
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: '100%',
                                                color: '#8c8c8c'
                                            }}>
                                                <MessageOutlined style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
                                                <p style={{ margin: '4px 0', fontWeight: '500', color: '#262626' }}>Chưa có tin nhắn nào</p>
                                                <span style={{ fontSize: '14px' }}>Hãy bắt đầu cuộc trò chuyện với khách hàng</span>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{
                                        padding: '16px',
                                        borderTop: '1px solid #f0f0f0',
                                        display: 'flex',
                                        gap: '8px',
                                        borderRadius: '0 0 8px 8px'
                                    }}>
                                        <Input.TextArea
                                            value={newMessage}
                                            onChange={handleInputChange}
                                            onKeyPress={handleKeyPress}
                                            placeholder={isConnected ? "Nhập tin nhắn hỗ trợ..." : "Đang mất kết nối..."}
                                            autoSize={{ minRows: 1, maxRows: 4 }}
                                            disabled={!isConnected}
                                            style={{ borderRadius: '6px' }}
                                        />
                                        <Button
                                            type="primary"
                                            icon={<SendOutlined />}
                                            onClick={handleSendMessage}
                                            disabled={!newMessage.trim() || !isConnected}
                                            loading={isSending}
                                            style={{ borderRadius: '6px' }}
                                        >
                                            Gửi
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    color: '#8c8c8c'
                                }}>
                                    <CommentOutlined style={{ fontSize: '64px', color: '#ccc', marginBottom: '16px' }} />
                                    <h3 style={{ margin: '8px 0', color: '#262626' }}>Chọn hội thoại để bắt đầu trò chuyện</h3>
                                    <p style={{ marginBottom: '24px', textAlign: 'center' }}>Danh sách hội thoại với khách hàng hiển thị ở bên trái</p>
                                    {!isConnected && (
                                        <div style={{
                                            background: '#fff2f0',
                                            border: '1px solid #ffccc7',
                                            padding: '12px 16px',
                                            borderRadius: '6px',
                                            margin: '16px 0',
                                            maxWidth: '300px'
                                        }}>
                                            <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
                                            <span>
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
                                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>{totalUnread}</span>
                                            <span style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>Tin nhắn chưa đọc</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>{unreadConversations}</span>
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