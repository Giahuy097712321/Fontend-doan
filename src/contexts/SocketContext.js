// src/contexts/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const user = useSelector((state) => state.user);

    // Xác định socket URL dựa trên môi trường
    const getSocketUrl = () => {
        // Nếu đang chạy trên Vercel (production)
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            // Sử dụng backend URL từ biến môi trường hoặc URL mặc định
            return process.env.REACT_APP_API_URL
                ? process.env.REACT_APP_API_URL.replace('/api', '') // Remove /api for socket
                : 'https://backend-doan-2.onrender.com';
        }
        // Local development
        return 'http://localhost:3001';
    };

    useEffect(() => {
        if (user?.id && !socket) {
            console.log('🔄 Initializing socket connection for user:', user.id);

            const socketUrl = getSocketUrl();
            console.log('🔗 Connecting to socket server:', socketUrl);
            console.log('🌍 Current hostname:', window.location.hostname);

            const newSocket = io(socketUrl, {
                withCredentials: true,
                transports: ['websocket', 'polling'], // Thêm polling để tương thích tốt hơn
                query: {
                    userId: user.id,
                    userName: user.name,
                    role: user?.isAdmin ? 'admin' : 'user'
                }
            });

            // Set up event listeners
            newSocket.on('connect', () => {
                console.log('✅ Socket connected:', newSocket.id);
                setIsConnected(true);

                // Add user to online list
                newSocket.emit('addUser', user.id, {
                    userName: user.name,
                    avatar: user.avatar,
                    role: user?.isAdmin ? 'admin' : 'user'
                });
            });

            newSocket.on('getOnlineUsers', (users) => {
                console.log('👥 Online users updated:', users.length);
                setOnlineUsers(users);
            });

            newSocket.on('disconnect', () => {
                console.log('🔴 Socket disconnected');
                setIsConnected(false);
            });

            newSocket.on('error', (error) => {
                console.error('💥 Socket error:', error);
                setIsConnected(false);
            });

            // Thêm sự kiện reconnect để xử lý kết nối lại
            newSocket.on('reconnect', () => {
                console.log('🔄 Socket reconnected');
                setIsConnected(true);

                // Add user again after reconnect
                newSocket.emit('addUser', user.id, {
                    userName: user.name,
                    avatar: user.avatar,
                    role: user?.isAdmin ? 'admin' : 'user'
                });
            });

            setSocket(newSocket);

            // Cleanup function
            return () => {
                console.log('🧹 Cleaning up socket connection');
                if (newSocket) {
                    newSocket.off('connect');
                    newSocket.off('getOnlineUsers');
                    newSocket.off('disconnect');
                    newSocket.off('error');
                    newSocket.off('reconnect');
                    newSocket.close();
                }
                setSocket(null);
                setIsConnected(false);
            };
        }
    }, [user?.id]); // Chỉ phụ thuộc vào user.id

    // Effect để xử lý khi user thay đổi nhưng socket đã tồn tại
    useEffect(() => {
        if (socket && user?.id && isConnected) {
            console.log('🔄 User changed, updating socket...');
            socket.emit('addUser', user.id, {
                userName: user.name,
                avatar: user.avatar,
                role: user?.isAdmin ? 'admin' : 'user'
            });
        }
    }, [user, socket, isConnected]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};