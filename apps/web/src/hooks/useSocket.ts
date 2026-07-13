import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useServerStore } from '../stores/serverStore';
import { useNotificationStore } from '../stores/notificationStore';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const activeServerId = useServerStore(state => state.activeServerId);
  const addNotification = useNotificationStore(state => state.addNotification);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to websocket server');
    });

    newSocket.on('alert:push', (data) => {
      if (data.serverId === activeServerId || !activeServerId) {
        addNotification(data);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [activeServerId, addNotification]);

  return socket;
}
