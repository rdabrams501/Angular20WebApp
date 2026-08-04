import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IStaffData } from './staff-data';
import { ICourseData } from './course-data';
import { ICourseAndStaffData } from './course-and-staff-data';
import { IStaffInsert } from './istaff-insert';


@Injectable({providedIn: 'root'})

export class serviceSchool {

  private baseUrl: string;
  private staffData$: Observable<IStaffData> = new Observable();
  private courseData$: Observable<ICourseData> = new Observable();
  private courseAndStaffData$: Observable<ICourseAndStaffData> = new Observable();
  private generalData: any

  constructor(private httpClient: HttpClient) {     // dependency injection of HttpClient object
    this.baseUrl = environment.serviceURL;
  }

  public getStaffWX(staff: string): Observable<IStaffData> {
    const fullUrl = this.baseUrl + staff;
    this.staffData$= this.httpClient.get<IStaffData>(fullUrl);
    return this.staffData$;
  }

  public getCoursesWX(course: string): Observable<ICourseData> {
    const fullUrl = this.baseUrl + course;
    this.courseData$ = this.httpClient.get<ICourseData>(fullUrl);
    return this.courseData$;
  }


  public getCoursesAndStaffWX(courseandstaff: string): Observable<ICourseAndStaffData> {
    const fullUrl = this.baseUrl + courseandstaff;
    this.courseAndStaffData$= this.httpClient.get<ICourseAndStaffData>(fullUrl);
    return this.courseAndStaffData$;
  }

  public postStaffWX(staffer: IStaffInsert ): Observable<string>{
    const fullUrl = this.baseUrl + "staff";
    const body = JSON.stringify(staffer);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    });
    return this.httpClient.post<any>(fullUrl, body,  {
          headers,
         'observe': 'body',
         'responseType': 'json'
      });
  }

  public updateStaffWX(staffer: IStaffData): Observable<string>{
    const fullUrl = this.baseUrl + "staff";
    const body = JSON.stringify(staffer);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    });
    return this.httpClient.put<any>(fullUrl, body,  {
          headers,
         'observe': 'body',
         'responseType': 'json'
      });
  }

  public deleteStaffWX(staffer: IStaffData): Observable<string>{
    const fullUrl = this.baseUrl + "Staff/delete";
    const body = JSON.stringify(staffer);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    });
    return this.httpClient.put<any>(fullUrl, body,  {
          headers,
         'observe': 'body',
         'responseType': 'json'
      });
  }

}
