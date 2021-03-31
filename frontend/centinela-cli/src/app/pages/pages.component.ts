import { Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})

export class PagesComponent {
  constructor(private loginService: LoginService) {}

  canShow: boolean = this.loginService.userIsAdmin();

  menu: NbMenuItem[] = [{
    title: 'Errores reportados',    
    icon: 'grid-outline',
    link: '/bugs',
    home: true,
  },
  {
    title: 'Sistemas de clientes',
    icon: 'people-outline',
    hidden: !this.canShow,
    children: [
      {
        title: 'Listado de sistemas',
        link: '/systems',
      },
      {
        title: 'Registrar nuevo sistema',
        link: '/systems/add',
      }
    ],            
  },
  {
    title: 'Invitaciones',    
    icon: 'message-circle-outline',
    link: '/invitations',
    hidden: !this.canShow,
  },
  {
    title: 'Estadísticas',    
    icon: 'pie-chart-outline',
    link: '/statistics',
    hidden: !this.canShow,
  }];
}
