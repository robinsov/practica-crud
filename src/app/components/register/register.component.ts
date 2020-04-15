import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/usuario.model';
import { NgForm } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioModel } from 'src/app/models/login.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

  email: string;
  password: string;
  nombre: string;


  constructor(private _loginService: LoginService,
              private router: Router) { }

  ngOnInit(): void {
  }

  crearUsuario(form: NgForm){

    if(form.invalid){
      return
    }
    
    let usuario = new UsuarioModel(this.email, this.password, this.nombre);
    console.log(usuario);


    this._loginService.crearUsuario(usuario).subscribe(resp => {
      console.log(resp);

    })


  }

}
