import { Providers } from '../enums/general';
import { Provider } from '../models/account';

export const PROVIDERS: Provider[] = [
  { value: Providers.adwords, label: 'Adwords' },
  { value: Providers.facebook, label: 'Facebook' },
];
