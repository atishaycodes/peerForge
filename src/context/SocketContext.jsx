import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [inQueue, setInQueue] = useState(false);
  const [queueData, setQueueData] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [pendingMatch, setPendingMatch] = useState(null);
  const [matchConfirmed, setMatchConfirmed] = useState(null);

  // Initialize socket instance once
  useEffect(() => {
    const socket = io('/', {
      withCredentials: true,
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('[Socket] Connected to server:', socket.id);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      setInQueue(false);
      setPendingMatch(null);
      console.log('[Socket] Disconnected from server');
    });

    socket.on('match:found', (data) => {
      console.log('[Socket] Match found:', data);
      setPendingMatch(data);
    });

    socket.on('match:confirmed', (data) => {
      console.log('[Socket] Match confirmed, room ready:', data);
      setPendingMatch(null);
      setInQueue(false);
      setMatchConfirmed(data);
      // Navigate to room
      navigate(`/room/${data.roomId}`);
    });

    socket.on('match:cancelled', ({ reason, reQueued }) => {
      console.log('[Socket] Match cancelled:', reason);
      setPendingMatch(null);
      if (reQueued) {
        setInQueue(true);
      }
    });

    socket.on('queue:left', () => {
      setInQueue(false);
      setQueueData(null);
    });

    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  // Connect or disconnect when auth status changes
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    if (user && !socket.connected) {
      socket.connect();
    } else if (!user && socket.connected) {
      socket.disconnect();
      setInQueue(false);
      setPendingMatch(null);
    }
  }, [user]);

  // Stopwatch timer when in queue
  useEffect(() => {
    let timer = null;
    if (inQueue && !pendingMatch) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!inQueue) {
      setElapsedSeconds(0);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [inQueue, pendingMatch]);

  const joinQueue = useCallback(({ track, difficulty }) => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) return;

    setElapsedSeconds(0);
    setInQueue(true);
    setQueueData({ track, difficulty, joinedAt: Date.now() });

    socket.emit('queue:join', { track, difficulty });
  }, []);

  const leaveQueue = useCallback(() => {
    const socket = socketRef.current;
    if (!socket) return;

    setInQueue(false);
    setQueueData(null);
    setElapsedSeconds(0);
    socket.emit('queue:leave');
  }, []);

  const acceptMatch = useCallback((matchId) => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.emit('match:accept', { matchId });
  }, []);

  const declineMatch = useCallback((matchId) => {
    const socket = socketRef.current;
    if (!socket) return;

    setPendingMatch(null);
    socket.emit('match:decline', { matchId });
  }, []);

  const createDirectInvite = useCallback(({ track, difficulty }) => {
    return new Promise((resolve, reject) => {
      const socket = socketRef.current;
      if (!socket || !socket.connected) {
        return reject(new Error('Socket not connected'));
      }

      socket.emit('invite:create', { track, difficulty }, (res) => {
        if (res && res.success) {
          resolve(res);
        } else {
          reject(new Error('Failed to generate invite'));
        }
      });
    });
  }, []);

  const value = {
    socket: socketRef.current,
    isConnected,
    inQueue,
    queueData,
    elapsedSeconds,
    pendingMatch,
    matchConfirmed,
    joinQueue,
    leaveQueue,
    acceptMatch,
    declineMatch,
    createDirectInvite,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

export default SocketContext;

