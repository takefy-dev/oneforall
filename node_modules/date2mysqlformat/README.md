# Date2MysqlFormat

## Usage
`npm install date2mysqlformat --save`

```
const Date2MysqlFormat = require('date2mysqlformat');
```

### Date2MysqlFormat.dateOnly(date)
```
let now = new Date(); // Date instance  
let nowMysqlFormat = Date2MysqlFormat.dateOnly(now) // String => 2016-10-30 (YYYY-MM-DD)
```

### Date2MysqlFormat.dateAndTime(date)
```
let now = new Date(); // Date instance  
let nowMysqlFormat = Date2MysqlFormat.dateAndTime(now) // String => 2016-10-30 15:58:53 (YYYY-MM-DD HH:MM:SS)
```