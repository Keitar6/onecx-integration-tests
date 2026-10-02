import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak';
import { StartedSvcContainer, SvcContainer } from '../basic/onecx-svc';
export declare class IamKcContainer extends SvcContainer {
    constructor(image: string, keycloakContainer: StartedOnecxKeycloakContainer);
}
export declare class StartedIamKcSvcContainer extends StartedSvcContainer {
}
