import { Component, OnInit } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public files: NgxFileDropEntry[] = [];
  archivo = {
    nombre: null,
    base64: null
  }
  constructor() {}

  ngOnInit() {
    
  }

  seleccionarArchivo(files: NgxFileDropEntry[]) {

    this.files = files;
    
    for (const droppedFile of files) {
 
      // Es un archivo ?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.relativePath, file);
          // AQUÍ ES LA ITERACIÓN DE CADA ARCHIVO, PODES AGREGAR LA INFO A EL MODELO QUE NECESITES E IRLA
          // GUARDANDO EN UN ARRAY QUE POSTERIOR INSERTARAS EN LA BD O GUARDARAS ESOS ARCHIVOS

          // AQUI LE DOY EL NOMBRE DEL ARCHIVO:
          this.archivo.nombre = droppedFile.relativePath;
          // ESTO LO TRANSFORMA A BASE 64 ( EL MÉTODO __handleReaderLoaded.bind(this)):
          var reader = new FileReader();
          reader.onload = this._handleReaderLoaded.bind(this);
          reader.readAsBinaryString(file);
          
        });
      } else {
        // directorios vacios
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }

  }

  _handleReaderLoaded(readerEvent){
    var binaryString = readerEvent.target.result;
    this.archivo.base64 = btoa(binaryString);
    console.log("Nombre " + this.archivo.nombre + " Base 64 " + this.archivo.base64);
    // AQUÍ YA CONVERTIDO A BASE 64 LO GUARDAS EN LA VARIABLE DEL MODELO Y AQUÍ PODES HACER EL PUSH AL ARRAY
  }

  // ESTE METODO YA IRIA AL SERVICIO Y GUARDARIA LAS IMAGENES EN EL SERVER 
  public dropped() {
    //VALIDACION DE QUE NO AGREGO DOCUMENTOS
    if(this.files.length==0){
      Swal.fire({
        title:"No hay documentos!",
        text:'No se puede guardar la información sin el archivo correspondiente.',
        icon:'error'
      });
      return;
    }
    /*Swal.fire({
      title:'Espere',
      text:'Guardando Información',
      icon:'info',
      allowOutsideClick:false
    });

    Swal.showLoading();*/
      
  }
 
  public fileOver(event){
    console.log(event);
  }
 
  public fileLeave(event){
    console.log(event);
  }
}
