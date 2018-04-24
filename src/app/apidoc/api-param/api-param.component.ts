import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-api-param',
  templateUrl: './api-param.component.html',
  styleUrls: ['./api-param.component.scss']
})
export class ApiParamComponent {

  @Input()
  params: any;

  @Input()
  require: boolean;

  @Input()
  index=0;

  constructor() {
  }

}
