import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpService} from "./http-service.service";
import {InterfaceModule} from './apidoc/apidoc.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    InterfaceModule
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
