# GDATE, Mate!

`GDate` (pronounced g'date, if you like) is a light-weight extension to the native `Date` object.  `Date` has a surprising amount of functionality built in, but equally surprising is the functionality it's lacking. (seriously, checkout the code I wrote.... it's nothing mind-blowing, and feels so intuitive). The biggest barriers to using JavaScript's `Date` are un-intuitive time measurement and a lack of easy date-math functionality (like getting a date 5 days from now or checking if a time falls in a certain range).

GDate makes these much easier by adding some nice layers of abstraction and syntactic sugar, so now you don't need to know how many milliseconds are in a week to get a date 7 days from now!

`GDate` was written as an extension to it that you can import into whatever project you like as easily as possible.
It is tested (see the linked github), and open-source? still in development? If anyone would like easy open-source credits to put on a resumé, or have some ideas how to make the package more valuable or useful feel welcome to add an issue!

### Importing it into a project

Import it into your project directory from npm with the usual installation commands in terminal i.e. `npm install gdate`.

Import it into one of your ES5 files with `const gdate = require('gdate')`. Import it into one of your ES6 files with `import gdate from 'gdate'`.

### Features:

- Built-in time properties for easy reference.
  - `second`: equals 1000ms
  - `minute`: equals 60s or 60000ms
  - `hour`: equals 60m or 3600s or 360000ms
  - `day`: equals 24h or 1440m or 86400s
  - `week`: equals 7d
  - `month`: these are set at 30 days for estimation
  - `year`: equals 365d

Each of these stores the equivalent amount of milliseconds as a number (which is what `Date` uses under the hood). You can use them like this:

```JavaScript
gdate.second // 1000
gdate.day // 8640000
```

Or, if you're doing a lot of time math, you can use destructuring to make them easier use (this is what will be used for all of the following examples) :

``` JavaScript
 const { second, minute, hour, day, week, month, year } = gdate;

 console.log( minute ) // 60000
```

- `advance( Date ).by( distance )`: Get new `Date` instances a set amount of time away. Positive values get future `Date`s, negative values get past `Date`s.

  ```JavaScript

    const now = new Date();
    const tomorrow = gdate.advance( now ).by( 1 * day );
    const yesterday = gdate.advance().by( -1 * day );
  ```

If the `Date` argument is omitted, it defaults to the current moment. If the `distance` argument is omitted, it returns a shallow copy of whatever `Date` was passed in.

- `get( unit ).between( ref1, ref2 )`: Get the number of units between 2 dates (order agnostic).

```JavaScript
  const now = new Date();
  const tomorrow = gdate.advance( now ).by( 1 * gdate.day );

  gdate.get( hour ).between( now, tomorrow ); // 24
  gdate.get( hour ).between( tomorrow ); // 24
```

If the `ref2` argument is omitted, it defaults to the current moment. If the `unit` argument is omitted, it defaults to milliseconds.

- `getWhole( unit ).between( ref1, ref2 )`: returns the whole number of units that a given number of milliseconds corresponds to, rounded down (order agnostic).

```JavaScript
  const now = new Date();
  const ninetyDaysFromNow = gdate.advance( now ).by( 90 * gdate.day );

  gdate.getWhole( week ).between( now, ninetyDaysFromNow ) // 12
```

If the `ref2` argument is omitted, it defaults to the current moment. If the `unit` argument is omitted, it defaults to milliseconds.

- `is( Date ).between( ref1, ref2)`: returns `true` if a given `Date` is between two reference dates, inclusively and order agnostically. Otherwise, `false`

```JavaScript
  const now = new Date();
  const hourFromNow = gdate.advance( now ).by(1 * gdate.hour );
  const tomorrow = gdate.advance( now ).by( 1 * gdate.day );

  gdate.is( hourFromNow ).between( now, tomorrow ) // true
  gdate.is( hourFromNow ).between( tomorrow ) // true
  gdate.is( now ).between( tomorrow, hourFromNow ) // false
  gdate.is().between( tomorrow, hourFromNow ) // false
```

If the `ref2` or the `Date` arguments are omitted, they default to the current moment.

- `is( Date ).before( ref )`: return `true` if a date is strictly before a reference. else `false`

```JavaScript
  const now = new Date();
  const tomorrow = gdate.advance( now ).by( 1 * gdate.day );

  gdate.is( now ).before( tomorrow ) // true
  gdate.is( tomorrow ).before( now ) // false
```

If the `ref` or the `Date` arguments are omitted, they default to the current moment.

- `is( Date ).after( ref )`: return `true` if a date is strictly after a reference. else `false`

```JavaScript
  const now = new Date();
  const tomorrow = gdate.advance( now ).by( 1 * gdate.day );

  gdate.is( now ).after( tomorrow ) // false
  gdate.is( tomorrow ).after( now ) // true
```

If the `ref` or the `Date` arguments are omitted, they default to the current moment.

- `getYYYYMMDD( Date )`: converts the date into a string of the form `YYYY/MM/DD`

```JavaScript
  const epoch = new Date(0)

  gdate.getYYYYMMDD(epoch) // "1970/01/01"
```

If the `Date` argument is omitted, it defaults to the current moment.

`getRelativeDistance( Date1, Date2 )`: Returns a string of the distance between 2 `Date`s in the largest whole unit of time (with correct pluralization). If 2 arguments are provided, order is agnostic. If the second argument is excluded, it creates a timestamp from the current moment. Great for Reddit-Style Time-stamps.

```JavaScript
  const now = new Date();
  const tomorrow = gdate.advance( now ).by( 1 * day );
  const threeYearsFromNow = gdate.advanceDateBy(1100 * day  , now);

  gdate.getRelativeDistance(now, tomorrow) // "1 day"
  gdate.getRelativeDistance(year) // "3 years"
```

If the `Date2` argument is omitted, it defaults to the current moment.
