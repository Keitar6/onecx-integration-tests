import { SvcContainer, StartedSvcContainer } from '../basic/onecx-svc';
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak';
import { StartedOnecxPostgresContainer } from '../core/onecx-postgres';
export declare class TenantSvcContainer extends SvcContainer {
    constructor(image: string, databaseContainer: StartedOnecxPostgresContainer, keycloakContainer: StartedOnecxKeycloakContainer);
}
export declare class StartedTenantSvcContainer extends StartedSvcContainer {
}
