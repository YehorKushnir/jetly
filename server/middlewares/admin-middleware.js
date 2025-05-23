const ApiError = require('../exceptions/api-error')
const tokenService = require('../services/token-service')

module.exports = function(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError())
        }

        const accessToken = authorizationHeader.split(' ')[1]
        if (!accessToken) {
            return next(ApiError.UnauthorizedError())
        }

        const userData = tokenService.validateAccessToken(accessToken)
        if (!userData) {
            return next(ApiError.UnauthorizedError())
        }

        if (userData.role !== 'admin') {
            return next(ApiError.BadRequest('You do not have permission to use this route'))
        }

        req.user = userData
        next()
    } catch (error) {
        return next(ApiError.UnauthorizedError())
    }
}