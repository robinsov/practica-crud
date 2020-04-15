import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';
import { UserModel } from 'src/app/models/usuario.model';
import { ModalService } from '../modalform/modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  nombre: string
  
  usuarios: UserModel[]= [];
  desde = 0;
  limite = 5;
  cantidadRegistros;

  constructor(private _LoginService: LoginService,
              private _modalService: ModalService,
              private router:Router) { 

                this.nombre = localStorage.getItem('nombre');
              }

  ngOnInit(): void {
    


    this._LoginService.getUsers(this.desde, this.limite).subscribe(resp=>{
      this.usuarios = resp;
      this.cantidadRegistros = this._LoginService.cantidadRegistros;
      console.log(this.usuarios);
    })

    this._modalService.notificacion.subscribe(resp => {
      this.getUsers();
    })

    
  }

  cambiarDesde(valor: number){
    
    let desde = this.desde + valor;
 
    if(desde >= this.cantidadRegistros){
      return;
    }
 
    if( desde < 0){
      return;
    }
 
    this.desde += valor;
    this.getUsers();
  }

  getUsers(){
    console.log(this.desde, this.limite);
    this._LoginService.getUsers(this.desde, this.limite).subscribe(resp=>{
      this.usuarios = resp;
      console.log(this.usuarios);
    }) 
  }


  borrarUsuario(id: string){
    this._LoginService.borrarUsuario(id).subscribe(resp => {
      console.log(resp);
      this.getUsers();
      this.cantidadRegistros = this._LoginService.cantidadRegistros;
    })
  }

  actualizarUsuario(usuario: any){

    console.log(usuario);
    this._LoginService.actualizarUsuario(usuario).subscribe(resp => {
      console.log(resp);
      this.getUsers();
    })
  }

  agregarUsuario(){
    console.log('dispara modal');
    this._modalService.mostrarModal();
    
  }

  buscarUsuarios(termino: string){

    if(termino.length <= 0) { 
      this.getUsers();
      return ;
    }

    this._LoginService.buscarUsuarios(termino).subscribe(resp => {
      console.log(resp);
      this.usuarios = resp;
    })
  }


  async cambiarImagen (usuario: UserModel){
   
    let { value: imagen } = await Swal.fire({
      title: 'Seleccione imagen',
      input: 'file',
      inputAttributes: {
        'accept': 'image/*',
        'aria-label': 'Upload your profile picture'
      }
    })

    if (imagen) {
      const reader = new FileReader()
      reader.onload = (e) => {
        let formData = new FormData();
        formData.append('archivo', imagen, imagen.name);

        this._LoginService.cambiarImagen(usuario, formData).subscribe(resp => {
          console.log(resp);
          this.getUsers();
          Swal.fire({
            imageUrl: `${e.target.result}`,
            text: 'imagen subida'
          })
        })
      }
     reader.readAsDataURL(imagen)
    } 
  }

}
