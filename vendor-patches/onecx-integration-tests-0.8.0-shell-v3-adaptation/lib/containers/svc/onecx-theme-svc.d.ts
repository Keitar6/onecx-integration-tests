import { SvcContainer, StartedSvcContainer } from '../basic/onecx-svc';
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak';
import { StartedOnecxPostgresContainer } from '../core/onecx-postgres';
export declare class ThemeSvcContainer extends SvcContainer {
    constructor(image: string, databaseContainer: StartedOnecxPostgresContainer, keycloakContainer: StartedOnecxKeycloakContainer);
}
export declare class StartedThemeSvcContainer extends StartedSvcContainer {
}
