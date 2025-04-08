import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Performance } from '../models/performance.model';
import { AgencePerformance } from '../models/agence-performance.model';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private baseUrl = 'http://localhost:8089/performance';
  private statsApiUrl = 'http://localhost:8089/api/statistics';

  constructor(private http: HttpClient) { }

  getAllPerformances(): Observable<Performance[]> {
    return this.http.get<Performance[]>(`${this.baseUrl}/all`);
  }

  getPerformanceById(id: number): Observable<Performance> {
    return this.http.get<Performance>(`${this.baseUrl}/${id}`);
  }

  createPerformance(performance: any): Observable<Performance> {
    // If agence is provided as an ID (number), convert it to an object with idAgence property
    if (performance.agence && typeof performance.agence === 'number') {
      performance = {
        ...performance,
        agence: {
          idAgence: performance.agence
        }
      };
    }
    return this.http.post<Performance>(`${this.baseUrl}/add`, performance);
  }

  updatePerformance(id: number, performance: any): Observable<Performance> {
    // If agence is provided as an ID (number), convert it to an object with idAgence property
    if (performance.agence && typeof performance.agence === 'number') {
      performance = {
        ...performance,
        agence: {
          idAgence: performance.agence
        }
      };
    }
    return this.http.put<Performance>(`${this.baseUrl}/update/${id}`, performance);
  }

  deletePerformance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  getPerformancesByAgence(agenceId: number): Observable<Performance[]> {
    return this.http.get<Performance[]>(`${this.baseUrl}/byAgence/${agenceId}`);
  }

  getPerformancesByDateRange(startDate: string, endDate: string): Observable<Performance[]> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<Performance[]>(`${this.baseUrl}/byDateRange`, { params });
  }

  exportPerformancesToExcel(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/exportExcel`, { responseType: 'blob' });
  }

  exportPerformancesToPdf(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/exportPdf`, { responseType: 'blob' });
  }

  generateStatistics(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/statistics`, { responseType: 'blob' });
  }
  
  getTopAgencesByRevenue(limit: number = 5, startDate: string, endDate: string): Observable<AgencePerformance[]> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get<AgencePerformance[]>(
      `${this.statsApiUrl}/top-revenue`, 
      { params }
    );
  }
  
  getTopAgencesByContracts(limit: number = 5, startDate: string, endDate: string): Observable<AgencePerformance[]> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get<AgencePerformance[]>(
      `${this.statsApiUrl}/top-contracts`, 
      { params }
    );
  }
  
  getAgencePerformance(agenceId: number, startDate: string, endDate: string): Observable<AgencePerformance> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get<AgencePerformance>(
      `${this.statsApiUrl}/agency-performance/${agenceId}`, 
      { params }
    );
  }

  exportStatisticsToPdf(limit: number, startDate: string, endDate: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/statistics`, {
      responseType: 'blob',
      params: {
        limit: limit.toString(),
        startDate,
        endDate
      }
    });
  }

  exportToExcel(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/exportExcel`, {
      responseType: 'blob'
    });
  }

  exportToPdf(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/exportPdf`, {
      responseType: 'blob'
    });
  }
}