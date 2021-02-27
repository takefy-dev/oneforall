const gdate = {
  second: 1000,
  minute: 60000,
  hour: 3600000,
  day: 86400000,
  month: 2592000000,
  year: 946080000000,

  names: [
    'second',
    'minute',
    'hour',
    'day',
    'month',
    'year'
  ],

  advance: function( date = new Date() ) {
    return {
      by: ( distance = 0 ) => {
        return new Date(date.getTime() + distance)
      }
    }
  },

  get: function( unit = 1 ) {
    return {
      between: ( date1, date2 = new Date() ) => {
        let distance = Math.abs(date2.getTime() - date1.getTime());
        return distance / unit;
      }
    }
  },

  getWhole: function( unit = 1 ) {
    return {
      between: ( date1, date2 = new Date() ) => {
        let distance = Math.abs(date2.getTime() - date1.getTime());
        return Math.floor(distance / unit);
      }
    }
  },

  is: function( test = new Date() ) {
    return {
      after: ( ref = new Date() ) => {
        return test.getTime() > ref.getTime();
      },
      before: ( ref = new Date() ) => {
        return test.getTime() < ref.getTime();
      },
      between: ( ref1, ref2 = new Date() ) => {
        let small = Math.min(ref1.getTime(), ref2.getTime());
        let big = Math.max(ref1.getTime(), ref2.getTime());
        let testDist = test.getTime() - small;
        let bigDist = big - small;
        return 0 <= testDist && testDist <= bigDist;
      }
    }
  },

  createYYYYMMDD: function(date = new Date() ) {
    let year = String(date.getFullYear());
    let month = String(date.getMonth() + 1);
    let day = String(date.getDate());
    while(year.length < 4) year = `0${year}`;
    while(month.length < 2) month = `0${month}`;
    while(day.length < 2) day = `0${day}`;
    return [year, month, day].join('/');
  },

  getRelativeDistance: function(date1, date2 = new Date() ) {
    let mSeconds = Math.abs(date1.getTime() - date2.getTime());
    let units = gdate.names.map(name => gdate[name])
    for (let i = 0; i < units.length; i++) {
      let limit = units[i + 1]
      let unit = units[i];
      let name = gdate.names[i];
      if(mSeconds < limit) {
        let amount = Math.floor(mSeconds / unit);
        return `${amount} ${name}${amount === 1 ? '' : 's'}`;
      }
    }
    return `${gdate.getApproximate(gdate.year, mSeconds)} years`;
  }
}

module.exports = gdate;
