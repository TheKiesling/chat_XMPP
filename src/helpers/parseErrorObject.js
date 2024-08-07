const parseErrorObject = (errObj) => {
    const errorsObjParsed = {};
    errObj.inner?.forEach((error) => {
      errorsObjParsed[error.path] = error.errors[0];
    });
    return errorsObjParsed;
  };
  
export default parseErrorObject;
  