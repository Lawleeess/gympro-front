export class User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  modulesWithPermission?: Module[];

  phone_number: string;
  birthday: string;
  subscription: string;
  url_image: string;
  user_role: string;

  userProgress?: UserProgress; 
  userGoals?: UserGoals; 
  userRoutine?: UserRoutine; 

}

export class UserRoutine{
	monday    : Routine[] | []
	tuesday   : Routine[] | []
	wednesday : Routine[] | []
	thursday  : Routine[] | []
	friday    : Routine[] | []
	saturday  : Routine[] | []
}

export class Routine{
  id       :   string 
  muscle_group: string
  name        :string 
  description :string 
  video_url    :string 
  url_image: string
}

export class UserGoals{
  imc:     string;
  bmr:     string;
	tdee:    string;
	goal:    string;
	protein: string;
	carbs:   string;
	fat:     string;
}

export class UserProgress{
  age:      number;     
	gender:   string; 
	height:   number;     
	weight:   number;
	activity: string; 
	goal:     string; 
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
export interface Roles {
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
