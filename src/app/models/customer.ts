export class Customer {
  id?: string;
  name: string;
  url: string;
  status: string;
  countryCode: string;
  timezone: string;
  currency: string;
  postgresID?: number;
  accounts?: Accounts;
  billing: {
    legalName: string;
    taxID: string;
    fiscalAddress: string;
    paymentConditions: string;
  };
  contactInfo: {
    name: string;
    phoneNumber: string;
    email: string;
  };
  auditConfiguration: {
    targetAuditScore: number;
    lastVariationAuditScore: {
      date: string;
      score: number;
    };
  };
}

class Account {
  accountID: string;
  name: string;
  provider: string;
  credentialEmail: string;
  timezone: string;
  currency: string;
  clientName?: string;
  postgresID?: number;
  vertical?: string;
  objective?: string;
  businessUnit?: string;
  manager?: {
    userID: string;
    name: string;
  };
  externalLoginCustomerID?: string;
  managerName?: string; // only for fronted
  auxID?: number; // only for fronted when an account is added
}

export class AdwordsAccount extends Account {}

export class FacebookAccount extends Account {}

export class AnalyticsAccount extends Account {
  // for API integration these properties are always used
  // but in order to handle an AnaliticsAccount as data type
  // and handle it inside an array of different accounts
  // it's necesary to use these properties as optional
  propertyID?: string;
  viewID?: string;
}

export class BingAccount extends Account {}

export class TikTokAccount extends Account {}

export class LinkedinAccount extends Account {}

export class GA4Account extends Account {
  propertyID?: string;
}

export type Accounts = (
  | AdwordsAccount
  | FacebookAccount
  | AnalyticsAccount
  | BingAccount
  | TikTokAccount
  | GA4Account
  | LinkedinAccount
)[];
