import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { merge } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { ComponentPageTitle } from '../../shared/page-title';
import { TableDataSource } from '../../shared/table-data-source';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { EditComponent } from '../edit/edit.component';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { ContaService } from '../conta.service';

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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['descricao', 'saldo', 'actions'];

  dataSource: TableDataSource;

  props = {
    pageIndex: 0,
    pageSize: 8,
    sortBy: 'descricao',
    filter: ''
  };

  constructor(
    private fb: FormBuilder,
    public _componentPageTitle: ComponentPageTitle,
    private dialog: MatDialog,
    private errorHandler: ErrorHandlerService,
    private service: ContaService) {}

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
      this.loadPage();
    });

    this.dataSource = new TableDataSource(this.service);
    this.dataSource.loadRegisters(this.props);

    this._componentPageTitle.title = 'Contas';
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadPage()))
      .subscribe();
  }

  toggleSearch() {
    this.searchBarState = this.searchBarState === 'hidden' ? 'visible' : 'hidden';
  }

  loadPage() {
    this.props.pageIndex = this.paginator.pageIndex;
    this.dataSource.loadRegisters(this.props);
  }

  novo() {
    const registro = {};
    this.edit(registro);
  }

  edit(registro) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.height = '90%';
    dialogConfig.width = '40%';
    dialogConfig.maxWidth = '99vw';
    dialogConfig.data = { registro };
    const dialogRef = this.dialog.open(EditComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (register) => {
        if (register) {
          this.service.save(register).subscribe(() => {
            this.paginator.pageIndex = 0;
            this.props.pageIndex = 0;
            this.dataSource.loadRegisters(this.props);
          }, erro => {
            this.errorHandler.handle(erro);
          });
        }
      }
    );
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
          }, erro => {
            this.errorHandler.handle(erro);
          });
        }
      }
    );
  }

}
