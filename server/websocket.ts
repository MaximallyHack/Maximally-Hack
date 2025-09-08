import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

interface WebSocketMessage {
  type: 'event_update' | 'participant_joined' | 'submission_created' | 'judge_activity' | 'analytics_update';
  eventId: string;
  data: any;
  timestamp: string;
}

interface ClientConnection {
  ws: WebSocket;
  userId: string;
  eventId?: string;
  isOrganizer: boolean;
}

class WebSocketManager {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, ClientConnection> = new Map();

  initialize(server: Server) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws'
    });

    this.wss.on('connection', (ws: WebSocket, request) => {
      console.log('[WebSocket] New connection established');
      
      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(ws, data);
        } catch (error) {
          console.error('[WebSocket] Invalid message format:', error);
          ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        // Remove client from connections
        for (const [id, client] of Array.from(this.clients.entries())) {
          if (client.ws === ws) {
            this.clients.delete(id);
            console.log(`[WebSocket] Client ${id} disconnected`);
            break;
          }
        }
      });

      ws.on('error', (error) => {
        console.error('[WebSocket] Connection error:', error);
      });
    });

    console.log('[WebSocket] Server initialized');
  }

  private handleMessage(ws: WebSocket, data: any) {
    switch (data.type) {
      case 'authenticate':
        this.authenticateClient(ws, data);
        break;
      case 'subscribe_event':
        this.subscribeToEvent(ws, data.eventId);
        break;
      case 'unsubscribe_event':
        this.unsubscribeFromEvent(ws, data.eventId);
        break;
      default:
        console.log('[WebSocket] Unknown message type:', data.type);
    }
  }

  private authenticateClient(ws: WebSocket, data: any) {
    const { userId, isOrganizer } = data;
    const clientId = `${userId}_${Date.now()}`;
    
    this.clients.set(clientId, {
      ws,
      userId,
      isOrganizer: isOrganizer || false
    });

    ws.send(JSON.stringify({
      type: 'authenticated',
      clientId,
      message: 'Successfully authenticated'
    }));

    console.log(`[WebSocket] Client authenticated: ${userId} (organizer: ${isOrganizer})`);
  }

  private subscribeToEvent(ws: WebSocket, eventId: string) {
    // Find client and update their event subscription
    for (const client of Array.from(this.clients.values())) {
      if (client.ws === ws) {
        client.eventId = eventId;
        ws.send(JSON.stringify({
          type: 'subscribed',
          eventId,
          message: `Subscribed to event ${eventId}`
        }));
        console.log(`[WebSocket] Client subscribed to event: ${eventId}`);
        break;
      }
    }
  }

  private unsubscribeFromEvent(ws: WebSocket, eventId: string) {
    for (const client of Array.from(this.clients.values())) {
      if (client.ws === ws && client.eventId === eventId) {
        client.eventId = undefined;
        ws.send(JSON.stringify({
          type: 'unsubscribed',
          eventId,
          message: `Unsubscribed from event ${eventId}`
        }));
        console.log(`[WebSocket] Client unsubscribed from event: ${eventId}`);
        break;
      }
    }
  }

  // Broadcast to organizers of a specific event
  broadcastToEventOrganizers(eventId: string, message: WebSocketMessage) {
    const organizerClients = Array.from(this.clients.values()).filter(
      client => client.isOrganizer && (client.eventId === eventId || !client.eventId)
    );

    organizerClients.forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    });

    console.log(`[WebSocket] Broadcasted to ${organizerClients.length} organizers for event ${eventId}`);
  }

  // Broadcast to all clients subscribed to an event
  broadcastToEvent(eventId: string, message: WebSocketMessage) {
    const eventClients = Array.from(this.clients.values()).filter(
      client => client.eventId === eventId
    );

    eventClients.forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    });

    console.log(`[WebSocket] Broadcasted to ${eventClients.length} clients for event ${eventId}`);
  }

  // Send real-time analytics update
  sendAnalyticsUpdate(eventId: string, analytics: any) {
    this.broadcastToEventOrganizers(eventId, {
      type: 'analytics_update',
      eventId,
      data: analytics,
      timestamp: new Date().toISOString()
    });
  }

  // Send participant registration notification
  sendParticipantJoined(eventId: string, participant: any) {
    this.broadcastToEventOrganizers(eventId, {
      type: 'participant_joined',
      eventId,
      data: participant,
      timestamp: new Date().toISOString()
    });
  }

  // Send submission notification
  sendSubmissionCreated(eventId: string, submission: any) {
    this.broadcastToEventOrganizers(eventId, {
      type: 'submission_created',
      eventId,
      data: submission,
      timestamp: new Date().toISOString()
    });
  }

  // Send judge activity notification
  sendJudgeActivity(eventId: string, activity: any) {
    this.broadcastToEventOrganizers(eventId, {
      type: 'judge_activity',
      eventId,
      data: activity,
      timestamp: new Date().toISOString()
    });
  }

  // Send general event update
  sendEventUpdate(eventId: string, update: any) {
    this.broadcastToEvent(eventId, {
      type: 'event_update',
      eventId,
      data: update,
      timestamp: new Date().toISOString()
    });
  }

  getConnectedClients() {
    return {
      total: this.clients.size,
      organizers: Array.from(this.clients.values()).filter(c => c.isOrganizer).length,
      participants: Array.from(this.clients.values()).filter(c => !c.isOrganizer).length
    };
  }
}

export const websocketManager = new WebSocketManager();