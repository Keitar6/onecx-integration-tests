"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNetworkAlias = validateNetworkAlias;
const SAFE_NETWORK_ALIAS = /^[a-zA-Z0-9._-]+$/;
function validateNetworkAlias(networkAlias, containerType = 'container') {
    if (!SAFE_NETWORK_ALIAS.test(networkAlias) || networkAlias.includes('..')) {
        throw new Error(`${containerType} network alias is not a safe name: ${networkAlias}`);
    }
}
//# sourceMappingURL=network-alias.utils.js.map