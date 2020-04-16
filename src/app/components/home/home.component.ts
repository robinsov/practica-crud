import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';
import { UserModel } from 'src/app/models/usuario.model';
import { ModalService } from '../modalform/modal.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  nombre: string
  
  usuarios: UserModel[]= [];
  cantidadRegistros = 0;
  

  // MatPaginator Inputs
  page_number = 1;
  page_size = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(private _LoginService: LoginService,
              private _modalService: ModalService,
              private router:Router) { 

                this.nombre = localStorage.getItem('nombre');
              }
             
      
  ngOnInit(): void {
    
    this._LoginService.getUsers().subscribe(resp=>{
      this.usuarios = resp;
      this.cantidadRegistros = this._LoginService.cantidadRegistros;
    })
  }


  handlePage(e: PageEvent){
    this.page_size = e.pageSize;
    this.page_number = e.pageIndex + 1;
  }


  getUsers(){
    this._LoginService.getUsers().subscribe(resp=>{
      this.usuarios = resp;
      this.cantidadRegistros = this.usuarios.length;
    }) 
  }


  borrarUsuario(id: string){


    Swal.fire({
      title: 'Esta seguro?',
      text: "No hay marcha atras!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borrarlo!'
    }).then((result) => {
      if (result.value) {
        this._LoginService.borrarUsuario(id).subscribe((resp:any) => {
          this.getUsers();
          this.cantidadRegistros = this._LoginService.cantidadRegistros;
            Swal.fire(
              `El usuario ${resp.usuarioBorrado.nombre}`,
              'Ha sido Borrado!',
              'success'
              )
          })
      }
    })


  }

  actualizarUsuario(usuario: any){

    console.log(usuario);
    this._LoginService.actualizarUsuario(usuario).subscribe((resp: any) => {
      console.log(resp);
      Swal.fire(`Usuario actualizado a ${resp.usuario.nombre}`)
      this.getUsers();
    })
  }

  agregarUsuario(){
    console.log('dispara modal');
    this._modalService.mostrarModal();
  this._modalService.notificacion.subscribe(resp => {
    this.getUsers();
  })
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
