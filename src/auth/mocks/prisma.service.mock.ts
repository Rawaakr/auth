import { userMock } from "./user.mock";

export const PrismaServiceMock = {
    user : {
        findUnique : jest.fn(),
        create : jest.fn().mockResolvedValue({"data" : "User successfully created"}),
    }
}