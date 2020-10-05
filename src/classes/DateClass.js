//
//
// Date global Class Expansion
// version 1.1.0
//
// Features:
// - Convert Days to Miliseconds
// - Get sunday Date of the current week
// - Get monday Date of the current week
//

module.exports = class Cal extends Date {
  constructor() {
    super();
  }
  result = null;

  // Days convertions
  Days = Object.freeze({
    toMillis(days = Number) {
      return 60 * 60 * 24 * days * 1000;
    },
  });

  // Sunday getter
  get sunday() {
    let nowDay = this.getUTCDay();
    let nowISO = this.toISOString();
    let now = this.valueOf();

    // If today is Sunday - return
    if (nowDay === 0) {
      this.result = nowISO.split("T")[0] + "T23:59:59.000Z";
      return this;

      // Else get the diffrence in miliseconds and add today
    } else {
      let getSunday = (7 - nowDay) * this.Days.toMillis(1) + now;
      this.result =
        new Date(getSunday).toISOString().split("T")[0] + "T23:59:59.000Z";
      return this;
    }
  }

  // Monday getter
  get monday() {
    let nowDay = this.getUTCDay();
    let now = this.valueOf();

    // If today is day 0 (Sunday) - substract 6 days
    if (nowDay === 0) {
      let getMonday = this.valueOf() - this.Days.toMillis(6);
      this.result =
        new Date(getMonday).toISOString().split("T")[0] + "T00:00:00.000Z";
      return this;

      // Else substract difference from today
    } else {
      let getMonday = new Date(now).valueOf() - this.Days.toMillis(nowDay - 1);
      this.result =
        new Date(getMonday).toISOString().split("T")[0] + "T00:00:00.000Z";
      return this;
    }
  }

  // Get end results
  get() {
    return this.result;
  }
};
