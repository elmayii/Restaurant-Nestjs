import { UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AccessGuard } from 'src/auth/auth.guard';
// import { SocketGuard } from 'src/websockets/auth.socketGuard';

//@UseGuards(AccessGuard)
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
    try {
      console.log("Client conected:",client.id)
      //this.activeClients.set(client.id, client.handshake.auth.name);
      //console.log(client.handshake.auth);
    } catch (error) {
      throw new UnauthorizedException({message:"Unauthorized"})
    }
  }


  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.activeClients.delete(client.id);
  }

  @SubscribeMessage('register')
  handleRegister(client: Socket, userId: string) {
    this.activeClients.set(client.id, userId);
    this.notifyUser(client.id, {
      message: 'Auth',
    });
  }

  notifyUser(userId: string, message: any) {
    //console.log(userId)
    for (const [socketId, id] of this.activeClients.entries()) {
      //console.log('otro id:', id)
      // if (id === userId) {
        
      // }
      this.server.to(socketId).emit('notification', message);
        break;
    }
  }
}
