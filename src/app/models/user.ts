export class User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  modulesWithPermission?: Module[];
  clientsRole?: string;

  phone_number: string;
  birthday: string;
  subscription: string;
  role: string;

}

export class Module {
  name: string;
  role: string;
  clients?: ModuleClient[]; //clients contains id and name of clients where user has access with that module/tool
}

export class Customers {
  clients?: ModuleClient[]; //clients contains id and name of clients where user has access with that module/tool
}

interface ModuleClient {
  id: string;
}
export interface Department {
  value: string;
  label: string;
}
export class Preference {
  moduleID: string;
  pages: Page[];
}
export class Page {
  name: string; // string value of PAGES const (app/constants/modules)
  preferences: PreferenceDetails[];
}
export class PreferenceDetails {
  name: string; // use it as identificator
  type: PreferenceTypes;
  value: any;
}

export enum PreferenceTypes {
  tab = 'tab',
  filterOption = 'filterOption',
  filterOptions = 'filterOptions',
}
