import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private activeClients: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.activeClients.delete(client.id);
  }

  @SubscribeMessage('register')
  handleRegister(client: Socket, userId: string) {
    this.activeClients.set(client.id, userId);
  }

  notifyUser(userId: string, message: any) {
    for (const [socketId, id] of this.activeClients.entries()) {
      if (id === userId) {
        this.server.to(socketId).emit('notification', message);
        break;
      }
    }
  }
}
