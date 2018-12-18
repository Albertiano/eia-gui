import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

export class TableDataSource implements DataSource<any> {

  private registersSubject = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private countSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();
  public count$ = this.countSubject.asObservable();

  constructor(private service: any) {}

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
      return this.registersSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
      this.registersSubject.complete();
      this.loadingSubject.complete();
  }

  loadRegisters(props) {
      this.loadingSubject.next(true);

      this.service.loadRegistros(props).pipe(
          catchError(() => of([])),
          finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(result => {
        if (result['content']) {
          this.registersSubject.next(result['content']);
          this.countSubject.next(result['totalElements']);
        } else {
          this.registersSubject.next(result);
          this.countSubject.next(result.length);
        }
      });
  }

  ativarLoading(finalizado?) {
    if (finalizado) {
      this.loadingSubject.next(finalizado);
      return;
    }
    this.loadingSubject.next(true);
  }
}
