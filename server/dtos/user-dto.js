module.exports = class UserDto {
    name
    email
    id
    role

    constructor(model) {
        this.id = model._id
        this.name = model.name
        this.email = model.email
        this.role = model.role
    }
}