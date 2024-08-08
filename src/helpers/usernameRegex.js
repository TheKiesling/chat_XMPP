const usernameRegex = (username) => {
    const usernamePattern = /^[a-z]{3}\d{5}(-[a-zA-Z0-9]+)?/;
  
    return usernamePattern.test(username);
};

export default usernameRegex;