export class MySqlDate {
    public static toJsDate(mysqlDate: string): Date {
        const split  = mysqlDate.split(/[- :]/);
        const year   = parseInt(split[0], 10);
        const month  = parseInt(split[1], 10) - 1;
        const day    = parseInt(split[2], 10);
        const hour   = isNaN(parseInt(split[3], 10)) ? 0: parseInt(split[3], 10);
        const minute = isNaN(parseInt(split[3], 10)) ? 0: parseInt(split[4], 10);
        const second = isNaN(parseInt(split[3], 10)) ? 0: parseInt(split[5], 10);
        const date   = new Date(year, month, day, hour, minute, second);

        return date;
    }

    public static toMySqlDate(jsDate: Date): string {
        function pad(n) { if(n < 10) {return '0' + n;} else {return n;} }

        let year    = jsDate.getFullYear();
        let month   = pad(jsDate.getMonth() + 1); // #getUTCMonth is zero indexed
        let day     = pad(jsDate.getDate());
        let hours   = pad(jsDate.getHours());
        let minutes = pad(jsDate.getMinutes());
        let seconds = pad(jsDate.getSeconds());

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    public static nowMySqlDate(): string {
        const now = new Date();
        const mysql = MySqlDate.toMySqlDate(now);

        return mysql;
    }
}