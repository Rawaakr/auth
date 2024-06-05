export class AuthServiceMock {
        signup = jest.fn().mockResolvedValue({"data" : "User successfully created"})
        signin = jest.fn()
        resetPassworDemand = jest.fn()
        uresetPasswordConfirmation = jest.fn()
        deleteAccount = jest.fn()
    
}