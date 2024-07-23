export interface patchNotification{
    id:number,
    state:boolean;
}

export interface NotificationDto{
    id_usuario: string;
    tipo: string;
    nombre: string;
    descripcion: string;
    estado: boolean;
}