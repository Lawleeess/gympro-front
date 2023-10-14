import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CUSTOMER_COUNTRY_CODES,
  CUSTOMER_CURRENCY_CODES,
  CUSTOMER_STATUS,
  CUSTOMER_TIME_ZONES,
} from 'src/app/constants/custumers';

import { FormNewCustomerDataComponent } from './form-new-customer-data.component';

const ANGULAR_MATERIAL_MODULES = [
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
];

describe('FormNewClientDataComponent', () => {
  let component: FormNewCustomerDataComponent;
  let fixture: ComponentFixture<FormNewCustomerDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormNewCustomerDataComponent],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        ...ANGULAR_MATERIAL_MODULES,
      ],
    }).compileComponents();
  });

  // format of form when it's completed by the user
  const mockFormData = {
    name: 'Soriana',
    url: 'soriana.com',
    countryCode: CUSTOMER_COUNTRY_CODES.find((i) => i.id === 'MX'),
    timezone: CUSTOMER_TIME_ZONES.find((i) => i.id === 'America/Mexico_City'),
    currency: CUSTOMER_CURRENCY_CODES.find((i) => i.id == 'MXN'),
    status: CUSTOMER_STATUS.find((i) => i.id === 'active'),
    legalName: 'Soriana S.A de C.V',
    taxID: 'CFG311AMU',
    fiscalAddress:
      'Av. Ejercito Nacional 285, Miguel Hildago, Ciudad de México',
    paymentConditions: 'Monthly payments',
    contactName: 'Fernando Ramírez Sánchez',
    contactPhone: '5555555555',
    contactEmail: 'f.ramirez@soriana.mkt',
    targetAuditScore: 80,
  };

  // format of the received data from the API
  const mockRawData = {
    name: 'Soriana',
    url: 'soriana.com',
    countryCode: CUSTOMER_COUNTRY_CODES.find((i) => i.id === 'MX').id,
    timezone: CUSTOMER_TIME_ZONES.find((i) => i.id === 'America/Mexico_City')
      .id,
    currency: CUSTOMER_CURRENCY_CODES.find((i) => i.id == 'MXN').id,
    status: CUSTOMER_STATUS.find((i) => i.id === 'active').name,
    billing: {
      legalName: 'Soriana S.A de C.V',
      taxID: 'CFG311AMU',
      fiscalAddress:
        'Av. Ejercito Nacional 285, Miguel Hildago, Ciudad de México',
      paymentConditions: 'Monthly payments',
    },
    contactInfo: {
      name: 'Fernando Ramírez Sánchez',
      phoneNumber: '5555555555',
      email: 'f.ramirez@soriana.mkt',
    },
    targetAuditScore: 80,
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(FormNewCustomerDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive savedCustomer as input and fill the form', () => {
    component.savedCustomer = mockRawData;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(component.form.valid).toEqual(true);
  });

  it('should receive disabled as input and disable all form', () => {
    component.disabled = true;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(component.form.disabled).toEqual(true);
  });

  it('should require all fields', () => {
    expect(component.form.valid).toEqual(false);

    Object.keys(component.form.controls).forEach((key) => {
      // discarding 'status' form control because it has a value by default
      if (key !== 'status') {
        expect(component.form.controls[key].hasError('required')).toEqual(true);
      }
    });
  });

  it('should require a valid client url', () => {
    const invalidUrl = 'invalid_url@';

    component.form.setValue({ ...mockFormData, url: invalidUrl });

    fixture.detectChanges();
    expect(component.form.valid).toEqual(false);
    expect(component.form.controls.url.hasError('pattern')).toEqual(true);
  });

  it('should require a valid contact email', () => {
    const invalidContactEmail = 'f.ramirez';
    component.form.setValue({
      ...mockFormData,
      contactEmail: invalidContactEmail,
    });

    fixture.detectChanges();
    expect(component.form.valid).toEqual(false);
    expect(component.form.controls.contactEmail.hasError('email')).toEqual(
      true
    );
  });

  it('should require an audit score greater than 0', () => {
    const invalidAuditScore = 0;
    component.form.setValue({
      ...mockFormData,
      targetAuditScore: invalidAuditScore,
    });

    fixture.detectChanges();
    expect(component.form.valid).toEqual(false);
    expect(component.form.controls.targetAuditScore.hasError('min')).toEqual(true);
  });

  it('should require an audit score of less than 100', () => {
    const invalidAuditScore = 500;
    component.form.setValue({
      ...mockFormData,
      targetAuditScore: invalidAuditScore,
    });

    fixture.detectChanges();
    expect(component.form.valid).toEqual(false);
    expect(component.form.controls.targetAuditScore.hasError('max')).toEqual(true);
  });

  it('should handle a valid form', () => {
    component.form.setValue({ ...mockFormData });
    expect(component.form.valid).toEqual(true);
  });

  it('should disable form validators when savedCustomer is received as input', () => {
    spyOn(component, 'disableRequiredValidators');
    component.savedCustomer = mockRawData;

    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.form.valid).toEqual(true);
    expect(component.disableRequiredValidators).toHaveBeenCalled();
  });

  it('should emit form changes to parent componet', fakeAsync(() => {
    spyOn(component.formChange, 'emit');

    component.form.controls.name.setValue('Soriana MKT');
    // it's necessary to use a fakeAsync function with a tick of 5 millisencons
    // because the form subscrition (in component.ts file) has a debouncetime with 5 milliseconds
    tick(5);

    expect(component.formChange.emit).toHaveBeenCalledWith(component.form);
  }));

  it('should emit form changes to parent componet when savedCustomer is received as input', fakeAsync(() => {
    spyOn(component.formChange, 'emit');

    component.savedCustomer = mockRawData;
    component.ngOnChanges();
    fixture.detectChanges();

    component.form.controls.name.setValue('Soriana MKT');
    // it's necessary to use a fakeAsync function with a tick of 5 millisencons
    // because the form subscrition (in component.ts file) has a debouncetime with 5 milliseconds
    tick(5);

    expect(component.formChange.emit).toHaveBeenCalledWith(component.form);
  }));
});
