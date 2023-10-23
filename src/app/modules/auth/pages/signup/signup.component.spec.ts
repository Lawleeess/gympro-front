import { CommonModule, Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { UserService } from 'src/app/services/user.service';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { SignupComponent } from './signup.component';
import { LoginComponent } from '../login/login.component';

import { ConfigurationProvider } from 'src/app/app.constants';
import { USER_ROLE } from 'src/app/constants/users';

const ANGULAR_MATERIAL_MODULES = [
  MatSnackBarModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
];

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginComponent },
        ]),
        ...ANGULAR_MATERIAL_MODULES,
      ],
      providers: [UserService, SnackBarService, ConfigurationProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should require all fields', () => {
    expect(component.form.valid).toEqual(false);
  });

  it('should require a valid email', () => {
    const name = 'John';
    const lastname = 'Doe';
    const department = USER_ROLE.user.value;
    const email = 'invalid-email123';
    const password = '123456';

    component.form.controls.name.setValue(name);
    component.form.controls.lastname.setValue(lastname);
    component.form.controls.department.setValue(department);
    component.form.controls.email.setValue(email);
    component.form.controls.password.setValue(password);
    component.form.controls.validatePassword.setValue(password);

    expect(component.form.valid).toEqual(false);
  });

  it('should require a valid password', () => {
    const name = 'John';
    const lastname = 'Doe';
    const department = USER_ROLE.user.value;
    const email = 'johndoe@epa.digital';
    const password = '';

    component.form.controls.name.setValue(name);
    component.form.controls.lastname.setValue(lastname);
    component.form.controls.department.setValue(department);
    component.form.controls.email.setValue(email);
    component.form.controls.password.setValue(password);
    component.form.controls.validatePassword.setValue(password);

    expect(component.form.valid).toEqual(false);
  });

  it(`should show error message with invalid password`, () => {
    const name = 'John';
    const lastname = 'Doe';
    const department = USER_ROLE.user.value;
    const email = 'johndoe@epa.digital';
    const password = '1';
    const validatePassword = '123456';

    component.form.controls.name.setValue(name);
    component.form.controls.lastname.setValue(lastname);
    component.form.controls.department.setValue(department);
    component.form.controls.email.setValue(email);
    component.form.controls.password.setValue(password);
    component.form.controls.validatePassword.setValue(validatePassword);

    component.form.markAllAsTouched();
    fixture.detectChanges();

    const errorLegendIsShown = fixture.debugElement.query(
      By.css('#invalid-password-legend-signup')
    )
      ? true
      : false;

    expect(errorLegendIsShown).toEqual(true);
  });

  it(`should show error message with invalid validate password`, () => {
    const name = 'John';
    const lastname = 'Doe';
    const department = USER_ROLE.user.value;
    const email = 'johndoe@epa.digital';
    const password = '123456';
    const validatePassword = '1';

    component.form.controls.name.setValue(name);
    component.form.controls.lastname.setValue(lastname);
    component.form.controls.department.setValue(department);
    component.form.controls.email.setValue(email);
    component.form.controls.password.setValue(password);
    component.form.controls.validatePassword.setValue(validatePassword);

    component.form.markAllAsTouched();
    fixture.detectChanges();

    const errorLegendIsShown = fixture.debugElement.query(
      By.css('#invalid-validate-password-legend-signup')
    )
      ? true
      : false;

    expect(errorLegendIsShown).toEqual(true);
  });

  it('should handle a valid form', () => {
    const name = 'John';
    const lastname = 'Doe';
    const department = USER_ROLE.user.value;
    const email = 'johndoe@epa.digital';
    const password = '123456abc.';
    const validatePassword = '123456abc.';

    component.form.controls.name.setValue(name);
    component.form.controls.lastname.setValue(lastname);
    component.form.controls.department.setValue(department);
    component.form.controls.email.setValue(email);
    component.form.controls.password.setValue(password);
    component.form.controls.validatePassword.setValue(validatePassword);

    expect(component.form.valid).toEqual(true);
  });

  it('should match password and validate password', () => {
    const name = 'John';
    const lastname = 'Doe';
    const department = USER_ROLE.user.value;
    const email = 'johndoe@epa.digital';
    const password = '123456';
    const validatePassword = 'abcde';

    component.form.controls.name.setValue(name);
    component.form.controls.lastname.setValue(lastname);
    component.form.controls.department.setValue(department);
    component.form.controls.email.setValue(email);
    component.form.controls.password.setValue(password);
    component.form.controls.validatePassword.setValue(validatePassword);

    const submitButton = fixture.debugElement.query(
      By.css('#register-button-signup')
    );
    const submitButtonIsDisabled =
      submitButton.nativeElement.getAttribute('disabled') === 'true';

    fixture.detectChanges();

    expect(submitButtonIsDisabled).toEqual(true);
  });

  it(`should show error message when passwords don't match`, () => {
    const name = 'John';
    const lastname = 'Doe';
    const department = USER_ROLE.user.value;
    const email = 'johndoe@epa.digital';
    const password = '123456';
    const validatePassword = 'aaa';

    component.form.controls.name.setValue(name);
    component.form.controls.lastname.setValue(lastname);
    component.form.controls.department.setValue(department);
    component.form.controls.email.setValue(email);
    component.form.controls.password.setValue(password);
    component.form.controls.validatePassword.setValue(validatePassword);

    component.form.markAllAsTouched();
    fixture.detectChanges();

    const errorLegendIsShown = fixture.debugElement.query(
      By.css('#password-not-mach-legend-signup')
    )
      ? true
      : false;

    expect(errorLegendIsShown).toEqual(true);
  });

  it('should make the password visible', () => {
    const showPasswordIcon = fixture.debugElement.query(
      By.css('#show-password-signup')
    );
    showPasswordIcon.nativeElement.click();
    fixture.detectChanges();

    const passwordInput = fixture.debugElement.query(
      By.css('#password-signup')
    );

    expect(passwordInput.nativeElement.getAttribute('type')).toEqual('text');
  });

  it('should make the password invisible', () => {
    component.showPassword = true;
    fixture.detectChanges();

    const hidePasswordIcon = fixture.debugElement.query(
      By.css('#hide-password-signup')
    );
    hidePasswordIcon.nativeElement.click();
    fixture.detectChanges();

    const passwordInput = fixture.debugElement.query(
      By.css('#password-signup')
    );

    expect(passwordInput.nativeElement.getAttribute('type')).toEqual(
      'password'
    );
  });

  it('should go to /login page', waitForAsync(
    inject([Router, Location], (router: Router, location: Location) => {
      fixture.detectChanges();

      fixture.debugElement
        .query(By.css('#login-link-signup'))
        .nativeElement.click();

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(location.path()).toEqual('/login');
      });
    })
  ));
});
