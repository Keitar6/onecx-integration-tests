"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedProductStoreSvcContainer = exports.ProductStoreSvcContainer = void 0;
const onecx_svc_1 = require("../basic/onecx-svc");
class ProductStoreSvcContainer extends onecx_svc_1.SvcContainer {
    constructor(image, databaseContainer, keycloakContainer) {
        super(image, { databaseContainer, keycloakContainer });
        this.withNetworkAliases('onecx-product-store-svc')
            .withDatabaseUsername('onecx_product_store')
            .withDatabasePassword('onecx_product_store');
    }
}
exports.ProductStoreSvcContainer = ProductStoreSvcContainer;
class StartedProductStoreSvcContainer extends onecx_svc_1.StartedSvcContainer {
}
exports.StartedProductStoreSvcContainer = StartedProductStoreSvcContainer;
//# sourceMappingURL=onecx-product-store-svc.js.map