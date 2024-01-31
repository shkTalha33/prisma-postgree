exports.onSuccess = (message,data) => {
    return {
        message,
        data
    }
}

exports.onError = (message,data) => {
   return {
    message,
    error:true,
    data
   }
}