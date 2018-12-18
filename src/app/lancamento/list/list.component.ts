import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { merge } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

import * as moment from 'moment';

import { ComponentPageTitle } from '../../shared/page-title';
import { TableDataSource } from '../../shared/table-data-source';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { EditComponent } from '../edit/edit.component';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { LancamentoService } from '../lancamento.service';

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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['competencia', 'contato', 'descricao', 'documento', 'valor', 'conta', 'actions'];

  dataSource: TableDataSource;

  props = {
    pageIndex: 0,
    pageSize: 9,
    sortBy: 'competencia',
    filter: '',
    ini: moment().subtract(365, 'days'),
    fim: moment().add(365, 'days')
  };

  constructor(
    private fb: FormBuilder,
    public _componentPageTitle: ComponentPageTitle,
    private dialog: MatDialog,
    private errorHandler: ErrorHandlerService,
    private service: LancamentoService) {}

  ngOnInit() {
    this.searchForm = this.fb.group({
      searchControl: [this.props.filter],
      ini: [moment().subtract(7, 'days').format('DD/MM/YYYY HH:mm:ss')],
      fim: [moment().add(7, 'days').format('DD/MM/YYYY HH:mm:ss')]
    });

    this.dataSource = new TableDataSource(this.service);
    // this.dataSource.loadRegisters(this.props);
    this.totalPages();

    this._componentPageTitle.title = 'Lançamentos Financeiros';
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadPage()))
      .subscribe();
  }

  find() {
    this.props.ini = moment(this.searchForm.get('ini').value, 'DD/MM/YYYY HH:mm:ss').utc();
    this.props.fim = moment(this.searchForm.get('fim').value, 'DD/MM/YYYY HH:mm:ss').utc();
    this.props.filter = this.searchForm.get('searchControl').value;
    this.totalPages();
  }

  toggleSearch() {
    this.searchBarState = this.searchBarState === 'hidden' ? 'visible' : 'hidden';
  }

  loadPage() {
    this.props.pageIndex = this.paginator.pageIndex;
    this.props.pageSize = this.paginator.pageSize;
    this.dataSource.loadRegisters(this.props);
  }

  totalPages() {
    this.service.totalPages(this.props).subscribe((total) => {
      this.paginator.pageIndex = total;
      this.loadPage();
    }, erro => {
      this.errorHandler.handle(erro);
    });
  }

  novo() {
    this.service.novo().subscribe((registro) => (this.edit(registro)), erro => {
      const registro = {};
      this.edit(registro);
    });
  }

  edit(registro) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.height = '90%';
    dialogConfig.width = '60%';
    dialogConfig.maxWidth = '99vw';
    dialogConfig.data = { registro };
    const dialogRef = this.dialog.open(EditComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (register) => {
        if (register) {
          this.service.save(register).subscribe(() => {
            /** this.paginator.pageIndex = 0;
            this.props.pageIndex = 0;
            this.dataSource.loadRegisters(this.props);*/
            this.totalPages();
          }, erro => {
            this.errorHandler.handle(erro);
          });
        } else {
          this.dataSource.loadRegisters(this.props);
        }
      }
    );
  }

  debito() {
    return true;
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
            /** this.paginator.pageIndex = 0;
            this.props.pageIndex = 0;
            this.dataSource.loadRegisters(this.props);*/
            this.totalPages();
          }, erro => {
            this.errorHandler.handle(erro);
          });
        }
      }
    );
  }

}
