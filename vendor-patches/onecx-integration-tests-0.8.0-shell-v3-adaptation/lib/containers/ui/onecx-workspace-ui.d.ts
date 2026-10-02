import { StartedUiContainer, UiContainer } from '../basic/onecx-ui';
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak';
export declare class WorkspaceUiContainer extends UiContainer {
    private keycloakContainer;
    private client_user_id;
    constructor(image: string, keycloakContainer: StartedOnecxKeycloakContainer);
    start(): Promise<StartedWorkspaceUiContainer>;
}
export declare class StartedWorkspaceUiContainer extends StartedUiContainer {
    private clientUserId;
    constructor(startedUiContainer: StartedUiContainer, clientUserId: string);
    getClientUserId(): string;
}
