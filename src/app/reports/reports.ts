import { Component} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { serviceSchool } from '../serviceSchool/serviceSchool';
import { IAnalyticsFormData } from '../serviceSchool/analytics-form-data';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICourseAnalyticsData } from '../serviceSchool/course-analytics-data';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-reports',
  imports: [BaseChartDirective, FormsModule, ReactiveFormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})

export class Reports{

  public courseAnalyticsFormData: FormGroup;
  public formData: IAnalyticsFormData| any = <IAnalyticsFormData>{};
  public analyticsResults: ICourseAnalyticsData | any = <ICourseAnalyticsData>{}
  public isLoading: boolean;
  public showChart: boolean;
  public chartData: ChartData<'bar'>| any = <ChartData>{};

    constructor(private service: serviceSchool)
    {
      this.isLoading = false;
      this.showChart = false;

      this.courseAnalyticsFormData = new FormGroup({
      startDate: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{4}-[0-9]{2}-[0-9]{2}$")]),
      endDate: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{4}-[0-9]{2}-[0-9]{2}$")]),
    });
    }

    public onSubmit(courseAnalyticsFormData: { startDate: string; endDate: string; }) {
      if(this.courseAnalyticsFormData.valid)
      {
        this.isLoading = true;
        this.formData.startDate = courseAnalyticsFormData.startDate;
        this.formData.endDate = courseAnalyticsFormData.endDate;
        this.getAnalytics();
      }

      //logging
      //console.log('Form Submitted!', staffFormData.value);
      //console.log('Form Data:', this.chosenStaff);
  }

  public onSubmitAll()
  {
    this.formData.startDate = "2017-01-01";
    this.formData.endDate = "2026-01-01";
    this.getAnalytics();
  }

  public getAnalytics()
  {
    this.isLoading = true;
    this.service.getCourseAnalyticsByDate(this.formData).subscribe
    ({
      next: (data) => {this.processAnalyticsData(data)},
      error: (err) => {this.processError(err)}
    });
  }

  public get startDate()
  {
    return this.courseAnalyticsFormData.get('startDate');
  }

  public get endDate()
  {
    return this.courseAnalyticsFormData.get('endDate');
  }


  public processAnalyticsData(data: any)
  {
    this.isLoading = false;
    this.analyticsResults.minNum = data.minNum;
    this.analyticsResults.maxNum = data.maxNum;
    this.analyticsResults.rangeNum = data.range;
    this.analyticsResults.avgNum = data.average;
    this.analyticsResults.courseNumCategories = [...data.courseNumberCategories]
    this.analyticsResults.courseNumOccurrences = [...data.courseNumberOccurrences]
    console.log(this.analyticsResults);


      this.chartData = {
      labels: this.analyticsResults.courseNumCategories.map((element: number) => element),
      datasets: [
        {
          label: 'Number of classes by number of students',
          data: this.analyticsResults.courseNumOccurrences.map((element: number) => element),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ]

      }
    if(this.analyticsResults.courseNumCategories.length > 0)
    {
      this.showChart = true;
    }

  }

  public processError(err: any)
  {
    this.isLoading = false;
    console.log(err);
    if( err.message.includes("0 Unknown Error") &&  sessionStorage.getItem("User") === "viewerlogin")
    {
      alert("PERMISSION DENIED!!! INSUFFICIENT ACCESS RIGHTS TO GENERATE REPORT!");
      console.log("PERMISSION DENIED!!! INSUFFICIENT ACCESS RIGHTS TO GENERATE REPORT!");
    }
    else if( err.message.includes("0 Unknown Error"))
    {
      alert('Failure to connect to API! Azure web app may not be running please contact website admin.');
      console.log('Failure to connect to API! Azure web app may not be running please contact website admin.');
    }
    else
    {
      alert('Failed to load database info! Likely a timeout please try again.');
      console.log('Failed to load database info! Likely a timeout please try again.');
    }
    this.showChart = false;
     this.analyticsResults.minNum = -1;
    this.analyticsResults.maxNum = -1;
    this.analyticsResults.rangeNum = -1;
    this.analyticsResults.avgNum = -1;
  }

  public processClear()
  {
    this.showChart = false;
    this.analyticsResults.minNum = -1;
    this.analyticsResults.maxNum = -1;
    this.analyticsResults.rangeNum = -1;
    this.analyticsResults.avgNum = -1;
    this.courseAnalyticsFormData.reset();
  }

   chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
    };

}
