class HttpError extends Error{
    constructor(message,statusCode){
        super(message)
        message,
        this.statusCode = statusCode
    }
}

class BadRequestException extends HttpError{
    constructor(message = "errors.bad_request"){
        super(message,400)
    }
}

class UnauthorizedAccess extends HttpError{
    constructor(message ="errors.unauthorized_access"){
        super(message,401)
    }
}
class ServerError extends HttpError{
    constructor(message ="errors.server"){
        super(message,500)
    }
}

module.exports = {
    BadRequestException,
    UnauthorizedAccess,
    ServerError
}



