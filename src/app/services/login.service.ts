import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/login.models';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserModel } from '../models/usuario.model';





@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url = 'http://localhost:3000';
  cantidadRegistros;

  token = localStorage.getItem('token');
  
  headers = new HttpHeaders({
    token: this.token
  });


  constructor(private http: HttpClient) { }

  login(usuario: UsuarioModel){
    return this.http.post(`${this.url}/login`, usuario);
  }


  getUsers(desde?: number, limite?:number ){
    return this.http.get(`${this.url}/usuario?desde=${desde}&limite=${limite}`, {headers: this.headers}).pipe( 
      map( resp => {
        this.cantidadRegistros = resp['cuantos'];
        console.log(this.cantidadRegistros);
         return resp['usuarios'];
      }) )
  }

  getUsersAll(){
    return this.http.get(`${this.url}/usuario`, {headers: this.headers}).pipe( 
      map( resp => {
        this.cantidadRegistros = resp['cuantos'];
        console.log(this.cantidadRegistros);
        console.log(resp['usuarios']);
         return resp['usuarios'];
      }) )
  }

  borrarUsuario(id: string){
    return this.http.delete(`${this.url}/usuario/${id}`,  {headers: this.headers});
  }


  actualizarUsuario(usuario: any ){
    console.log(usuario._id);

    let usuarioNew = {
      nombre: usuario.nombre
    }

    return this.http.put(`${this.url}/usuario/${usuario._id}`, usuarioNew, {headers: this.headers});
  }

  crearUsuario(usuario: any){
    return this.http.post(`${this.url}/usuario`, usuario, {headers: this.headers});
  }

  buscarUsuarios(termino :string){
    return this.http.get(`${this.url}/usuario`, {headers: this.headers}).pipe( 
      map( resp => {

        let usuarios = resp['usuarios'];

        let usuariosEncontrados = [];
        
        usuarios.forEach(element => {
          if(element.nombre.toLowerCase().indexOf(termino.toLowerCase()) >= 0){
            usuariosEncontrados.push(element);
          }
        });
        
         return usuariosEncontrados;
      }) )
  }


  cambiarImagen(usuario: UserModel, archivo: FormData){
    let url = `http://localhost:3000/upload/usuarios/${usuario._id}`;

    


    return this.http.put(`${url}`, archivo);
  }


}
