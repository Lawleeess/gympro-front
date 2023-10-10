import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterTestingModule } from '@angular/router/testing';
import { ConfigurationProvider } from 'src/app/app.constants';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';

import { LoginComponent } from './login.component';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { UserService } from 'src/app/services/user.service';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule, Location } from '@angular/common';
import { SignupComponent } from '../signup/signup.component';
import { Router } from '@angular/router';

const ANGULAR_MATERIAL_MODULES = [
  MatSnackBarModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
];

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent, SignupComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'signup', component: SignupComponent },
        ]),
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        CommonModule,
        ...ANGULAR_MATERIAL_MODULES,
        NoopAnimationsModule,
      ],
      providers: [UserService, SnackBarService, ConfigurationProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should require email and password', () => {
    const email = '';
    const password = '';
    component.emailControl.setValue(email);
    component.passwordControl.setValue(password);

    expect(component.form.valid).toEqual(false);
  });

  it('should require a valid email', () => {
    const email = 'invalid-email123';
    const password = '123456';
    component.emailControl.setValue(email);
    component.passwordControl.setValue(password);

    expect(component.form.valid).toEqual(false);
  });

  it('should require a valid password', () => {
    const email = 'johndoe@epa.digital';
    const password = '12';
    component.emailControl.setValue(email);
    component.passwordControl.setValue(password);

    expect(component.form.valid).toEqual(false);
  });

  it('should handle a valid form', () => {
    const email = 'johndoe@epa.digital';
    const password = '123abc';
    component.emailControl.setValue(email);
    component.passwordControl.setValue(password);

    expect(component.form.valid).toEqual(true);
  });

  it('should loggin the user after fill the form', () => {
    const email = 'johndoe@epa.digital';
    const password = '123abc';
    component.emailControl.setValue(email);
    component.passwordControl.setValue(password);

    expect(component.form.valid).toEqual(true);
  });

  it('should make the password visible', () => {
    const showPasswordIcon = fixture.debugElement.query(
      By.css('#show-password')
    );
    showPasswordIcon.nativeElement.click();
    fixture.detectChanges();

    const passwordInput = fixture.debugElement.query(By.css('#password'));

    expect(passwordInput.nativeElement.getAttribute('type')).toEqual('text');
  });

  it('should make the password invisible', () => {
    component.showPassword = true;
    fixture.detectChanges();

    const hidePasswordIcon = fixture.debugElement.query(
      By.css('#hide-password')
    );
    hidePasswordIcon.nativeElement.click();
    fixture.detectChanges();

    const passwordInput = fixture.debugElement.query(By.css('#password'));

    expect(passwordInput.nativeElement.getAttribute('type')).toEqual(
      'password'
    );
  });

  it('should go to /signup page', waitForAsync(
    inject([Router, Location], (router: Router, location: Location) => {
      let fixture = TestBed.createComponent(LoginComponent);
      fixture.detectChanges();

      fixture.debugElement.query(By.css('#signup-link')).nativeElement.click();
      fixture.whenStable().then(() => {
        expect(location.path()).toEqual('/signup');
      });
    })
  ));
});
