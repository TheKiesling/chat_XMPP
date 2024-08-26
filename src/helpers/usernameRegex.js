const usernameRegex = (username) => {

    // the regex is as follows:
    // - the username must start with 3 lowercase letters
    // - followed by 5 digits
    // - optionally followed by a hyphen and any number of alphanumeric
    // characters
    const usernamePattern = /^[a-z]{3}\d{5}(-[a-zA-Z0-9]+)?/;
  
    return usernamePattern.test(username);
};

export default usernameRegex;