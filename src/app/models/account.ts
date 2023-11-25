export class Account {
  id: number;
  name: string;
  external_id: string;
}

export interface Provider {
  value: string;
  label: string;
}
