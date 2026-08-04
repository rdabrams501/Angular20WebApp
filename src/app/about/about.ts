import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {

  public currentNum: number;

  constructor() {
    this.currentNum = 0;
  }

  ngOnInit() {
    const localParms: any = localStorage.getItem('srvdata.num');   // get persisted value
    if (localParms != null) {
        this.currentNum = Number.parseInt(localParms, 10);
    } else {
        localStorage.setItem('srvdata.num', this.currentNum.toString())
    }
  }

  public incrementCounter() {
    this.currentNum++;
    localStorage.setItem('srvdata.num', this.currentNum.toString());   // persist value
  }

  public decrementCounter() {
    this.currentNum--;
    localStorage.setItem('srvdata.num', this.currentNum.toString());   // persist value
  }

  public resetCounter() {
    this.currentNum = 0;
    localStorage.setItem('srvdata.num', this.currentNum.toString());   // persist value
  }

}
