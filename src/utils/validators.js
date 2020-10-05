// Import localization file
const locale = require("../localization/EN");

// Is Email

const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
};

// is Phone

const isPhone = (phone) => {
  if (phone.length === 13) {
    return true;
  } else return false;
};

// Is Empty

const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

// Validation for SignUp Data
exports.validateSignupData = (data) => {
  let errors = {};

  // Email error handle
  if (isEmpty(data.email)) {
    errors.email = locale.EMPTY_INPUT;
  } else if (!isEmail(data.email)) {
    errors.email = locale.INVALID_EMAIL;
  }

  // Handle error
  if (isEmpty(data.userHandle)) {
    errors.userHhandle = locale.EMPTY_INPUT;
  }

  // Phone Number error
  if (isEmpty(data.phoneNumber) && isPhone(data.phoneNumber)) {
    errors.phoneNumber = locale.INVALID_PHONE;
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

// Validation for Login Data
exports.validateLoginData = (data) => {
  let errors = {};

  // Email error handle
  if (isEmpty(data.email)) {
    errors.email = locale.EMPTY_INPUT;
  } else if (!isEmail(data.email)) {
    errors.email = locale.INVALID_EMAIL;
  }

  // Password error handle
  if (isEmpty(data.password)) {
    errors.password = locale.EMPTY_INPUT;
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

// Validadion for adding a new Song
exports.validateSongInfo = (data) => {
  let errors = {};

  // Author
  if (isEmpty(data.author)) {
    errors.author = locale.EMPTY_INPUT;
  }

  // Key
  if (data.key.length > 3) {
    errors.key = locale.INVALID_KEY;
  }
  if (isEmpty(data.key)) {
    errors.key = locale.EMPTY_INPUT;
  }

  // Lyrics
  if (data.lyrics.length === 0) {
    errors.lyrics = locale.EMPTY_INPUT;
  }

  // Chords
  if (isEmpty(data.chords)) {
    errors.chords = locale.EMPTY_INPUT;
  }

  // Song Name
  if (isEmpty(data.songName)) {
    errors.songName = locale.IS_REQUIRED;
  }

  // BPM
  if (isEmpty(data.bpm)) {
    errors.bpm = locale.IS_REQUIRED;
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

// Validation for new Events
exports.validateEvent = (data) => {
  let errors = {};

  // Empty
  if (!data[0]) {
    errors.events = locale.EMPTY_INPUT;
  }

  // Map Events
  data.map((event) => {
    // Time
    if (isEmpty(event.time)) {
      errors.time = locale.EMPTY_INPUT;
    }
    // Duration
    if (isEmpty(event.duration)) {
      errors.duration = locale.IS_REQUIRED;
    }
    // Name
    if (isEmpty(event.eventName)) {
      errors.eventName = locale.EMPTY_INPUT;
    }
  });
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

// Validation for new Service Plan
exports.validatePlan = (data) => {
  let errorsPlan = {};

  // Heading required
  if (isEmpty(data.heading)) {
    errorsPlan.heading = locale.EMPTY_INPUT;
  }

  // Date required
  if (isEmpty(data.date)) {
    errorsPlan.date = locale.DATE_ERROR;
  }

  // Admin required
  if (isEmpty(data.admin)) {
    errorsPlan.admin = locale.ADMIN_ERROR;
  }

  return {
    errorsPlan,
    validPlan: Object.keys(errorsPlan).length === 0 ? true : false,
  };
};
