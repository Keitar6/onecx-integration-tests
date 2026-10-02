"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedUserProfileSvcContainer = exports.UserProfileSvcContainer = void 0;
const onecx_svc_1 = require("../basic/onecx-svc");
class UserProfileSvcContainer extends onecx_svc_1.SvcContainer {
    constructor(image, databaseContainer, keycloakContainer) {
        super(image, { databaseContainer, keycloakContainer });
        this.withNetworkAliases('onecx-user-profile-svc')
            .withDatabaseUsername('onecx_user_profile')
            .withDatabasePassword('onecx_user_profile');
    }
}
exports.UserProfileSvcContainer = UserProfileSvcContainer;
class StartedUserProfileSvcContainer extends onecx_svc_1.StartedSvcContainer {
}
exports.StartedUserProfileSvcContainer = StartedUserProfileSvcContainer;
//# sourceMappingURL=onecx-user-profile-svc.js.map