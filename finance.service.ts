import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';
import { forcastYearlyData } from '../models/forcastYearlyData';
declare var jquery :any;
declare var $ :any;


@Injectable()
export class FinanceService {
  //private readonly URL =  environment.apihost;
  private readonly URL = 'http://localhost:8080/synergyadminservice/service/'

  constructor(
     private httpClient: HttpClient
  ) {}

  saveForecast(formData: any) {
     let forcasteData = { 
       forecastMonth: formData.get('forecastMonth').value, 
       forecastAttachment: formData.get('forecastAttachment').value 
      };

      return $.ajax({
        type: "POST",
        url: `${this.URL}finance/forecast`,
        contentType: "application/json",
        data: JSON.stringify(forcasteData),
        success: function(resultData){
        }
      });
    
  }

  saveActual(formData: any) {
    let actulData = {
      actualsMonth: formData.get('actualTillMonth').value,
      actualsAttachment: formData.get('actualAttachment').value
    }

    return $.ajax({
      type: "POST",
      url: `${this.URL}finance/actuals`,
      contentType: "application/json",
      data: JSON.stringify(actulData),
      success: function(resultData){
      }
    });  
  }
  
  getActualsVsForecastReports(searchCriteria : any): Observable<forcastYearlyData> {
    return this.httpClient.get<forcastYearlyData>(`${this.URL}financereports/actualvsforecast`,  { params: searchCriteria }); 
  }

  getPeriodicActualsReports(searchCriteria : any) : Observable<forcastYearlyData> {
    return this.httpClient.get<forcastYearlyData>(`${this.URL}financereports/peroidicactuals`,  { params: searchCriteria }); 
  }

  getRemarks(searchCriteria : any) : Observable<any> {
    return this.httpClient.get<any>(`${this.URL}finance/getadminremarks`,  { params: searchCriteria }); 
  }

  getAdminChartData(searchCriteria : any) : Observable<forcastYearlyData> {
    return this.httpClient.get<forcastYearlyData>(`${this.URL}finance/getadmingraph`,  { params: searchCriteria }); 
  }

 saveAdminForm(adminFormData : any) : Observable<any> {
    return this.httpClient.post<any>(`${this.URL}finance/submitremarks`, adminFormData); 
  }
}