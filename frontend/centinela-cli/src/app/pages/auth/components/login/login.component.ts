/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS } from '../../auth.options';
import { getDeepFromObject } from '../../helpers';

import { NbAuthService } from '../../services/auth.service';

import { Login } from '../../../../models/login';
import { LoginService } from '../../../../services/login.service';

@Component({
  selector: 'nb-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NbLoginComponent {

  redirectDelay: number = 0;
  showMessages: any = {};
  strategy: string = '';

  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted: boolean = false;
  messageError: string;

  constructor(protected service: NbAuthService,
              @Inject(NB_AUTH_OPTIONS) protected options = {},
              protected cd: ChangeDetectorRef,
              protected router: Router,
              private loginService: LoginService) {

    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.strategy = this.getConfigValue('forms.login.strategy');
  }

  login(): void {
    this.errors = [];
    this.messages = [];

    const formLogin = this.user as Login;
    const login = new Login(formLogin.email, formLogin.password);
    this.loginService.login(login).subscribe(
      () => {
        this.submitted = false;
        setTimeout(() => {
          return this.router.navigate(['/']);
        }, this.redirectDelay);
      },
      (error: any) => {
        this.messageError = error.error;
        this.cd.detectChanges();
      }
    );
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
