import { Component, OnInit, ViewContainerRef, } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Utility } from '../../../utils/utility';
import { Subject } from 'rxjs/Subject';

import { Chart } from 'chart.js';
import { Data } from '@angular/router/src/config';
import { Window } from 'selenium-webdriver';

import { FinanceService } from '../../../services/finance.service';
import { HttpErrorResponse } from '@angular/common/http';
import { forcastYearlyData } from '../../../models/forcastYearlyData';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { DatePipe } from '@angular/common/src/pipes/date_pipe';

@Component({

  selector: 'app-fs-dashboard',
  templateUrl: './fs-dashboard.component.html',
})

export class FsDashboardComponent implements OnInit {
  errorMessage: string;
  private unsubscribe: Subject<boolean> = new Subject();
  dashboardForm: FormGroup;

  yearlyForecastResult:forcastYearlyData;
  forecastEntity:any[];
  actualsEntity:any[];
  actualsEntities: any[];
  lobWiseActualsReport:any;
  lobWiseForecastReport : any;
  lobwiseTotalReport : any;
  totalNetRevenue: Number;
  mixedDatasets: any = [];
  actualsMonthlyCMLineChart : any;
  actualsMonthlyRevenueBarChart : any;
  mixedDatasetForPeriodicActuals : any = [];
  totalRevenueForecast: Number;
  totalRevenueActuals: Number;
  averageCMPerForecast: Number;
  averageCMPerActuals: Number;

  //Quarterly and half yearly periodic actuals variables
  year: Number;
  public period: Number;
  public totalCost: Number;
  public averageCMPercentage: Number;
  public quarterOneNetRevenue: Number;
  public quarterTwoNetRevenue: Number;
  public quarterThreeNetRevenue: Number;
  public quarterFourNetRevenue: Number;
  public quarterOneCost: Number;
  public quarterTwoCost: Number;
  public quarterThreeCost: Number;
  public quarterFourCost: Number;
  public quarterOneAverageCMPercentage: Number;
  public quarterTwoAverageCMPercentage: Number;
  public quarterThreeAverageCMPercentage: Number;
  public quarterFourAverageCMPercentage: Number;
  public halfYearOneNetRevenue: Number;
  public halfYearTwoNetRevenue: Number;
  public halfYearOneCost: Number;
  public halfYearTwoCost: Number;
  public halfYearOneAverageCMPercentage: Number;
  public halfYearTwoAverageCMPercentage: Number;
  public halfOneYearAverageCMPercentage: Number;


  // Data points for plotting graph
  actualsRevenue: any[] = [];
  forecastRevenue: any[] = [];
  actualsCM: any[] = [];
  forecastCM: any[] = [];

  showGraphAndReport: boolean;
  public lineChartType:string = 'bar';
  ctx: any;

  constructor(
    private fb: FormBuilder,
    private financeService:FinanceService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef,
   
  ) {  }

  ngOnInit() {
    this.toastr.setRootViewContainerRef(this.vcr);
    this.createDashboard();
    this.showGraphAndReport=false;
   
  }

  createDashboard(){  
    this.dashboardForm = this.fb.group({
      lineOfBusiness: ['', Validators.required],
      typeOfReport: ['', Validators.required],
      periodSelection: ['', Validators.required],
      representationType: ['', Validators.required],
    })
  }

  submitDashboardForm(){
    if(this.dashboardForm.valid) {
   
      let searchCriteria = {
        lob: this.dashboardForm.get('lineOfBusiness').value,
        typeOfReport: this.dashboardForm.get('typeOfReport').value,
        period: this.dashboardForm.get('periodSelection').value,
        representationType: this.dashboardForm.get('representationType').value,
            
     }
     //Creating graph for Actual Vs Forecast
     console.log(this.dashboardForm.get('typeOfReport').value)
     if(this.dashboardForm.get('typeOfReport').value == 'Actuals VS Forecast') {
      this.financeService.getActualsVsForecastReports(searchCriteria)
        .takeUntil(this.unsubscribe)
        .subscribe((response)=>{
          this.showGraphAndReport=true;   
          this.yearlyForecastResult = response;
          this.forecastEntity=this.yearlyForecastResult.forecastEntity;
          this.actualsEntity=this.yearlyForecastResult.actualsEntity;
          this.totalRevenueForecast = this.yearlyForecastResult.totalRevenueForecast;
          this.totalRevenueActuals = this.yearlyForecastResult.totalRevenueActuals;
          this.averageCMPerForecast = this.yearlyForecastResult.averageCMPerForecast;
          this.averageCMPerActuals = this.yearlyForecastResult.averageCMPerActuals;

          let actualsCMLineChart =  {
            label: "Actuals CM%",
            type: "line",
            yAxisID: 'y-axis-2',
            borderColor: "#8e5ea2",
            data: [],
            fill: false
          }
          let forecastCMLineChart = {
            label: "Forecast CM%",
            type: "line",
            yAxisID: 'y-axis-2',
            borderColor: "#3e95cd",
            data: [],
            fill: false
          }
          let actualsRevenueBarChart = {
            label: "Actuals Revenue",
            type: "bar",
            yAxisID: 'y-axis-1',
            backgroundColor: "rgba(0,0,0,0.2)",
            data: [],
            fill : false
          }
          let forecastRevenueBarChart = {
            label: "Forecast Revenue",
            type: "bar",
            yAxisID: 'y-axis-1',
            backgroundColor: "rgba(1,1,0,0.2)",
            data: [],
            fill : false
          }

          this.actualsEntity.forEach((actual, index) => {
            if(actual) {
              actualsCMLineChart.data[index] = actual.cmpercentage; 
              actualsRevenueBarChart.data[index] = actual.revenue ;
            }
            
          });

          this.forecastEntity.forEach((forecast, index) => {
            if(forecast) {
              forecastCMLineChart.data[index] = forecast.cmpercentage; 
              forecastRevenueBarChart.data[index] = forecast.revenue ;
            }
          
        });
          this.mixedDatasets.length = 0;
          this.mixedDatasets.push(forecastRevenueBarChart);
          this.mixedDatasets.push(actualsRevenueBarChart);
          this.mixedDatasets.push(forecastCMLineChart);
          this.mixedDatasets.push(actualsCMLineChart);
          
          this.lobWiseForecastReport = this.yearlyForecastResult.lobWiseForecastReport;
          this.lobWiseActualsReport=this.yearlyForecastResult.lobWiseActualsReport;
          this.lobwiseTotalReport = this.yearlyForecastResult.lobwiseTotalReport;

        },(error)=>{
          this.errorMessage = Utility.errorMessageHandling(error)
          // this.toastr.error(`${this.errorMessage}`,'Oops!', {toastLife: 10000, showCloseButton: true})
        });
      }
      //Creating graph for Periodic Actuals
      if(this.dashboardForm.get('typeOfReport').value == 'Periodic Actuals') {
     
        this.financeService.getPeriodicActualsReports(searchCriteria)
          .takeUntil(this.unsubscribe)
          .subscribe((response)=>{
            this.showGraphAndReport = true; 
            this.yearlyForecastResult = response;
            this.actualsEntities = this.yearlyForecastResult.actualsEntities;
            this.period = this.yearlyForecastResult.period;
            this.totalNetRevenue = this.yearlyForecastResult.totalNetRevenue;
            this.totalCost = this.yearlyForecastResult.totalCost;
            this.averageCMPercentage = this.yearlyForecastResult.averageCMPercentage
            this.quarterOneNetRevenue = this.yearlyForecastResult.quarterOneNetRevenue;
            this.quarterTwoNetRevenue = this.yearlyForecastResult.quarterTwoNetRevenue;
            this.quarterThreeNetRevenue = this.yearlyForecastResult.quarterThreeNetRevenue;
            this.quarterFourNetRevenue = this.yearlyForecastResult.quarterFourNetRevenue;
            this.quarterOneCost = this.yearlyForecastResult.quarterOneCost;
            this.quarterTwoCost = this.yearlyForecastResult.quarterTwoCost;
            this.quarterThreeCost = this.yearlyForecastResult.quarterThreeCost;
            this.quarterFourCost = this.yearlyForecastResult.quarterFourCost;
            this.quarterOneAverageCMPercentage = this.yearlyForecastResult.quarterOneAverageCMPercentage;
            this.quarterTwoAverageCMPercentage = this.yearlyForecastResult.quarterTwoAverageCMPercentage;
            this.quarterThreeAverageCMPercentage = this.yearlyForecastResult.quarterThreeAverageCMPercentage;
            this.quarterFourAverageCMPercentage = this.yearlyForecastResult.quarterFourAverageCMPercentage;
            this.halfYearOneNetRevenue = this.yearlyForecastResult.halfYearOneNetRevenue;
            this.halfYearTwoNetRevenue = this.yearlyForecastResult.halfYearTwoNetRevenue;
            this.halfYearOneCost = this.yearlyForecastResult.halfYearOneCost;
            this.halfYearTwoCost = this.yearlyForecastResult.halfYearTwoCost;
            this.halfYearOneAverageCMPercentage = this.yearlyForecastResult.halfYearOneAverageCMPercentage;
            this.halfYearTwoAverageCMPercentage = this.yearlyForecastResult.halfYearTwoAverageCMPercentage;
            this.halfOneYearAverageCMPercentage = this.yearlyForecastResult.halfOneYearAverageCMPercentage;
         
             this.actualsMonthlyCMLineChart = {
              label: "Actuals CM%",
              type: "line",
              yAxisID: 'y-axis-2',
              borderColor: "#8e5ea2",
              data: [],
              fill: false    
            } 
             this.actualsMonthlyRevenueBarChart = {
              label: "Actuals Revenue",
              type: "bar",
              yAxisID: 'y-axis-1',
              borderColor: "#3e95cd",
              data: [],
              fill: false
            }
           if(searchCriteria.period = 'Monthly') {
            
            this.actualsEntities.forEach((actual, index) => {
              if(actual) {
                this.actualsMonthlyCMLineChart.data[index] = actual.cmpercentage; 
                this.actualsMonthlyRevenueBarChart.data[index] = actual.revenue ;
              }
            });
           
          }

          else if(searchCriteria.period = 'Quarterly') {      
               
            this.actualsMonthlyCMLineChart.data[0] = this.quarterOneAverageCMPercentage; 
            this.actualsMonthlyCMLineChart.data[1] = this.quarterTwoAverageCMPercentage; 
            this.actualsMonthlyCMLineChart.data[2] = this.quarterThreeAverageCMPercentage; 
            this.actualsMonthlyCMLineChart.data[3] = this.quarterFourAverageCMPercentage; 
            this.actualsMonthlyRevenueBarChart.data[0] = this.quarterOneNetRevenue; 
            this.actualsMonthlyRevenueBarChart.data[1] = this.quarterTwoNetRevenue; 
            this.actualsMonthlyRevenueBarChart.data[2] = this.quarterThreeNetRevenue; 
            this.actualsMonthlyRevenueBarChart.data[3] = this.quarterFourNetRevenue; 
            
            
          }
            
          else if(searchCriteria.period = 'halfYearly') {
            this.actualsMonthlyRevenueBarChart.data[0] = this.halfYearOneNetRevenue; 
            this.actualsMonthlyRevenueBarChart.data[1] = this.halfYearTwoNetRevenue; 
            this.actualsMonthlyCMLineChart.data[0] = this.halfYearTwoAverageCMPercentage; 
            this.actualsMonthlyCMLineChart.data[1] = this.halfYearTwoAverageCMPercentage; 
         
          }

          this.mixedDatasetForPeriodicActuals.length = 0;
          this.mixedDatasetForPeriodicActuals.push(this.actualsMonthlyCMLineChart);
          this.mixedDatasetForPeriodicActuals.push(this.actualsMonthlyRevenueBarChart);

          },(error)=>{
            this.errorMessage = Utility.errorMessageHandling(error)
            // this.toastr.error(`${this.errorMessage}`,'Oops!', {toastLife: 10000, showCloseButton: true})
          });
        }
     } else {
       Utility.validateFieldsOnSubmit(this.dashboardForm);
     }
 
  }


public barChartType:string = 'bar';
public mixedChartLabelsForMonthlyActuals : Array<any> = ['Jan 18', 'Feb 18', 'Mar 18', 'Apr 18', 'May 18', 'June 18', 'July 18', 'Aug 18', 'Sept 18', 'Oct 18', 'Nov 18', 'Dec 18'];
public mixedChartLabelsForQuarterlyActuals : Array<any> = ['Q1','Q2','Q3','Q4'];
public mixedChartLabelsForHalfYearlyActuals : Array<any> = ['H1','H2'];


//Options
  public options: any = {
    responsive : true,
    scales: {
      yAxes: [
        {
          id: "y-axis-1",
          type: "linear",
          position: 'left',
          display: true,
          ticks: {
            beginAtZero:true
          },
          scaleLabel: {
            display: true,
            labelString: 'Revenue'    
          }
        },
        {
          id: "y-axis-2",
          type: "linear",
          position: 'right',
          ticks: {
            beginAtZero:true
          },
          scaleLabel: {
            display: true,
            labelString: 'CM%'
          }
        }
      ]
    },
  };


  hideGraph(){
    this.showGraphAndReport = false;  
  }

  resetGraphData() :void {
    this.forecastEntity = [];
    this.actualsEntity = [];
    this.mixedDatasets = [];
    this.actualsEntities = [];
    this.actualsMonthlyCMLineChart = '';
    this.actualsMonthlyRevenueBarChart = '';
  }

  resetDashboardForm(): void{
    this.dashboardForm.reset({
      lineOfBusiness : [''],
      typeOfReport :[''],
      periodSelection :[''],
      representationType :['']
    })
    this.hideGraph();
 }

 getMonthFromDate(monthNumber): string {
    var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December' ];
    return monthNames[monthNumber - 1];
 }

 ngOnDestroy(): void {
  this.resetGraphData();
  this.unsubscribe.next();
  this.unsubscribe.complete();
 }
}