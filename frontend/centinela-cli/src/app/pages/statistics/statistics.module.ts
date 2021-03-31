import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsRoutingModule} from './statistics-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import { ThemeModule } from '../../@theme/theme.module';
import { CountBugsComponent } from './count-bugs/count-bugs.component';

import { 
  NbActionsModule,
  NbCardModule, 
  NbIconModule,   
  NbSelectModule, 
  NbInputModule,    
  NbTreeGridModule,
  NbDateService,
  NbButtonModule,
  NbDatepickerModule,
  NbLayoutModule,
  NbAlertModule } from '@nebular/theme';


@NgModule({
  declarations: [CountBugsComponent],
  imports: [    
    NbCardModule,
    NbActionsModule,
    NbButtonModule,
    NbLayoutModule,
    NbCardModule,
    NbTreeGridModule,
    NbAlertModule,
    NbIconModule,
    NbSelectModule,
    NbInputModule,
    ThemeModule,
    CommonModule,    
    FormsModule, 
    ReactiveFormsModule,
    CommonModule,
    ThemeModule,    
    NgxEchartsModule,
    NgxChartsModule,
    ChartModule,
    NbCardModule,
    NbDatepickerModule,
    StatisticsRoutingModule
  ],

})
export class StatisticsModule { }
