import { Component, OnInit } from '@angular/core';
import { ModalService } from './modal.service';
import { NgForm } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-modalform',
  templateUrl: './modalform.component.html'
})
export class ModalformComponent implements OnInit {

  nombre: string;
  email: string;
  password: string;
  constructor(public _modalService:ModalService,
              public _LoginService: LoginService) { }

  ngOnInit(): void {
  }

  cerrarModal(){
    this.nombre = null;
    this.email = null;
    this.password = null;

    this._modalService.ocultarModal();
  }

  crearUsuario(form: NgForm){
    console.log(form);

    if(form.invalid){return;}

    let usuario = {
      nombre: this.nombre,
      email: this.email,
      password: this.password
    }

    this._LoginService.crearUsuario(usuario).subscribe( resp => {
      this._modalService.notificacion.emit(resp);
      this._modalService.ocultarModal();
     // location.reload();
     
    })
  }


  
}
