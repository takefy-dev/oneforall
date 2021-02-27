"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var MySqlDate_1 = require("./MySqlDate");
var assert = require("assert");
describe('MySqlDate', function () {
    describe('#toJsDate', function () {
        it('converts a MySQL formatted datetime string to a JS Date object', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var date1, date2, date3;
            return tslib_1.__generator(this, function (_a) {
                date1 = MySqlDate_1.MySqlDate.toJsDate('2012-12-12 12:12:12');
                assert.equal(date1.toISOString(), '2012-12-12T20:12:12.000Z');
                date2 = MySqlDate_1.MySqlDate.toJsDate('2012-12-12 20:12:12');
                assert.equal(date2.toISOString(), '2012-12-13T04:12:12.000Z');
                date3 = MySqlDate_1.MySqlDate.toJsDate('2017-01-01 00:00:00');
                assert.equal(date3.toISOString(), '2017-01-01T08:00:00.000Z');
                return [2 /*return*/];
            });
        }); });
    });
    describe('#toMySqlDate', function () {
        it('converts a JS Date object to a formatted MySQL datetime string', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var jsDate1, mysql1, jsDate2, mysql2, jsDate3, mysql3;
            return tslib_1.__generator(this, function (_a) {
                jsDate1 = new Date(2012, 12 - 1, 12, 12, 12, 12);
                mysql1 = MySqlDate_1.MySqlDate.toMySqlDate(jsDate1);
                assert.equal(mysql1, '2012-12-12 12:12:12');
                jsDate2 = new Date(2012, 12 - 1, 12, 20, 12, 12);
                mysql2 = MySqlDate_1.MySqlDate.toMySqlDate(jsDate2);
                assert.equal(mysql2, '2012-12-12 20:12:12');
                jsDate3 = new Date(2017, 1 - 1, 1);
                mysql3 = MySqlDate_1.MySqlDate.toMySqlDate(jsDate3);
                assert.equal(mysql3, '2017-01-01 00:00:00');
                return [2 /*return*/];
            });
        }); });
    });
    describe('#nowMySqlDate', function () {
        it('creates a MySQL formatted datetime string of the current time', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var mysql, now1, now2;
            return tslib_1.__generator(this, function (_a) {
                mysql = MySqlDate_1.MySqlDate.nowMySqlDate();
                assert.equal(mysql.length, 19);
                assert.notEqual(mysql, '0000-00-00 00:00:00');
                now1 = new Date().toTimeString();
                now2 = MySqlDate_1.MySqlDate.toJsDate(mysql).toTimeString();
                assert.equal(now1, now2);
                return [2 /*return*/];
            });
        }); });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTXlTcWxEYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJNeVNxbERhdGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaUJBNENHOzs7QUE1Q0gseUNBQXdDO0FBQ3hDLCtCQUFpQztBQUVqQyxRQUFRLENBQUMsV0FBVyxFQUFFO0lBQ2xCLFFBQVEsQ0FBQyxXQUFXLEVBQUU7UUFDbEIsRUFBRSxDQUFDLGdFQUFnRSxFQUFFOzs7Z0JBQzNELEtBQUssR0FBRyxxQkFBUyxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2dCQUN4RCxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO2dCQUV4RCxLQUFLLEdBQUcscUJBQVMsQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsQ0FBQztnQkFDeEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztnQkFFeEQsS0FBSyxHQUFHLHFCQUFTLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLENBQUM7Z0JBQ3hELE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUFFLDBCQUEwQixDQUFDLENBQUM7OzthQUNqRSxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxjQUFjLEVBQUU7UUFDckIsRUFBRSxDQUFDLGdFQUFnRSxFQUFFOzs7Z0JBQzNELE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDakQsTUFBTSxHQUFHLHFCQUFTLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUM5QyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO2dCQUV0QyxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ2pELE1BQU0sR0FBRyxxQkFBUyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDOUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUscUJBQXFCLENBQUMsQ0FBQztnQkFFdEMsT0FBTyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxNQUFNLEdBQUcscUJBQVMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzlDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLHFCQUFxQixDQUFDLENBQUM7OzthQUMvQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxlQUFlLEVBQUU7UUFDdEIsRUFBRSxDQUFDLCtEQUErRCxFQUFFOzs7Z0JBQzFELEtBQUssR0FBRyxxQkFBUyxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUN2QyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQy9CLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLHFCQUFxQixDQUFDLENBQUM7Z0JBRXhDLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUNqQyxJQUFJLEdBQUcscUJBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQ3RELE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDOzs7YUFDNUIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9