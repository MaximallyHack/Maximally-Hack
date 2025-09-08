import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketMessage {
  type: 'event_update' | 'participant_joined' | 'submission_created' | 'judge_activity' | 'analytics_update';
  eventId: string;
  data: any;
  timestamp: string;
}

interface UseWebSocketOptions {
  userId?: string;
  isOrganizer?: boolean;
  eventId?: string;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  autoReconnect?: boolean;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    userId,
    isOrganizer = false,
    eventId,
    onMessage,
    onConnect,
    onDisconnect,
    autoReconnect = true
  } = options;

  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN || isConnecting) {
      return;
    }

    setIsConnecting(true);
    
    try {
      // Determine WebSocket URL
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws`;
      
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('[WebSocket] Connected to server');
        setIsConnected(true);
        setIsConnecting(false);
        reconnectAttempts.current = 0;
        
        // Authenticate if userId is provided
        if (userId) {
          ws.current?.send(JSON.stringify({
            type: 'authenticate',
            userId,
            isOrganizer
          }));
        }
        
        onConnect?.();
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('[WebSocket] Received message:', message);
          
          // Handle different message types
          switch (message.type) {
            case 'authenticated':
              console.log('[WebSocket] Authenticated successfully');
              // Subscribe to event if eventId is provided
              if (eventId) {
                ws.current?.send(JSON.stringify({
                  type: 'subscribe_event',
                  eventId
                }));
              }
              break;
            case 'subscribed':
              console.log(`[WebSocket] Subscribed to event: ${message.eventId}`);
              break;
            case 'event_update':
            case 'participant_joined':
            case 'submission_created':
            case 'judge_activity':
            case 'analytics_update':
              setLastMessage(message);
              onMessage?.(message);
              break;
            default:
              console.log('[WebSocket] Unknown message type:', message.type);
          }
        } catch (error) {
          console.error('[WebSocket] Error parsing message:', error);
        }
      };

      ws.current.onclose = (event) => {
        console.log('[WebSocket] Connection closed:', event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);
        onDisconnect?.();
        
        // Auto-reconnect logic
        if (autoReconnect && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          console.log(`[WebSocket] Reconnecting in ${delay}ms... (attempt ${reconnectAttempts.current + 1})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        }
      };

      ws.current.onerror = (error) => {
        console.error('[WebSocket] Connection error:', error);
        setIsConnecting(false);
      };

    } catch (error) {
      console.error('[WebSocket] Failed to create connection:', error);
      setIsConnecting(false);
    }
  }, [userId, isOrganizer, eventId, onMessage, onConnect, onDisconnect, autoReconnect, isConnecting]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  const subscribeToEvent = useCallback((newEventId: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'subscribe_event',
        eventId: newEventId
      }));
    }
  }, []);

  const unsubscribeFromEvent = useCallback((eventIdToUnsubscribe: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'unsubscribe_event',
        eventId: eventIdToUnsubscribe
      }));
    }
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('[WebSocket] Cannot send message: connection not open');
    }
  }, []);

  // Auto-connect when options change
  useEffect(() => {
    if (userId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [userId, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isConnecting,
    lastMessage,
    connect,
    disconnect,
    subscribeToEvent,
    unsubscribeFromEvent,
    sendMessage
  };
}