import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';

import { DestinoEditComponent } from './../destino-edit/destino-edit.component';

@Component({
  selector: 'eia-destino',
  templateUrl: './destino.component.html',
  styleUrls: ['./destino.component.scss']
})
export class DestinoComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['estado', 'cfop', 'icms', 'actions'];

  @Input()
  tributacao: any;
  dataSource: MatTableDataSource<any>;

  @Output() saveRegistro = new EventEmitter();

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.tributacao.destinos);
  }

  ngAfterViewInit() {
  }

  save () {
    this.saveRegistro.emit(this.tributacao);
  }

  edit(index) {
    const registro = this.tributacao.destinos[index];
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.height = '90%';
    dialogConfig.width = '99%';
    dialogConfig.maxWidth = '99vw';
    dialogConfig.data = { registro };
    const dialogRef = this.dialog.open(DestinoEditComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (register) => {
        if (register) {
          this.tributacao.destinos[index] = register;
          this.dataSource.data = this.tributacao.destinos;
          this.save();
        }
      }
    );
  }

}
