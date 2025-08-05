import { io } from 'socket.io-client';
import BASE_API_URL from '../../constants/path';

class ChatService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.userId = null;
        this.messageHandlers = new Map();
    }

    connect(userId) {
        if (this.socket && this.isConnected) {
            return;
        }

        this.userId = userId;
        this.socket = io(BASE_API_URL, {
            transports: ['websocket'],
            autoConnect: true
        });

        this.socket.on('connect', () => {
            console.log('Connected to chat server');
            this.isConnected = true;
            this.socket.emit('authenticate', userId);
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from chat server');
            this.isConnected = false;
        });

        this.socket.on('receive_message', (message) => {
            this.notifyMessageHandlers('receive_message', message);
        });

        this.socket.on('message_sent', (message) => {
            this.notifyMessageHandlers('message_sent', message);
        });

        this.socket.on('message_error', (error) => {
            this.notifyMessageHandlers('message_error', error);
        });

        this.socket.on('user_typing', (data) => {
            this.notifyMessageHandlers('user_typing', data);
        });

        this.socket.on('user_status_change', (data) => {
            this.notifyMessageHandlers('user_status_change', data);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
            this.userId = null;
        }
    }

    sendMessage(receiverId, message) {
        if (!this.socket || !this.isConnected) {
            throw new Error('Not connected to chat server');
        }

        this.socket.emit('send_message', {
            senderId: this.userId,
            receiverId,
            message
        });
    }

    sendTypingIndicator(receiverId, isTyping) {
        if (!this.socket || !this.isConnected) {
            return;
        }

        this.socket.emit('typing', {
            receiverId,
            isTyping
        });
    }

    setStatus(status) {
        if (!this.socket || !this.isConnected) {
            return;
        }

        this.socket.emit('set_status', status);
    }

    // Event handler management
    on(event, handler) {
        if (!this.messageHandlers.has(event)) {
            this.messageHandlers.set(event, []);
        }
        this.messageHandlers.get(event).push(handler);
    }

    off(event, handler) {
        if (this.messageHandlers.has(event)) {
            const handlers = this.messageHandlers.get(event);
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    notifyMessageHandlers(event, data) {
        if (this.messageHandlers.has(event)) {
            this.messageHandlers.get(event).forEach(handler => {
                handler(data);
            });
        }
    }

    isSocketConnected() {
        return this.isConnected && this.socket;
    }
}

export const chatService = new ChatService(); 