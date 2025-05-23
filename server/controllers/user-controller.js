const UserService = require('../services/user-service')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error')

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('Помилка під час валідації', errors.array()))
            }
            const {name, email, password} = req.body
            const userData = await UserService.registration(name, email, password) 
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true})
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const userData = await UserService.login(email, password) 
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true})
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await UserService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (error) {
            next(error)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await UserService.refresh(refreshToken) 
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true})
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new UserController()