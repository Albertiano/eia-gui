import { ConfigPdvService } from './../../config-pdv/config-pdv.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { merge } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { saveAs } from 'file-saver';
import { SelectionModel } from '@angular/cdk/collections';

import { ComponentPageTitle } from '../../shared/page-title';
import { TableDataSource } from '../../shared/table-data-source';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { EditComponent } from '../edit/edit.component';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { NotaFiscalService } from '../nota-fiscal.service';
import { NfeService } from '../nfe.service';
import { CancelarComponent } from '../cancelar/cancelar.component';
import { async } from 'rxjs/internal/scheduler/async';
import { ConfigPdvSelectComponent } from 'src/app/config-pdv/select/select.component';

@Component({
  selector: 'eia-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations: [
    trigger('toggleSearch', [
      state('hidden', style({
        opacity: 0,
        'max-height': '0px'
      })),
      state('visible', style({
        opacity: 1,
        'max-height': '70px',
        'margin-top': '20px'
      })),
      transition('* => *', animate('250ms 0s ease-in-out'))
    ])
  ]
})
export class ListComponent implements OnInit, AfterViewInit {

  searchBarState = 'hidden';
  searchForm: FormGroup;
  searchControl: FormControl;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  displayedColumns: string[] = ['select', 'numero', 'dhEmi', 'natOp', 'dest', 'total', 'sitNfe', 'actions'];

  dataSource: TableDataSource;

  selection = new SelectionModel<any>(true, []);

  isAllSelected: Boolean;

  props = {
    pageIndex: 0,
    pageSize: 8,
    sortBy: 'numero, desc',
    filter: ''
  };

  FabOptions = {
    buttons: [
      {
        icon: 'search',
        action: 'toggleSearch'
      },
      {
        icon: 'add',
        action: 'novo'
      },
      {
        icon: 'edit',
        action: 'edit'
      },
      {
        icon: 'print',
        action: 'danfe'
      },
      {
        icon: 'archive',
        action: 'exportar'
      }
    ]
  };

  constructor(
    private fb: FormBuilder,
    public _componentPageTitle: ComponentPageTitle,
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService,
    private service: NotaFiscalService,
    private nfeService: NfeService,
    private configPdv: ConfigPdvService) {}

  ngOnInit() {
    this.searchControl = this.fb.control('');
    this.searchForm = this.fb.group({
      searchControl: this.searchControl
    });

    this.searchControl.valueChanges
    .pipe(
      debounceTime(600),
      distinctUntilChanged(),
      map(searchTerm => {
        this.props.filter = searchTerm;
        if (searchTerm === '') {
          this.toggleSearch();
        }
        return this.props;
      }
      )
    ).subscribe(() => {
      this.selection.clear();
      this.loadPage();
    });

    this.dataSource = new TableDataSource(this.service);
    this.dataSource.loadRegisters(this.props);

    this._componentPageTitle.title = 'Nota Fiscal';
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadPage()))
      .subscribe();
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.dataSource.data$.subscribe(res => {
      const numSelected = this.selection.selected.length;
      const numRows = this.paginator.pageSize;
      if (numSelected >= numRows) {
        this.selection.clear();
        this.isAllSelected = false;
      } else {
        res.forEach(row => {
          this.selection.select(row);
        });
        this.isAllSelected = true;
      }
    });
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  isSelected() {
    if (this.selection.selected.length > 0) {
      return true;
    } else {
      this.snackBar.open('Não há registros selecionados', null, { duration: 8000, });
      return false;
    }
  }

  onSpeedDialFabClicked(btn) {
      switch (btn.action) {
        case 'toggleSearch':
          if (this.isSelected()){
            this.toggleSearch();
          }
          break;
        case 'novo':
          this.novo();
          break;
        case 'edit':
          if (this.isSelected()){
            this.selection.selected.forEach(row => {
              this.edit(row);
            });
          }
          break;
        case 'danfe':
          if (this.isSelected()){
            this.danfes();
          }
          break;
        case 'exportar':
          if (this.isSelected()){
            this.danfes();
            this.exportar2();
          }
          break;
        default:
      }
  }

  toggleSearch() {
    this.searchBarState = this.searchBarState === 'hidden' ? 'visible' : 'hidden';
  }

  loadPage() {
    this.props.pageIndex = this.paginator.pageIndex;
    this.props.pageSize = this.paginator.pageSize;
    this.dataSource.loadRegisters(this.props);
    this.selection.clear();
  }

  novo() {
    const registro = {
      natOp: 'Venda',
      mod: '55',
      sitNfe: 'Digitação'
    };
    this.edit(registro);
  }

  refresh() {
    this.paginator.pageIndex = 0;
    this.props.pageIndex = 0;
    this.dataSource.loadRegisters(this.props);
    this.selection.clear();
  }

  edit(registro) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.height = '90%';
    dialogConfig.width = '95%';
    dialogConfig.maxWidth = '99vw';
    dialogConfig.maxHeight = '99vw';
    dialogConfig.data = { registro };
    dialogConfig.panelClass = 'eia-dialog';

    if (this.configPdv.getPDV()) {
      const dialogRef = this.dialog.open(EditComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(
        (register) => {
          if (register) {
            if (register.sitNfe === 'Digitação' || register.sitNfe === 'Rejeitada') {
              this.service.save(register).subscribe(() => {
                this.paginator.pageIndex = 0;
                this.props.pageIndex = 0;
                this.dataSource.loadRegisters(this.props);
                this.selection.clear();
              }, erro => {
                this.errorHandler.handle(erro);
              });
            } else {
              this.snackBar.open('Não é possível alterar uma Nota Fiscal [' + registro.sitNfe + ']', null, { duration: 13000, });
            }
          }
        }
      );
    } else {
      const dialogRef = this.dialog.open(ConfigPdvSelectComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(
        (register) => {
            if (register) {
              this.configPdv.setPDV(register);
              this.edit(registro);
            } else {
              this.snackBar.open('Selecione um PDV para continuar!', null, { duration: 13000, });
            }
        }
      );
    }
  }

  remove(registro) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { registro };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (obj) => {
        if (obj) {
          this.service.remove(obj.id).subscribe(() => {
            this.paginator.pageIndex = 0;
            this.props.pageIndex = 0;
            this.dataSource.loadRegisters(this.props);
            this.selection.clear();
          }, erro => {
            this.errorHandler.handle(erro);
          });
        }
      }
    );
  }

  duplicar(registro) {
    this.snackBar.open('Duplicando a Nota Fiscal ' + registro.numero, null, { duration: 20000, });
    this.service.duplicar(registro.id).subscribe(() => {
      this.snackBar.open('Duplicado com sucesso', null, { duration: 5000, });
      this.dataSource.loadRegisters(this.props);
    }, erro => {
      console.log(erro);
      this.dataSource.loadRegisters(this.props);
      this.errorHandler.handle(erro);
    });
  }

  danfe(registro) {
    this.snackBar.open('Baixando a Nota Fiscal ' + registro.numero, null, { duration: 20000, });
    this.nfeService.danfe(registro).subscribe((res) => {
      this.snackBar.open('Abrindo ... ' + registro.numero, null, { duration: 5000, });
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, 'Nota Fiscal', 'toolbar=0,location=0,status=0,menubar=0,scrollbars=1,resizable=0,width=800,height=600,top=30');
    }, erro => {
      console.log(erro);
      this.dataSource.loadRegisters(this.props);
      this.errorHandler.handle(erro);
    });
  }

  danfes() {
    this.snackBar.open('Baixando a Notas Fiscais ...', null, { duration: 20000, });
    this.nfeService.danfes(this.selection.selected).subscribe((res) => {
      this.snackBar.open('Abrindo ... ', null, { duration: 5000, });
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, 'Nota Fiscal', 'toolbar=0,location=0,status=0,menubar=0,scrollbars=1,resizable=0,width=800,height=600,top=30');
    }, erro => {
      console.log(erro);
      this.dataSource.loadRegisters(this.props);
      this.errorHandler.handle(erro);
    });
  }

  exportar2() {
    this.snackBar.open('Exportando a Notas Fiscais ...', null, { duration: 20000, });
    this.service.exportar2(this.selection.selected).subscribe((res) => {
      this.snackBar.open('Concluída a requisição de download ...', null, { duration: 5000, });
      saveAs(res, `notas.zip`);
    }, erro => {
      console.log(erro);
      this.dataSource.loadRegisters(this.props);
      this.errorHandler.handle(erro);
    });
  }

  exportar(registro) {
    this.snackBar.open('Exportando a Nota Fiscal ' + registro.numero, null, { duration: 20000, });
    this.service.exportar(registro).subscribe((res) => {
      this.snackBar.open('Concluída a requisição de download ... ' + registro.numero, null, { duration: 5000, });
      saveAs(res, `${registro.chave}.zip`);
    }, erro => {
      console.log(erro);
      this.dataSource.loadRegisters(this.props);
      this.errorHandler.handle(erro);
    });
  }

  transmitir(registro) {
    this.snackBar.open('Enviando a Nota Fiscal ' + registro.numero, null, { duration: 20000, });
    this.nfeService.enviar(registro).subscribe((resEnvi) => {
      this.snackBar.open(resEnvi.motivo, null, { duration: 5000, });
      if (resEnvi.sucesso) {
        this.snackBar.open('Consultando resultado da  Nota Fiscal ' + registro.numero, null, { duration: 20000, });
        this.nfeService.consultaRecibo(resEnvi).subscribe((resCons) => {
          this.snackBar.open(resCons.motivo, null, { duration: 5000, });
          this.dataSource.loadRegisters(this.props);
        }, erro => {
          this.dataSource.loadRegisters(this.props);
          this.errorHandler.handle(erro);
        });
      } else {
        this.dataSource.loadRegisters(this.props);
      }
    }, erro => {
      this.dataSource.loadRegisters(this.props);
      this.errorHandler.handle(erro);
    });
  }

  cancelar(registro) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.height = '90%';
    // dialogConfig.width = '95%';
    dialogConfig.maxWidth = '99vw';
    dialogConfig.maxHeight = '99vw';
    dialogConfig.data = { registro };
    dialogConfig.panelClass = 'eia-dialog';
    const dialogRef = this.dialog.open(CancelarComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (register) => {
        if (register) {
          this.dataSource.ativarLoading();
          this.snackBar.open('Cancelando a Nota Fiscal ' + register.notaFiscal.numero, null, { duration: 20000, });
          this.nfeService.cancelar(register.notaFiscal, register.motivo).subscribe((resCanc) => {
            console.log(resCanc);
            this.snackBar.open(resCanc.motivo, null, { duration: 5000, });
            if (resCanc.sucesso) {
              this.snackBar.open('Consultando a situação da  Nota Fiscal ' + register.notaFiscal.numero, null, { duration: 20000, });
              this.nfeService.consultar(register.notaFiscal).subscribe((resCons) => {
                console.log(resCons);
                this.snackBar.open(resCons.motivo, null, { duration: 5000, });
                this.dataSource.loadRegisters(this.props);
              }, erro => {
                this.dataSource.loadRegisters(this.props);
                this.errorHandler.handle(erro);
              });
            } else {
              this.dataSource.loadRegisters(this.props);
            }
          }, erro => {
            this.dataSource.loadRegisters(this.props);
            this.errorHandler.handle(erro);
          });
        }
      }
    );
  }

}
