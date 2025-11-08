// src/contexts/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { useSelector } from 'react-redux';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionAttempts, setConnectionAttempts] = useState(0);
    const user = useSelector((state) => state.user);

    // Xác định socket URL dựa trên môi trường
    const getSocketUrl = () => {
        // Nếu đang chạy trên Vercel (production)
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            return process.env.REACT_APP_API_URL
                ? process.env.REACT_APP_API_URL.replace('/api', '')
                : 'https://backend-doan-2.onrender.com';
        }
        // Local development
        return 'http://localhost:3001';
    };

    useEffect(() => {
        if (user?.id) {
            console.log('🔄 Initializing socket connection for user:', user.id);

            const socketUrl = getSocketUrl();
            console.log('🔗 Connecting to socket server:', socketUrl);

            const newSocket = io(socketUrl, {
                withCredentials: true,
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: 10,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 10000,
                timeout: 20000,
                forceNew: false,
                autoConnect: true,
                query: {
                    userId: user.id,
                    userName: user.name,
                    role: user?.isAdmin ? 'admin' : 'user'
                }
            });

            // Event listeners
            newSocket.on('connect', () => {
                console.log('✅ Socket connected:', newSocket.id);
                setIsConnected(true);
                setConnectionAttempts(0);

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

            newSocket.on('disconnect', (reason) => {
                console.log('🔴 Socket disconnected:', reason);
                setIsConnected(false);

                if (reason === 'io server disconnect') {
                    // Server deliberately disconnected, try to reconnect
                    setTimeout(() => {
                        newSocket.connect();
                    }, 1000);
                }
            });

            newSocket.on('reconnect', (attempt) => {
                console.log('🔄 Socket reconnected after', attempt, 'attempts');
                setIsConnected(true);

                // Re-add user after reconnect
                newSocket.emit('addUser', user.id, {
                    userName: user.name,
                    avatar: user.avatar,
                    role: user?.isAdmin ? 'admin' : 'user'
                });
            });

            newSocket.on('reconnect_attempt', (attempt) => {
                console.log('🔄 Reconnection attempt:', attempt);
                setConnectionAttempts(attempt);
            });

            newSocket.on('reconnect_error', (error) => {
                console.error('❌ Reconnection error:', error);
            });

            newSocket.on('reconnect_failed', () => {
                console.error('💥 Reconnection failed after all attempts');
                setIsConnected(false);
            });

            newSocket.on('connect_error', (error) => {
                console.error('❌ Connection error:', error);
                setIsConnected(false);
            });

            newSocket.on('error', (error) => {
                console.error('💥 Socket error:', error);
            });

            setSocket(newSocket);

            return () => {
                console.log('🧹 Cleaning up socket connection');
                if (newSocket) {
                    newSocket.removeAllListeners();
                    newSocket.disconnect();
                }
            };
        } else {
            // Nếu không có user, đóng socket cũ
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
        }
    }, [user?.id]);

    // Manual reconnect function
    const reconnect = () => {
        if (socket && !isConnected) {
            console.log('🔄 Manual reconnection triggered');
            socket.connect();
        }
    };

    const value = {
        socket,
        onlineUsers,
        isConnected,
        connectionAttempts,
        reconnect
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};