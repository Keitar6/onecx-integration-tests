import { StartedUiContainer, UiContainer } from '../basic/onecx-ui';
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak';
export declare class ShellUiContainer extends UiContainer {
    private keycloakContainer;
    private client_user_id;
    constructor(image: string, keycloakContainer: StartedOnecxKeycloakContainer);
    start(): Promise<StartedShellUiContainer>;
}
export declare class StartedShellUiContainer extends StartedUiContainer {
    private clientUserId;
    constructor(startedUiContainer: StartedUiContainer, clientUserId: string);
    getClientUserId(): string;
}
