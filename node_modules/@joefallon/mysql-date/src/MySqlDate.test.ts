import { MySqlDate } from './MySqlDate';
import * as assert from 'assert';

describe('MySqlDate', () => {
    describe('#toJsDate', () => {
        it('converts a MySQL formatted datetime string to a JS Date object', async () => {
            const date1 = MySqlDate.toJsDate('2012-12-12 12:12:12');
            assert.equal(date1.toISOString(), '2012-12-12T20:12:12.000Z');

            const date2 = MySqlDate.toJsDate('2012-12-12 20:12:12');
            assert.equal(date2.toISOString(), '2012-12-13T04:12:12.000Z');

            const date3 = MySqlDate.toJsDate('2017-01-01 00:00:00');
            assert.equal(date3.toISOString(), '2017-01-01T08:00:00.000Z');
        });
    });

    describe('#toMySqlDate', () => {
        it('converts a JS Date object to a formatted MySQL datetime string', async () => {
            const jsDate1 = new Date(2012, 12 - 1, 12, 12, 12, 12);
            const mysql1 = MySqlDate.toMySqlDate(jsDate1);
            assert.equal(mysql1, '2012-12-12 12:12:12');

            const jsDate2 = new Date(2012, 12 - 1, 12, 20, 12, 12);
            const mysql2 = MySqlDate.toMySqlDate(jsDate2);
            assert.equal(mysql2, '2012-12-12 20:12:12');

            const jsDate3 = new Date(2017, 1 - 1, 1);
            const mysql3 = MySqlDate.toMySqlDate(jsDate3);
            assert.equal(mysql3, '2017-01-01 00:00:00');
        });
    });

    describe('#nowMySqlDate', () => {
        it('creates a MySQL formatted datetime string of the current time', async () => {
            const mysql = MySqlDate.nowMySqlDate();
            assert.equal(mysql.length, 19);
            assert.notEqual(mysql, '0000-00-00 00:00:00');

            const now1 = new Date().toTimeString();
            const now2 = MySqlDate.toJsDate(mysql).toTimeString();
            assert.equal(now1, now2);
        });
    });
});