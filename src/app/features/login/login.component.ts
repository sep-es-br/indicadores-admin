import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/service/authentication.service';
import { NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit  {

  constructor(private authenticationService: AuthenticationService ,private toastrService: NbToastrService, private router: Router) { 
  }

  ngOnInit(): void {
    const state = window.history.state as { authError: string };
    if (state?.authError) {
      this.toastrService.show(state.authError, 'Atenção', { status: 'warning', duration: 8000 });
    }
    window.history.replaceState({}, '', this.router.url);
  }

  login(){
  this.authenticationService.acessoCidadaoSignIn();
  }

}
