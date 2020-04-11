import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioModel } from 'src/app/models/login.models';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;

  recordarme = false;

  constructor(private _loginService: LoginService,
              private router:Router) { }

  ngOnInit(): void {

    if ( localStorage.getItem('email') ) {
      this.email = localStorage.getItem('email');
      this.recordarme = true;
    }

  }

  login(form: NgForm){

    console.log(form);

    if(form.invalid) {return;}

    let usuario = new UsuarioModel(this.email, this.password);

    this._loginService.login(usuario).subscribe( (resp:any) => {
      console.log(resp);

      if ( this.recordarme ) {
        localStorage.setItem('email', resp.Usuario.email);
      }

      localStorage.setItem('token', resp.token);


      this.router.navigate(['/home']);
    }, err => {
      console.log(err.error.message);
    });
  }


}
