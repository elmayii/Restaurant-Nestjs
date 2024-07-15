import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
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
  constructor(private readonly prisma: PrismaService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.activeClients.delete(client.id);
  }

  @SubscribeMessage('register')
  async handleRegister(client: Socket, userId: string) {
    this.activeClients.set(client.id, userId);
    const notificaciones = await this.prisma.notificaciones.findMany({
      where: {
        id_usuario: userId,
        estado: false,
      },
    });
    client.emit('notification', notificaciones);
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
