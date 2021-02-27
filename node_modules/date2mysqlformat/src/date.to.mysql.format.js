'use strict';

class Date2MysqlFormat {
    constructor() {}

    static dateOnly(date){
        if(date instanceof Date){
            let mysqlFormatString = '';
            mysqlFormatString = date.getFullYear();
            mysqlFormatString += '-';
            mysqlFormatString += ('0' + (date.getMonth()+1)).slice(-2);
            mysqlFormatString += '-';
            mysqlFormatString += ('0' + date.getDate()).slice(-2);

            return mysqlFormatString;
        }

        return null;
    }

    static dateAndTime(date){
        if(date instanceof Date) {
            let mysqlDateFormatString = Date2MysqlFormat.dateOnly(date);
            let mysqlTimeFormatString = '';
            mysqlTimeFormatString += ('0' + date.getHours()).slice(-2);
            mysqlTimeFormatString += ':';
            mysqlTimeFormatString += ('0' + date.getMinutes()).slice(-2);
            mysqlTimeFormatString += ':';
            mysqlTimeFormatString += ('0' + date.getSeconds()).slice(-2);

            return mysqlDateFormatString + ' ' + mysqlTimeFormatString;
        }

        return null;
    }
}

module.exports = Date2MysqlFormat;
