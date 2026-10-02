import { BffContainer, StartedBffContainer } from '../basic/onecx-bff';
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak';
export declare class WorkspaceBffContainer extends BffContainer {
    constructor(image: string, keycloakContainer: StartedOnecxKeycloakContainer);
}
export declare class StartedWorkspaceBffContainer extends StartedBffContainer {
}
