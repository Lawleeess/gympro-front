import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Providers } from 'src/app/enums/general';
import {
  Accounts,
  AdwordsAccount,
  AnalyticsAccount,
  BingAccount,
  Customer,
  FacebookAccount,
  GA4Account,
  LinkedinAccount,
} from 'src/app/models/customer';

import { CustomerReviewComponent } from './customer-review.component';

describe('CustomerReviewComponent', () => {
  let component: CustomerReviewComponent;
  let fixture: ComponentFixture<CustomerReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerReviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const mockAccounts: Accounts = [
    {
      accountID: '4339337',
      clientName: 'Soriana',
      credentialEmail: 'analytics@epa.digital',
      currency: 'MXN',
      name: 'Soriana - Branding',
      postgresID: 42,
      propertyID: 'UA-4339337-6',
      provider: 'analytics',
      timezone: 'America/Mexico_City',
      viewID: '96327676',
    },
    {
      accountID: '4339337',
      clientName: 'Soriana',
      credentialEmail: 'analytics@epa.digital',
      currency: 'MXN',
      name: 'Soriana - Super en tu Casa',
      postgresID: 41,
      propertyID: 'UA-4339337-8',
      provider: 'analytics',
      timezone: 'America/Mexico_City',
      viewID: '96564224',
    },
    {
      accountID: '9105694911',
      businessUnit: 'Soriana',
      credentialEmail: 'analytics@epa.digital',
      currency: 'MXN',
      externalLoginCustomerID: '2465423267',
      manager: {
        name: 'Leslie Victoria Salazar Villalobos',
        userID: '4jNmhgytVkWisrQ6kTLYRSSMYZA3',
      },
      name: 'Soriana Shopping Nueva',
      objective: 'ECOMMERCE',
      postgresID: 242,
      provider: 'adwords',
      timezone: 'America/Mexico_City',
      vertical: 'Retail',
    },
    {
      accountID: '1086823941372787',
      clientName: 'Soriana',
      credentialEmail: 'analytics@epa.digital',
      currency: '',
      name: 'Soriana',
      postgresID: 7,
      provider: 'facebook',
      timezone: 'America/Mexico_City',
    },
    {
      accountID: '818300711548788',
      businessUnit: 'City Club',
      credentialEmail: 'analytics@epa.digital',
      currency: 'MXN',
      manager: {
        name: 'Dafne Gomez',
        userID: 'XC8Po1uWEMMxwZElQZZHokzkWr72',
      },
      name: 'City Club',
      objective: 'BRANDING',
      postgresID: 179,
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
    {
      accountID: '9390803711',
      businessUnit: 'Soriana',
      credentialEmail: 'analytics@epa.digital',
      currency: 'MXN',
      externalLoginCustomerID: '2465423267',
      propertyID: '12345678',
      manager: {
        name: 'Selene Rangel Huerta',
        userID: 'bXVNHRKJpsVf73DtVJgOsTp3XR32',
      },
      name: 'Soriana Tiktok Branding',
      objective: 'BRANDING',
      postgresID: 999,
      provider: 'analytics4',
      timezone: 'America/Mexico_City',
      vertical: 'Retail',
    },
    {
      accountID: '9390803711',
      businessUnit: 'Soriana',
      credentialEmail: 'analytics@epa.digital',
      currency: 'MXN',
      manager: {
        name: 'Selene Rangel Huerta',
        userID: 'bXVNHRKJpsVf73DtVJgOsTp3XR32',
      },
      name: 'Soriana linkedin Branding',
      objective: 'BRANDING',
      postgresID: 999,
      provider: 'linkedin',
      timezone: 'America/Mexico_City',
      vertical: 'Retail',
    },
  ];

  const mockCustomer: Customer = {
    name: 'Soriana',
    url: '',
    countryCode: 'MX',
    timezone: 'America/Mexico_City',
    currency: 'MXN',
    status: 'Active',
    billing: {
      legalName: '',
      taxID: '',
      fiscalAddress: '',
      paymentConditions: '',
    },
    contactInfo: {
      name: '',
      phoneNumber: '',
      email: '',
    },
    auditConfiguration: {
      targetAuditScore: 0,
      lastVariationAuditScore: {
        date: '',
        score: 0,
      },
    },
    accounts: [],
  };

  const adwordsMockAccounts: AdwordsAccount[] = mockAccounts.filter(
    (i) => i.provider === Providers.adwords
  );
  const analyticsMockAccounts: AnalyticsAccount[] = mockAccounts.filter(
    (i) => i.provider === Providers.analytics
  );
  const facebookMockAccounts: FacebookAccount[] = mockAccounts.filter(
    (i) => i.provider === Providers.facebook
  );
  const bingMockAccounts: BingAccount[] = mockAccounts.filter(
    (i) => i.provider === Providers.bing
  );
  const tiktokMockAccounts: BingAccount[] = mockAccounts.filter(
    (i) => i.provider === Providers.tiktok
  );
  const analytics4MockAccounts: GA4Account[] = mockAccounts.filter(
    (i) => i.provider === Providers.analytics4
  );
  const linkedinMockAccounts: LinkedinAccount[] = mockAccounts.filter(
    (i) => i.provider === Providers.linkedin
  );

  it('should group accounts by provider when there is at least one account per provider', () => {
    // assign value for customer input
    const accounts: Accounts = [
      ...adwordsMockAccounts,
      ...analyticsMockAccounts,
      ...facebookMockAccounts,
      ...bingMockAccounts,
      ...tiktokMockAccounts,
      ...analytics4MockAccounts,
      ...linkedinMockAccounts,
    ];
    const customer: Customer = { ...mockCustomer, accounts };
    component.customer = customer;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(component.accountsAd.length).toEqual(adwordsMockAccounts.length);
    expect(component.accountsGa.length).toEqual(analyticsMockAccounts.length);
    expect(component.accountsFb.length).toEqual(facebookMockAccounts.length);
    expect(component.accountsBg.length).toEqual(bingMockAccounts.length);
    expect(component.accountsTt.length).toEqual(tiktokMockAccounts.length);
    expect(component.accountsGA4.length).toEqual(analytics4MockAccounts.length);
    expect(component.accountsLin.length).toEqual(linkedinMockAccounts.length);
  });

  it(`should group accounts by provider when there isn't accounts for a provider`, () => {
    // assign value for customer input
    const accounts: Accounts = [
      ...adwordsMockAccounts,
      ...analyticsMockAccounts,
      ...facebookMockAccounts,
      ...bingMockAccounts,
      ...tiktokMockAccounts,
      ...analytics4MockAccounts,
      ...linkedinMockAccounts,
    ];
    const customer: Customer = { ...mockCustomer, accounts };
    component.customer = customer;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(component.accountsAd.length).toEqual(adwordsMockAccounts.length);
    expect(component.accountsGa.length).toEqual(analyticsMockAccounts.length);
    expect(component.accountsFb.length).toEqual(facebookMockAccounts.length);
    expect(component.accountsBg.length).toEqual(bingMockAccounts.length);
    expect(component.accountsTt.length).toEqual(tiktokMockAccounts.length);
    expect(component.accountsGA4.length).toEqual(analytics4MockAccounts.length);
    expect(component.accountsLin.length).toEqual(linkedinMockAccounts.length);
  });

  it('should group accounts by provider when customer accounts is null', () => {
    // assign value for customer input
    const accounts: Accounts = null;
    const customer: Customer = { ...mockCustomer, accounts };
    component.customer = customer;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(component.accountsAd.length).toEqual(0);
    expect(component.accountsGa.length).toEqual(0);
    expect(component.accountsFb.length).toEqual(0);
    expect(component.accountsBg.length).toEqual(0);
    expect(component.accountsTt.length).toEqual(0);
    expect(component.accountsGA4.length).toEqual(0);
    expect(component.accountsLin.length).toEqual(0);
  });

  it('should group accounts by provider when customer accounts is an empty array', () => {
    // assign value for customer input
    const accounts: Accounts = [];
    const customer: Customer = { ...mockCustomer, accounts };
    component.customer = customer;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(component.accountsAd.length).toEqual(0);
    expect(component.accountsGa.length).toEqual(0);
    expect(component.accountsFb.length).toEqual(0);
    expect(component.accountsBg.length).toEqual(0);
    expect(component.accountsTt.length).toEqual(0);
    expect(component.accountsGA4.length).toEqual(0);
    expect(component.accountsLin.length).toEqual(0);
  });
});
