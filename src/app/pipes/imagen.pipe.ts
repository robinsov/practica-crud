import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(imagen: string) {

    let url: string = '';

    if(!imagen){
      return url += `assets/no-image.jpg`;
    }

    let token = localStorage.getItem('token');

    url += `http://localhost:3000/image/usuarios/${imagen}`;
    url += `?token=${token}`
    
    return url;

  }

}
