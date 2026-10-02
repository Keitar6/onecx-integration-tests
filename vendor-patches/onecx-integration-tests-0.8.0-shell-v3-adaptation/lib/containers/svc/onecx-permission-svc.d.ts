import { SvcContainer, StartedSvcContainer } from '../basic/onecx-svc';
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak';
import { StartedOnecxPostgresContainer } from '../core/onecx-postgres';
export declare class PermissionSvcContainer extends SvcContainer {
    constructor(image: string, databaseContainer: StartedOnecxPostgresContainer, keycloakContainer: StartedOnecxKeycloakContainer, tenantSvcContainer: StartedSvcContainer);
}
export declare class StartedPermissionSvcContainer extends StartedSvcContainer {
}
