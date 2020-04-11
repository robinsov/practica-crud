import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  public oculto: string='oculto';

  public notificacion = new EventEmitter<any>();
  constructor() { }

  ocultarModal(){
    this.oculto = 'oculto';
  }
  
  mostrarModal(){
    this.oculto = '';
  }
}
