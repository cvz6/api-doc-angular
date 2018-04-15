import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-api-param',
  templateUrl: './api-param.component.html',
  styleUrls: ['./api-param.component.scss']
})
export class ApiParamComponent implements OnInit {

  @Input()
  params: any;

  @Input()
  require: boolean;

  constructor() {
  }

  ngOnInit() {
  }

}
