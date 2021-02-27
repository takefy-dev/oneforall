# mysql-date.js

An easy to use utility for converting to and from MySQL formatted date-time strings and JS Date objects.
It is written in [TypeScript](https://www.typescriptlang.org/).

By [Joe Fallon](http://blog.joefallon.net)

http-statuses has the following features:

*   Full suite of unit tests
*   Can be fully understood in just a few moments
*   Written in TypeScript

## Installation

The easiest way to install mysql-date is with npm. 

```
npm install @joefallon/mysql-date --save
```

## Usage

```typescript
import MySqlDate from 'mysql-date';

MySqlDate.toJsDate('2012-12-12 12:12:12'); //--> '2012-12-12T20:12:12.000Z'

const jsDate = new Date(2012, 12 - 1, 12, 12, 12, 12);
const mysql  = MySqlDate.toMySqlDate(jsDate); //--> '2012-12-12 12:12:12'

MySqlDate.nowMySqlDate(); //--> 2017-12-21 15:30:33
```