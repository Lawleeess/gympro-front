import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { SharedModule } from 'src/app/modules/shared/shared.module';

import { ConfigurationProvider } from 'src/app/app.constants';
import { Providers, ProvidersShort } from 'src/app/enums/general';
import { AdwordsAccount, TikTokAccount } from 'src/app/m./form-new-customer-accounts.component';
import {
  CUSTOMER_CREDENTIAL_EMAIL,
  CUSTOMER_CURRENCY_CODES,
  CUSTOMER_TIME_ZONES,
} from 'src/app/constants/custumer./form-new-customer-accounts.component';

const ANGULAR_MATERIAL_MODULES = [
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
];

describe('FormNewCustomerAccountsComponent', () => {
  let component: FormNewCustomerAccountsComponent;
  let fixture: ComponentFixture<FormNewCustomerAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormNewCustomerAccountsComponent],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        ...ANGULAR_MATERIAL_MODULES,
      ],
      providers: [ConfigurationProvider],
    }).compileComponents();
  });

  const accountsMockData: Account[] = [
    {
      accountID: '9390803748',
      businessUnit: 'Soriana',
      credentialEmail: 'analytics@epa.digital',
      currency: 'MXN',
      externalLoginCustomerID: '2465423267',
      manager: {
        name: 'Selene Rangel Huerta',
        userID: 'bXVNHRKJpsVf73DtVJgOsTp3XR32',
      },
      name: 'Soriana Branding',
      objective: 'BRANDING',
      postgresID: 240,
      provider: 'adwords',
      timezone: 'America/Mexico_City',
      vertical: 'Retail',
    },
    {
      accountID: '67998504',
      clientName: 'Soriana',
      credentialEmail: 'analytics@epa.digital',
      currency: 'MXN',
      name: 'Soriana',
      postgresID: 40,
      propertyID: 'UA-67998504-10',
      provider: 'analytics',
      timezone: 'America/Mexico_City',
      viewID: '184948847',
    },
    {
      accountID: '5286026647',
      businessUnit: 'Soriana',
      credentialEmail: 'analytics@epa.digital',
      currency: 'MXN',
      externalLoginCustomerID: '2465423267',
      manager: null,
      name: 'Soriana Performance',
      objective: 'ECOMMERCE',
      postgresID: 241,
      provider: 'adwords',
      timezone: 'America/Mexico_City',
      vertical: 'Retail',
    },
    {
      accountID: '922895411414498',
      businessUnit: 'Soriana',
      credentialEmail: 'analytics@epa.digital',
      currency: '',
      manager: null,
      name: 'Soriana',
      objective: 'ECOMMERCE',
      postgresID: 3,
      provider: 'facebook',
      timezone: 'America/Mexico_City',
      vertical: 'Retail',
    },
    {
      accountID: '1060564717675513',
      businessUnit: 'Soriana',
      credentialEmail: 'analytics@epa.digital',
      currency: '',
      manager: {
        name: 'Selene Rangel Huerta',
        userID: 'bXVNHRKJpsVf73DtVJgOsTp3XR32',
      },
      name: 'Soriana Branding',
      objective: 'BRANDING',
      postgresID: 4,
      provider: 'facebook',
      timezone: 'America/Mexico_City',
      vertical: 'Retail',
    },
    {
      accountID: '3266062890124226',
      clientName: 'Soriana',
      credentialEmail: 'analytics@epa.digital',
      currency: '',
      name: 'Soriana TOBE',
      postgresID: 5,
      provider: 'facebook',
      timezone: 'America/Mexico_City',
    },
    {
      accountID: '2831347560222615',
      clientName: 'Soriana',
      credentialEmail: 'analytics@epa.digital',
      currency: '',
      name: 'Diageo-Soriana',
      postgresID: 6,
      provider: 'facebook',
      timezone: 'America/Mexico_City',
    },
    {
      accountID: '9390803711',
      businessUnit: 'Soriana',
      credentialEmail: 'analytics@epa.digital',
      currency: 'MXN',
      externalLoginCustomerID: '2465423267',
      manager: {
        name: 'Selene Rangel Huerta',
        userID: 'bXVNHRKJpsVf73DtVJgOsTp3XR32',
      },
      name: 'Soriana Branding',
      objective: 'BRANDING',
      postgresID: 241,
      provider: 'bing',
      timezone: 'America/Mexico_City',
      vertical: 'Retail',
    },
    {
      accountID: '9390803711',
      businessUnit: 'Soriana',
      credentialEmail: 'analytics@epa.digital',
      currency: 'MXN',
      externalLoginCustomerID: '2465423267',
      manager: {
        name: 'Selene Rangel Huerta',
        userID: 'bXVNHRKJpsVf73DtVJgOsTp3XR32',
      },
      name: 'Soriana Tiktok Branding',
      objective: 'BRANDING',
      postgresID: 243,
      provider: 'tiktok',
      timezone: 'America/Mexico_City',
      vertical: 'Retail',
    },
  ];

  const adwordsMockData: AdwordsAccount[] = accountsMockData.filter(
    (i) => i.provider === Providers.adwords
  );
  const analyticsMockData: AdwordsAccount[] = accountsMockData.filter(
    (i) => i.provider === Providers.analytics
  );
  const facebookMockData: AdwordsAccount[] = accountsMockData.filter(
    (i) => i.provider === Providers.facebook
  );
  const bingMockData: AdwordsAccount[] = accountsMockData.filter(
    (i) => i.provider === Providers.bing
  );
  const tiktokMockData: TikTokAccount[] = accountsMockData.filter(
    (i) => i.provider === Providers.tiktok
  );

  const mockAccountFormData = {
    credentialEmail: CUSTOMER_CREDENTIAL_EMAIL[0],
    accountID: '5654116356',
    name: 'Soriana Account',
    timezone: CUSTOMER_TIME_ZONES[0],
    currency: CUSTOMER_CURRENCY_CODES[0],
    manager: {
      name: 'Selene Rangel Huerta',
      id: 'bXVNHRKJpsVf73DtVJgOsTp3XR32',
    },
    vertical: 'Retail',
    businessUnit: 'Soriana',
    objective: 'BRANDING',
  };

  const accountsTablesVisibility: DomElementsListVisibility = {
    [ProvidersShort.ad]: {
      selector: '#ad-accounts-table',
      visible: false,
    },
    [ProvidersShort.ga]: {
      selector: '#ga-accounts-table',
      visible: false,
    },
    [ProvidersShort.fb]: {
      selector: '#fb-accounts-table',
      visible: false,
    },
    [ProvidersShort.bg]: {
      selector: '#bg-accounts-table',
      visible: false,
    },
    [ProvidersShort.tt]: {
      selector: '#tt-accounts-table',
      visible: false,
    },
  };

  const accountsFormsVisibility: DomElementsListVisibility = {
    [ProvidersShort.ad]: {
      selector: '#ad-accounts-form-container',
      visible: false,
    },
    [ProvidersShort.ga]: {
      selector: '#ga-accounts-form-container',
      visible: false,
    },
    [ProvidersShort.fb]: {
      selector: '#fb-accounts-form-container',
      visible: false,
    },
    [ProvidersShort.bg]: {
      selector: '#bg-accounts-form-container',
      visible: false,
    },
    [ProvidersShort.tt]: {
      selector: '#tt-accounts-form-container',
      visible: false,
    },
  };

  const getAccountsTablesVisibility = (): DomElementsListVisibility => {
    const accountTablesList = { ...accountsTablesVisibility };
    Object.values(accountTablesList).forEach((element) => {
      element.visible = fixture.debugElement.query(By.css(element.selector))
        ? true
        : false;
    });

    return accountTablesList;
  };

  const getAccountsFormsVisibility = (): DomElementsListVisibility => {
    const accountsFormList = { ...accountsFormsVisibility };
    Object.values(accountsFormList).forEach((element) => {
      const el = fixture.debugElement.query(By.css(element.selector));
      element.visible = !el.properties.hidden;
    });

    return accountsFormList;
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(FormNewCustomerAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive savedAccounts as input with at least one account for each provider', () => {
    // assign savedAccounts input value
    component.savedAccounts = accountsMockData;
    fixture.detectChanges();

    // savedAccounts are grouped by provider
    expect(component.accounts.ad.data.length).toEqual(adwordsMockData.length);
    expect(component.accounts.ga.data.length).toEqual(analyticsMockData.length);
    expect(component.accounts.fb.data.length).toEqual(facebookMockData.length);
    expect(component.accounts.bg.data.length).toEqual(bingMockData.length);
    expect(component.accounts.tt.data.length).toEqual(tiktokMockData.length);

    // DOM initial state -> All accounts tables must be visible
    const tablesVisibiliy = getAccountsTablesVisibility();
    Object.values(tablesVisibiliy).forEach((element) => {
      expect(element.visible).toEqual(true);
    });
  });

  it('should receive savedAccounts as input with null value', () => {
    // assign savedAccounts input value
    component.savedAccounts = null;
    fixture.detectChanges();

    // savedAccounts are grouped by provider
    expect(component.accounts.ad.data.length).toEqual(0);
    expect(component.accounts.ga.data.length).toEqual(0);
    expect(component.accounts.fb.data.length).toEqual(0);
    expect(component.accounts.bg.data.length).toEqual(0);
    expect(component.accounts.tt.data.length).toEqual(0);

    // DOM initial state -> All accounts forms must be visible
    const formsVisibility = getAccountsFormsVisibility();
    Object.values(formsVisibility).forEach((element) => {
      expect(element.visible).toEqual(true);
    });
  });

  it('should receive savedAccounts as input with empty array value', () => {
    // assign savedAccounts input value
    component.savedAccounts = [];
    fixture.detectChanges();

    // savedAccounts are grouped by provider
    expect(component.accounts.ad.data.length).toEqual(0);
    expect(component.accounts.ga.data.length).toEqual(0);
    expect(component.accounts.fb.data.length).toEqual(0);
    expect(component.accounts.bg.data.length).toEqual(0);
    expect(component.accounts.tt.data.length).toEqual(0);

    // DOM initial state -> All accounts forms must be visible
    const formsVisibility = getAccountsFormsVisibility();
    Object.values(formsVisibility).forEach((element) => {
      expect(element.visible).toEqual(true);
    });
  });

  it('should receive savedAccounts as input without accounts for a specific provider', () => {
    // assign savedAccounts input value (there aren't accounts for Bing provider)
    component.savedAccounts = [
      ...adwordsMockData,
      ...analyticsMockData,
      ...facebookMockData,
      ...bingMockData,
      ...tiktokMockData,
    ];
    fixture.detectChanges();

    // savedAccounts are grouped by provider
    expect(component.accounts.ad.data.length).toEqual(adwordsMockData.length);
    expect(component.accounts.ga.data.length).toEqual(analyticsMockData.length);
    expect(component.accounts.fb.data.length).toEqual(facebookMockData.length);
    expect(component.accounts.bg.data.length).toEqual(bingMockData.length);
    expect(component.accounts.tt.data.length).toEqual(tiktokMockData.length);

    // DOM initial state
    const tablesVisibility = getAccountsTablesVisibility();
    const formsVisibility = getAccountsFormsVisibility();

    expect(tablesVisibility.ad.visible).toEqual(true);
    expect(tablesVisibility.ga.visible).toEqual(true);
    expect(tablesVisibility.fb.visible).toEqual(true);
    expect(tablesVisibility.bg.visible).toEqual(true);
    expect(tablesVisibility.tt.visible).toEqual(true);

    expect(formsVisibility.ad.visible).toEqual(false);
    expect(formsVisibility.ga.visible).toEqual(false);
    expect(formsVisibility.fb.visible).toEqual(false);
    expect(formsVisibility.bg.visible).toEqual(false);
    expect(formsVisibility.tt.visible).toEqual(false);
  });

  it('should add account when there are saved accounts for a adwords provider', () => {
    // add spyOn to check if event emitter is sended to parent component
    spyOn(component.accountsChange, 'emit');

    // assign savedAccounts input value
    component.savedAccounts = [...adwordsMockData];
    fixture.detectChanges();

    // DOM initial state -> accounts table is visible and form is hidden
    let tablesVisibility = getAccountsTablesVisibility();
    let formsVisibility = getAccountsFormsVisibility();

    expect(tablesVisibility.ad.visible).toEqual(true);
    expect(formsVisibility.ad.visible).toEqual(false);

    // click on "Add account" button
    const addAccountButton = fixture.debugElement.query(
      By.css('#add-ad-account-button')
    ).nativeElement;
    addAccountButton.click();
    fixture.detectChanges();

    tablesVisibility = getAccountsTablesVisibility();
    formsVisibility = getAccountsFormsVisibility();

    // accounts table and form are visible
    expect(tablesVisibility.ad.visible).toEqual(true);
    expect(formsVisibility.ad.visible).toEqual(true);

    // fill form fields
    component.formAd.setValue(mockAccountFormData);
    fixture.detectChanges();

    // click on "Save" button
    const formSubmitButton = fixture.debugElement.query(
      By.css('#ad-accounts-form-container button[type="submit"]')
    ).nativeElement;
    formSubmitButton.click();
    fixture.detectChanges();

    tablesVisibility = getAccountsTablesVisibility();
    formsVisibility = getAccountsFormsVisibility();

    // adwords accounts array has one item more
    // accounts table is visible and form is hidden
    expect(component.accounts.ad.data.length).toEqual(
      adwordsMockData.length + 1
    );
    expect(tablesVisibility.ad.visible).toEqual(true);
    expect(formsVisibility.ad.visible).toEqual(false);
    expect(component.accountsChange.emit).toHaveBeenCalled();
  });

  it('should add account when there are saved accounts for a analytics provider', () => {
    // add spyOn to check if event emitter is sended to parent component
    spyOn(component.accountsChange, 'emit');

    // assign savedAccounts input value
    const mockAnalyticsAccountFormData = {
      ...mockAccountFormData,
      propertyID: '176467284',
      viewID: '83746472664',
    };
    component.savedAccounts = [...analyticsMockData];
    fixture.detectChanges();

    // DOM initial state -> accounts table is visible and form is hidden
    let tablesVisibility = getAccountsTablesVisibility();
    let formsVisibility = getAccountsFormsVisibility();

    expect(tablesVisibility.ga.visible).toEqual(true);
    expect(formsVisibility.ga.visible).toEqual(false);

    // click on "Add account" button
    const addAccountButton = fixture.debugElement.query(
      By.css('#add-ga-account-button')
    ).nativeElement;
    addAccountButton.click();
    fixture.detectChanges();

    tablesVisibility = getAccountsTablesVisibility();
    formsVisibility = getAccountsFormsVisibility();

    // accounts table and form are visible
    expect(tablesVisibility.ga.visible).toEqual(true);
    expect(formsVisibility.ga.visible).toEqual(true);

    // fill form fields
    component.formGa.setValue(mockAnalyticsAccountFormData);
    fixture.detectChanges();

    // click on "Save" button
    const formSubmitButton = fixture.debugElement.query(
      By.css('#ga-accounts-form-container button[type="submit"]')
    ).nativeElement;
    formSubmitButton.click();
    fixture.detectChanges();

    tablesVisibility = getAccountsTablesVisibility();
    formsVisibility = getAccountsFormsVisibility();

    // analyticis accounts array has one item more
    // accounts table is visible and form is hidden
    expect(component.accounts.ga.data.length).toEqual(
      analyticsMockData.length + 1
    );
    expect(tablesVisibility.ga.visible).toEqual(true);
    expect(formsVisibility.ga.visible).toEqual(false);
    expect(component.accountsChange.emit).toHaveBeenCalled();
  });

  it('should add account when there are saved accounts for a facebook provider', () => {
    // add spyOn to check if event emitter is sended to parent component
    spyOn(component.accountsChange, 'emit');

    // assign savedAccounts input value
    component.savedAccounts = [...facebookMockData];
    fixture.detectChanges();

    // DOM initial state -> accounts table is visible and form is hidden
    let tablesVisibility = getAccountsTablesVisibility();
    let formsVisibility = getAccountsFormsVisibility();

    expect(tablesVisibility.fb.visible).toEqual(true);
    expect(formsVisibility.fb.visible).toEqual(false);

    // click on "Add account" button
    const addAccountButton = fixture.debugElement.query(
      By.css('#add-fb-account-button')
    ).nativeElement;
    addAccountButton.click();
    fixture.detectChanges();

    tablesVisibility = getAccountsTablesVisibility();
    formsVisibility = getAccountsFormsVisibility();

    // accounts table and form are visible
    expect(tablesVisibility.fb.visible).toEqual(true);
    expect(formsVisibility.fb.visible).toEqual(true);

    // fill form fields
    component.formFb.setValue(mockAccountFormData);
    fixture.detectChanges();

    // click on "Save" button
    const formSubmitButton = fixture.debugElement.query(
      By.css('#fb-accounts-form-container button[type="submit"]')
    ).nativeElement;
    formSubmitButton.click();
    fixture.detectChanges();

    tablesVisibility = getAccountsTablesVisibility();
    formsVisibility = getAccountsFormsVisibility();

    // facebook accounts array has one item more
    // accounts table is visible and form is hidden
    expect(component.accounts.fb.data.length).toEqual(
      facebookMockData.length + 1
    );
    expect(tablesVisibility.fb.visible).toEqual(true);
    expect(formsVisibility.fb.visible).toEqual(false);
    expect(component.accountsChange.emit).toHaveBeenCalled();
  });

  it('should add account when there are saved accounts for a bing provider', () => {
    // add spyOn to check if event emitter is sended to parent component
    spyOn(component.accountsChange, 'emit');

    // assign savedAccounts input value
    component.savedAccounts = [...bingMockData];
    fixture.detectChanges();

    // DOM initial state -> accounts table is visible and form is hidden
    let tablesVisibility = getAccountsTablesVisibility();
    let formsVisibility = getAccountsFormsVisibility();

    expect(tablesVisibility.bg.visible).toEqual(true);
    expect(formsVisibility.bg.visible).toEqual(false);

    // click on "Add account" button
    const addAccountButton = fixture.debugElement.query(
      By.css('#add-bg-account-button')
    ).nativeElement;
    addAccountButton.click();
    fixture.detectChanges();

    tablesVisibility = getAccountsTablesVisibility();
    formsVisibility = getAccountsFormsVisibility();

    // accounts table and form are visible
    expect(tablesVisibility.bg.visible).toEqual(true);
    expect(formsVisibility.bg.visible).toEqual(true);

    // fill form fields
    component.formBg.setValue(mockAccountFormData);
    fixture.detectChanges();

    // click on "Save" button
    const formSubmitButton = fixture.debugElement.query(
      By.css('#bg-accounts-form-container button[type="submit"]')
    ).nativeElement;
    formSubmitButton.click();
    fixture.detectChanges();

    tablesVisibility = getAccountsTablesVisibility();
    formsVisibility = getAccountsFormsVisibility();

    // bing accounts array has one item more
    // accounts table is visible and form is hidden
    expect(component.accounts.bg.data.length).toEqual(bingMockData.length + 1);
    expect(tablesVisibility.bg.visible).toEqual(true);
    expect(formsVisibility.bg.visible).toEqual(false);
    expect(component.accountsChange.emit).toHaveBeenCalled();
  });

  it('should add account when there are saved accounts for a tiktok provider', () => {
    // add spyOn to check if event emitter is sended to parent component
    spyOn(component.accountsChange, 'emit');

    // assign savedAccounts input value
    component.savedAccounts = [...tiktokMockData];
    fixture.detectChanges();

    // DOM initial state -> accounts table is visible and form is hidden
    let tablesVisibility = getAccountsTablesVisibility();
    let formsVisibility = getAccountsFormsVisibility();

    expect(tablesVisibility.tt.visible).toEqual(true);
    expect(formsVisibility.tt.visible).toEqual(false);

    // click on "Add account" button
    const addAccountButton = fixture.debugElement.query(
      By.css('#add-tt-account-button')
    ).nativeElement;
    addAccountButton.click();
    fixture.detectChanges();

    tablesVisibility = getAccountsTablesVisibility();
    formsVisibility = getAccountsFormsVisibility();

    // accounts table and form are visible
    expect(tablesVisibility.tt.visible).toEqual(true);
    expect(formsVisibility.tt.visible).toEqual(true);

    // fill form fields
    component.formTt.setValue(mockAccountFormData);
    fixture.detectChanges();

    // click on "Save" button
    const formSubmitButton = fixture.debugElement.query(
      By.css('#tt-accounts-form-container button[type="submit"]')
    ).nativeElement;
    formSubmitButton.click();
    fixture.detectChanges();

    tablesVisibility = getAccountsTablesVisibility();
    formsVisibility = getAccountsFormsVisibility();

    // bing accounts array has one item more
    // accounts table is visible and form is hidden
    expect(component.accounts.tt.data.length).toEqual(
      tiktokMockData.length + 1
    );
    expect(tablesVisibility.tt.visible).toEqual(true);
    expect(formsVisibility.tt.visible).toEqual(false);
    expect(component.accountsChange.emit).toHaveBeenCalled();
  });

  it(`should add account when there aren't saved accounts for a adwords provider`, () => {
    // add spyOn to check if event emitter is sended to parent component
    spyOn(component.accountsChange, 'emit');

    // assign savedAccounts input value
    const savedAccounts = [];
    component.savedAccounts = savedAccounts;
    fixture.detectChanges();

    // DOM initial state -> accounts form is visible and table is hidden
    let tablesVisibility = getAccountsTablesVisibility();
    let formsVisibility = getAccountsFormsVisibility();

    expect(tablesVisibility.ad.visible).toEqual(false);
    expect(formsVisibility.ad.visible).toEqual(true);

    // fill form fields
    component.formAd.setValue(mockAccountFormData);
    fixture.detectChanges();

    // click on "Save" button
    const formSubmitButton = fixture.debugElement.query(
      By.css('#ad-accounts-form-container button[type="submit"]')
    ).nativeElement;
    formSubmitButton.click();
    fixture.detectChanges();

    tablesVisibility = getAccountsTablesVisibility();
    formsVisibility = getAccountsFormsVisibility();

    // adwords accounts array has its first item saved
    // accounts table is visible and form is hidden
    expect(component.accounts.ad.data.length).toEqual(savedAccounts.length + 1);
    expect(tablesVisibility.ad.visible).toEqual(true);
    expect(formsVisibility.ad.visible).toEqual(false);
    expect(component.accountsChange.emit).toHaveBeenCalled();
  });

  it(`should add account when there aren't saved accounts for a analytics provider`, () => {
    // add spyOn to check if event emitter is sended to parent component
    spyOn(component.accountsChange, 'emit');

    // assign savedAccounts input value
    const savedAccounts = [];
    component.savedAccounts = savedAccounts;
    fixture.detectChanges();

    // DOM initial state -> accounts form is visible and table is hidden
    let tablesVisibility = getAccountsTablesVisibility();
    let formsVisibility = getAccountsFormsVisibility();

    expect(tablesVisibility.ga.visible).toEqual(false);
    expect(formsVisibility.ga.visible).toEqual(true);

    // fill form fields
    const mockAnalyticsAccountFormData = {
      ...mockAccountFormData,
      propertyID: '176467284',
      viewID: '83746472664',
    };
    component.formGa.setValue(mockAnalyticsAccountFormData);
    fixture.detectChanges();

    // click on "Save" button
    const formSubmitButton = fixture.debugElement.query(
      By.css('#ga-accounts-form-container button[type="submit"]')
    ).nativeElement;
    formSubmitButton.click();
    fixture.detectChanges();

    tablesVisibility = getAccountsTablesVisibility();
    formsVisibility = getAccountsFormsVisibility();

    // analytics accounts array has its first item saved
    // accounts table is visible and form is hidden
    expect(component.accounts.ga.data.length).toEqual(savedAccounts.length + 1);
    expect(tablesVisibility.ga.visible).toEqual(true);
    expect(formsVisibility.ga.visible).toEqual(false);
    expect(component.accountsChange.emit).toHaveBeenCalled();
  });

  it(`should add account when there aren't saved accounts for a facebook provider`, () => {
    // add spyOn to check if event emitter is sended to parent component
    spyOn(component.accountsChange, 'emit');

    // assign savedAccounts input value
    const savedAccounts = [];
    component.savedAccounts = savedAccounts;
    fixture.detectChanges();

    // DOM initial state -> accounts form is visible and table is hidden
    let tablesVisibility = getAccountsTablesVisibility();
    let formsVisibility = getAccountsFormsVisibility();

    expect(tablesVisibility.fb.visible).toEqual(false);
    expect(formsVisibility.fb.visible).toEqual(true);

    // fill form fields
    component.formFb.setValue(mockAccountFormData);
    fixture.detectChanges();

    // click on "Save" button
    const formSubmitButton = fixture.debugElement.query(
      By.css('#fb-accounts-form-container button[type="submit"]')
    ).nativeElement;
    formSubmitButton.click();
    fixture.detectChanges();

    tablesVisibility = getAccountsTablesVisibility();
    formsVisibility = getAccountsFormsVisibility();

    // facebook accounts array has its first item saved
    // accounts table is visible and form is hidden
    expect(component.accounts.fb.data.length).toEqual(savedAccounts.length + 1);
    expect(tablesVisibility.fb.visible).toEqual(true);
    expect(formsVisibility.fb.visible).toEqual(false);
    expect(component.accountsChange.emit).toHaveBeenCalled();
  });

  it(`should add account when there aren't saved accounts for a bing provider`, () => {
    // add spyOn to check if event emitter is sended to parent component
    spyOn(component.accountsChange, 'emit');

    // assign savedAccounts input value
    const savedAccounts = [];
    component.savedAccounts = savedAccounts;
    fixture.detectChanges();

    // DOM initial state -> accounts form is visible and table is hidden
    let tablesVisibility = getAccountsTablesVisibility();
    let formsVisibility = getAccountsFormsVisibility();

    expect(tablesVisibility.bg.visible).toEqual(false);
    expect(formsVisibility.bg.visible).toEqual(true);

    // fill form fields
    component.formBg.setValue(mockAccountFormData);
    fixture.detectChanges();

    // click on "Save" button
    const formSubmitButton = fixture.debugElement.query(
      By.css('#bg-accounts-form-container button[type="submit"]')
    ).nativeElement;
    formSubmitButton.click();
    fixture.detectChanges();

    tablesVisibility = getAccountsTablesVisibility();
    formsVisibility = getAccountsFormsVisibility();

    // bing accounts array has its first item saved
    // accounts table is visible and form is hidden
    expect(component.accounts.bg.data.length).toEqual(savedAccounts.length + 1);
    expect(tablesVisibility.bg.visible).toEqual(true);
    expect(formsVisibility.bg.visible).toEqual(false);
    expect(component.accountsChange.emit).toHaveBeenCalled();
  });

  it(`should add account when there aren't saved accounts for a tiktok provider`, () => {
    // add spyOn to check if event emitter is sended to parent component
    spyOn(component.accountsChange, 'emit');

    // assign savedAccounts input value
    const savedAccounts = [];
    component.savedAccounts = savedAccounts;
    fixture.detectChanges();

    // DOM initial state -> accounts form is visible and table is hidden
    let tablesVisibility = getAccountsTablesVisibility();
    let formsVisibility = getAccountsFormsVisibility();

    expect(tablesVisibility.tt.visible).toEqual(false);
    expect(formsVisibility.tt.visible).toEqual(true);

    // fill form fields
    component.formTt.setValue(mockAccountFormData);
    fixture.detectChanges();

    // click on "Save" button
    const formSubmitButton = fixture.debugElement.query(
      By.css('#tt-accounts-form-container button[type="submit"]')
    ).nativeElement;
    formSubmitButton.click();
    fixture.detectChanges();

    tablesVisibility = getAccountsTablesVisibility();
    formsVisibility = getAccountsFormsVisibility();

    // bing accounts array has its first item saved
    // accounts table is visible and form is hidden
    expect(component.accounts.tt.data.length).toEqual(savedAccounts.length + 1);
    expect(tablesVisibility.tt.visible).toEqual(true);
    expect(formsVisibility.tt.visible).toEqual(false);
    expect(component.accountsChange.emit).toHaveBeenCalled();
  });

  it(`should select an account to handle update`, () => {
    // add spyOn for selectAccount method
    spyOn(component, 'selectAccount');

    // assign savedAccounts input value
    component.savedAccounts = adwordsMockData;
    fixture.detectChanges();

    // simuale that the first item of adwordsMockData array
    // was selected from accounts table
    const selection = {
      columnName: TableAction.update,
      row: { ...adwordsMockData[0] },
    };
    component.selectAccount(ProvidersShort.ad, selection);
    expect(component.selectAccount).toHaveBeenCalled();
  });

  it(`should select an account to be edited filling form fields with account data`, () => {
    // asign managers value
    const manager = {
      id: 'bXVNHRKJpsVf73DtVJgOsTp3XR32',
      name: 'Selene Rangel Huerta',
    };
    component.managers = [manager];

    // assign savedAccounts input value
    const savedAccount = {
      credentialEmail: CUSTOMER_CREDENTIAL_EMAIL[0].name,
      accountID: '5654116356',
      name: 'Soriana Account',
      propertyID: '63535242463',
      viewID: '3335550',
      timezone: CUSTOMER_TIME_ZONES[0].id,
      currency: CUSTOMER_CURRENCY_CODES[0].id,
      manager: {
        name: 'Selene Rangel Huerta',
        userID: 'bXVNHRKJpsVf73DtVJgOsTp3XR32',
      },
      vertical: 'Retail',
      businessUnit: 'Soriana',
      objective: 'BRANDING',
      provider: 'analytics',
    };

    // add some changes to savedAccount to simulate edition
    const updatedAccount = {
      ...savedAccount,
      viewID: '44076354',
      timezone: CUSTOMER_TIME_ZONES[1].id,
    };

    const expectedFormValueForUpdatedAccount = {
      credentialEmail: CUSTOMER_CREDENTIAL_EMAIL[0],
      accountID: '5654116356',
      name: 'Soriana Account',
      propertyID: '63535242463',
      viewID: '44076354',
      timezone: CUSTOMER_TIME_ZONES[1],
      currency: CUSTOMER_CURRENCY_CODES[0],
      manager: manager,
      vertical: 'Retail',
      businessUnit: 'Soriana',
      objective: 'BRANDING',
    };

    component.savedAccounts = [{ ...savedAccount }];
    fixture.detectChanges();

    component.selectAccountToEdit(ProvidersShort.ga, updatedAccount);
    fixture.detectChanges();
    expect(component.formGa.value).toEqual(expectedFormValueForUpdatedAccount);
  });

  it(`should select an account to handle delete`, () => {
    // add spyOn for selectAccount method
    spyOn(component, 'removeAccount');

    // assign savedAccounts input value
    component.savedAccounts = adwordsMockData;
    fixture.detectChanges();

    // simuale that the first item of adwordsMockData array
    // was selected from accounts table
    const selection = {
      columnName: TableAction.delete,
      row: { ...adwordsMockData[0] },
    };
    component.selectAccount(ProvidersShort.ad, selection);
    expect(component.removeAccount).toHaveBeenCalled();
  });

  it(`should select an account to be deleted`, () => {
    // asign managers value
    const manager = {
      id: 'bXVNHRKJpsVf73DtVJgOsTp3XR32',
      name: 'Selene Rangel Huerta',
    };
    component.managers = [manager];

    // assign savedAccounts input value
    const savedAccount = {
      credentialEmail: CUSTOMER_CREDENTIAL_EMAIL[0].name,
      accountID: '5654116356',
      name: 'Soriana Account',
      propertyID: '63535242463',
      viewID: '3335550',
      timezone: CUSTOMER_TIME_ZONES[0].id,
      currency: CUSTOMER_CURRENCY_CODES[0].id,
      manager: {
        name: 'Selene Rangel Huerta',
        userID: 'bXVNHRKJpsVf73DtVJgOsTp3XR32',
      },
      vertical: 'Retail',
      businessUnit: 'Soriana',
      objective: 'BRANDING',
      provider: 'analytics',
    };

    component.savedAccounts = [{ ...savedAccount }];
    fixture.detectChanges();

    component.removeAccount(ProvidersShort.ga, savedAccount);
    fixture.detectChanges();

    expect(component.accounts.ga).not.toContain(savedAccount);
  });

  it('should show action icons in table columns when the user has admin access', () => {
    // asign disableActions input value (parent component assign false value when the user role isn't admin)
    component.disableActions = false;
    component.loadTablesColumns();

    const expectedAccountsTableColumns = [
      ...component.dataTableColumns,
      ...component.actionsTableColumns,
    ];
    expect(component.accountsTableColumns).toEqual(
      expectedAccountsTableColumns
    );
  });

  it('should hide action icons in table columns when the user has not admin access', () => {
    // asign disableActions input value (parent component assign true value when the user role is admin)
    component.disableActions = true;
    component.loadTablesColumns();

    const expectedAccountsTableColumns = [...component.dataTableColumns];
    expect(component.accountsTableColumns).toEqual(
      expectedAccountsTableColumns
    );
  });

  it('should group savedAccounts by providers', () => {
    // assign savedAccounts input value
    component.savedAccounts = [
      ...adwordsMockData,
      ...analyticsMockData,
      ...facebookMockData,
      ...bingMockData,
    ];
    fixture.detectChanges();

    component.loadAccountsData();

    expect(component.accounts.ad.data.length).toEqual(adwordsMockData.length);
    expect(component.accounts.ga.data.length).toEqual(analyticsMockData.length);
    expect(component.accounts.fb.data.length).toEqual(facebookMockData.length);
    expect(component.accounts.bg.data.length).toEqual(bingMockData.length);
  });

  it('should change form visibility', () => {
    component.changeFormVisibility(ProvidersShort.ad, false);
    fixture.detectChanges();
    expect(component.showFormAd).toEqual(false);

    component.changeFormVisibility(ProvidersShort.ad, true);
    fixture.detectChanges();
    expect(component.showFormAd).toEqual(true);
  });

  it('should handle manager change from forms fields', () => {
    const manager = {
      id: 'bXVNHRKJpsVf73DtVJgOsTp3XR32',
      name: 'Selene Rangel Huerta',
    };
    component.managers = [manager];
    fixture.detectChanges();

    component.managerChange(ProvidersShort.ad, manager);
    fixture.detectChanges();

    expect(component.formAd.controls.manager.value).toEqual(manager);
  });
});

interface DomElementVisibility {
  selector: string;
  visible: boolean;
}

interface DomElementsListVisibility {
  [ProvidersShort.ad]: DomElementVisibility;
  [ProvidersShort.ga]: DomElementVisibility;
  [ProvidersShort.fb]: DomElementVisibility;
  [ProvidersShort.bg]: DomElementVisibility;
  [ProvidersShort.tt]: DomElementVisibility;
}
