export class Script {
    id: number;
    name: string;
    category: string;
    description: string;
    version: string;
    date: string;
}

export class ScheduledScript {
    script_id: number;
    account_id?: number;
    frequency: string;
    notify?: boolean;
}