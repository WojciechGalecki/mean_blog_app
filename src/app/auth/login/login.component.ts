import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) {
  }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(authStatus => {
          this.isLoading = false;
        }
      );
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const authData = {
      email: form.value.email,
      password: form.value.password
    };
    this.isLoading = true;
    this.authService.loginUser(authData);
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}