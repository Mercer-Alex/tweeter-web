"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const DaoService_1 = require("./DaoService");
class UserService extends DaoService_1.DaoService {
    getUser(authToken, alias) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.authTokenDao.checkAuthToken(authToken))) {
                throw new Error('Invalid auth token');
            }
            const getUser = yield this.userDao.getUser(alias);
            return getUser;
        });
    }
    ;
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const authenticate = yield this.authDao.authenticate(username, password);
            if (authenticate) {
                const user = yield this.userDao.getUser(username);
                if (user === undefined) {
                    throw new Error("User is undefined, invalid username");
                }
                const authToken = tweeter_shared_1.AuthToken.Generate();
                yield this.authTokenDao.putAuthToken(authToken, username);
                return [user, authToken];
            }
            throw new Error("Could not login");
        });
    }
    ;
    register(username, password, firstName, lastName, userImageBytes) {
        return __awaiter(this, void 0, void 0, function* () {
            const imageUrl = yield this.s3Dao.putImage(username, userImageBytes);
            const authToken = tweeter_shared_1.AuthToken.Generate();
            yield this.authTokenDao.putAuthToken(authToken, username);
            yield this.authDao.putAuthentication(username, password);
            const user = new tweeter_shared_1.User(firstName, lastName, username, imageUrl);
            yield this.userDao.putUser(user, password);
            if (user === null) {
                throw new Error("Invalid registration");
            }
            return [user, authToken];
        });
    }
    ;
    logout(authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authTokenDao.deleteAuthToken(authToken);
        });
    }
    ;
}
exports.UserService = UserService;
