export declare class MySqlDate {
    static toJsDate(mysqlDate: string): Date;
    static toMySqlDate(jsDate: Date): string;
    static nowMySqlDate(): string;
}
