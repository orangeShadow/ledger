module.exports =  class MongooseErrorHandler {
  handler(errors) {
    let newErrors = {};
    let errorsArr = errors.errors

    for(let k in errorsArr) {
      newErrors[k] = errorsArr[k].message;
    }

    return {
      errors:newErrors,
      message: errors.message
    }
  }
}
