module.exports = class ApiError extends Error {
    status
    errors

    constructor(status, message, errors = []) {
        super(message)
        this.status = status
        this.errors = errors
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Not authorized')
    }

    static BadRequest(message, errors = []) {
        return new ApiError(401, message, errors)
    }
}