import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any',
})
export class DatabaseMaintenanceService {
  private apiUrl = `${environment.apiUrl}/DatabaseMaintenance`;

  constructor(private http: HttpClient) {}

  getTableMetadata(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tables/metadata`);
  }

  backupTables(tables: string[]): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/backup/tables`, tables, {
      responseType: 'blob',
    });
  }

  exportTableToCSV(tableName: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/csv/${tableName}`, {
      responseType: 'blob',
    });
  }

  exportTablesToZip(tables: string[]): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/export/csv/zip`, tables, {
      responseType: 'blob',
    });
  }
}
