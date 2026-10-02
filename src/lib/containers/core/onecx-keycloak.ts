import { AbstractStartedContainer, GenericContainer, StartedTestContainer, Wait } from 'testcontainers'
import * as fs from 'fs'
import * as path from 'path'
import { StartedOnecxPostgresContainer } from './onecx-postgres'
import { HealthCheck } from 'testcontainers/build/types'
import { HealthCheckableContainer } from '../../models/interfaces/health-checkable-container.interface'
import { HealthCheckExecutor } from '../../models/interfaces/health-check-executor.interface'
import { HttpHealthCheckExecutor, SkipHealthCheckExecutor } from '../../utils/health-check-executor'
import { PlatformConfig } from 'src/lib/models'

// Native Keycloak HTTPS on 8443 alongside the existing 8080 http listener, so browser auth calls
// from keycloak-js are not blocked as mixed content by the https shell-ui origin. Self-signed, test-only.
const KEYCLOAK_TLS_CERT = `-----BEGIN CERTIFICATE-----
MIIDMzCCAhugAwIBAgIUSzy3wSzd8lVOvQiXk3ptAI4qQXMwDQYJKoZIhvcNAQEL
BQAwFzEVMBMGA1UEAwwMa2V5Y2xvYWstYXBwMB4XDTI2MTAwMTEyMjUxNVoXDTM2
MDkyODEyMjUxNVowFzEVMBMGA1UEAwwMa2V5Y2xvYWstYXBwMIIBIjANBgkqhkiG
9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6CLKA64jRF4MCWc8i4emb1ILxdWePvHEiT+d
j4IP7Ub115KMxNwlMXCOLvMEloHr0sPKVe7QeFiQmqjxI2GiDsgPGE3IWPSZPxBF
9ttBd2ckTvF4kFKA8NvM0d/1y4n8iQ3BH7raf1SmoyOVHeS0Y24PMAwtLESEwBUT
3gHKhWD/T0HKbTHhB2eQfj8+pLi57QruNw4vOEwmzD9DmXMQB2Qse+QgsQLy5wex
uKTL0lqLnSc9bXpFYFKg5/wv/bVg+NRbrH2U1HzSamx1l9d9yFfk1lweB3hKRg6v
nuy8JWCfMxFAQ4KzC5mGrLLYezcStMhKSM1dzOnoacm9epQTxwIDAQABo3cwdTAd
BgNVHQ4EFgQUmrKzs30vz1+tPYzujg+u+ouwUXcwHwYDVR0jBBgwFoAUmrKzs30v
z1+tPYzujg+u+ouwUXcwDwYDVR0TAQH/BAUwAwEB/zAiBgNVHREEGzAZggxrZXlj
bG9hay1hcHCCCWxvY2FsaG9zdDANBgkqhkiG9w0BAQsFAAOCAQEAs00FQhEwCFcq
ccMhtp1IKuXoHqR/cFnkrw+80hRIXxBWeYs/Z0vaptpUeiYo6TxummoADL7hQ0Ri
TkXPN0tCJHpa1UaovwWKL8pddIglCUltPEQZ3aZTk7jqaVQ4JBzF8P6yDIIBkb7t
8k7iHVU1b7wG+EHkRaZIE0JsgLvd3o4Mcnq98x9gA9N2VaPjFnX5IIJoHaBxbit/
jtHflIgZ1/vAwNe/8LckiBT//PTwBIeR+jP1ylEACXSLcfW9z75XBGc+cm9DZZ39
pKClHdPO5YQMncQLNhBFxhzoyg8h3tLaBJ7oE3J2ApiVWH8biUsuNHmenuD8ZjNP
rIW2krWJqA==
-----END CERTIFICATE-----
`

const KEYCLOAK_TLS_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDoIsoDriNEXgwJ
ZzyLh6ZvUgvF1Z4+8cSJP52Pgg/tRvXXkozE3CUxcI4u8wSWgevSw8pV7tB4WJCa
qPEjYaIOyA8YTchY9Jk/EEX220F3ZyRO8XiQUoDw28zR3/XLifyJDcEfutp/VKaj
I5Ud5LRjbg8wDC0sRITAFRPeAcqFYP9PQcptMeEHZ5B+Pz6kuLntCu43Di84TCbM
P0OZcxAHZCx75CCxAvLnB7G4pMvSWoudJz1tekVgUqDn/C/9tWD41FusfZTUfNJq
bHWX133IV+TWXB4HeEpGDq+e7LwlYJ8zEUBDgrMLmYassth7NxK0yEpIzV3M6ehp
yb16lBPHAgMBAAECggEAJ2Qn5aH6KBLRdhMHqiG1s3Q3vTV3qfS6xhN+eCi47Sm6
c/9RVeKJiS8xYXQpliSr0NMalaR1ycY1m5kJeliJ+HooXZZtZfLzwkjPpokkPc/J
0H+XVt45NSYHRqH7grOCn/suh2TcyPijYlGabz0tAyZc+2lFjRp/cFzjRywEosc1
Jk3yaBMCyub+6JtkAeY5URhdMNu17QBFeRDIDA10SxsDsANCEKmMVDfGl2sTNe/h
yMCHKalY6wJ1EVRLR0QD4b6rehsuf/syAce8BjzHa6CJAd2fRC41qfky8gxYOtLS
la45H9AcHyxFy+3omk1YugSjSGZnkqf9pSOv44MMoQKBgQD7NFHdI6FMG7HdfmpP
tnw6t9BLdVx+uGiXmHdP+YsFQrn7/QYaxE9lPpjQmsYKzHIbWS8qX24sKlHQUw5y
yx0QIwqbbledq49tQM3DT4kv9oIpyU7THUnEJRXFds+DKOalez6QjNvfDWPbOHih
HPH7toQynfbtH0rh5OH9ZNqO8QKBgQDskUc/HwnCbqwyTm+/mIeDNLre8pEZSoCK
ovuDRSzLGzvuRI9i/oznXtB2pZ+2S7N0O7iK490gFefEjCZgRyrsc9myyBDpY/TU
q27SAQTbScpj9X0MoOZQuCUFnQAkfrg73VOCEKEqs3TKOfjIVxyquVw1wMJp7p2F
su/IkxE+NwKBgBnzE6nWbmkgS0VoM688WKTwLBI/c2ibwCI428plKtlGRVQklSba
tKDu0HZsJp0i9X6hvd+QsB7b2Eu+6LUvCjeKhyP7SA2/lTdiBF9yredIfbW3V+8z
DVW3xwH4/gK8jOb3TkU8Z9Io3fHdaYirJswr1IguDT39h4zCSh4U9wbhAoGAYZdd
KPEI+ajmaKpq90NZRAtQvACdUy2k8Yxi7bhvzioiAx1Nea1BO4Glxgx1YqLAGUc5
zjJKWp4uyqp2emlhj8ILIPHf6ChQLBu8z+2Tr1M1px7yw27tFIei3jnygRu1rRyV
AqcRlagKmhJoS12EefmVzKcEjObfHPTAbqIdDukCgYBtk73qhDy+/rpeK3NHElpR
d5yEccO2oYlIpqjCZOBv83Zh/dk8JQvmGzRkkdvlguxjG1aFi8IOiu8W1TqT7gM5
a7j9Xw69ArG285cji2TdQpUcbWpOoq8pfhM/WEoTuYwnJgsA0/jLLuKG3yQSR1qc
sFdBh7up6jXYzu+4dZ1dKg==
-----END PRIVATE KEY-----
`

interface OnecxEnvironment {
  realm: string
  adminRealm: string
  adminUsername: string
  adminPassword: string
  keycloakDatabaseUsername: string
  keycloakDatabasePassword: string
  keycloakDatabase: string
  keycloakHostname: string
  port: number
}

const onecxEnvironmentInit: OnecxEnvironment = {
  realm: 'onecx',
  adminRealm: 'master',
  adminUsername: 'admin',
  adminPassword: 'admin',
  keycloakDatabaseUsername: 'keycloak',
  keycloakDatabasePassword: 'keycloak',
  keycloakDatabase: 'keycloak',
  keycloakHostname: 'keycloak-app',
  port: 8080,
}

export class OnecxKeycloakContainer extends GenericContainer {
  private onecxEnvironment: OnecxEnvironment = onecxEnvironmentInit

  private initDefaultRealms: string[] = []

  private initRealmPath = path.resolve(__dirname, '../../../assets/keycloak')

  protected loggingEnabled = false

  protected logFilePath?: string

  constructor(
    image: string,
    private readonly databaseContainer: StartedOnecxPostgresContainer,
    private readonly platformConfig: PlatformConfig
  ) {
    super(image)

    // custom config initialization based on platform config
    const { realm, realmPath } = this.platformConfig.config ?? {}
    if (realm) this.withRealm(realm)
    if (realmPath) this.withDefaultPath(realmPath)

    this.withCommand(['start-dev', '--import-realm']).withNetworkAliases('keycloak-app').withStartupTimeout(120_000)
  }

  private setDefaultHealthCheck(realm: string, port: number): HealthCheck {
    return {
      test: ['CMD-SHELL', `timeout 5 bash -c 'cat < /dev/null > /dev/tcp/localhost/${port}' || exit 1`],
      interval: 10_000,
      timeout: 5_000,
      retries: 10,
    }
  }

  withRealm(realm: string): this {
    this.onecxEnvironment.realm = realm
    return this
  }

  withAdminUsername(adminUsername: string): this {
    this.onecxEnvironment.adminUsername = adminUsername
    return this
  }

  withAdminPassword(adminPassword: string): this {
    this.onecxEnvironment.adminPassword = adminPassword
    return this
  }

  withKeycloakUsername(keycloakDatabaseUsername: string): this {
    this.onecxEnvironment.keycloakDatabaseUsername = keycloakDatabaseUsername
    return this
  }

  withKeycloakPassword(keycloakDatabasePassword: string): this {
    this.onecxEnvironment.keycloakDatabasePassword = keycloakDatabasePassword
    return this
  }

  withEnvironmentHostname(hostname: string): this {
    this.onecxEnvironment.keycloakHostname = hostname
    return this
  }

  withInitPath(path: string) {
    this.initDefaultRealms.push(path)
    return this
  }
  withDefaultPath(path: string) {
    this.initRealmPath = path
    return this
  }

  withKeycloakDatabase(keycloakDatabase: string): this {
    this.onecxEnvironment.keycloakDatabase = keycloakDatabase
    return this
  }

  withAdminRealm(adminRealm: string): this {
    this.onecxEnvironment.adminRealm = adminRealm
    return this
  }

  withPort(port: number): this {
    this.onecxEnvironment.port = port
    return this
  }

  withLoggingEnabled(log: boolean): this {
    this.loggingEnabled = log
    return this
  }

  withLogFilePath(filePath: string): this {
    this.logFilePath = filePath
    return this
  }

  protected getFormattedLogLine(line: string | Buffer): string {
    const timestamp = new Date().toISOString()
    const text = typeof line === 'string' ? line : line.toString()
    return `[${timestamp}] ${text}`
  }

  protected writeLogToFile(line: string | Buffer, logFilePath: string): void {
    const formatted = this.getFormattedLogLine(line)
    fs.appendFileSync(logFilePath, `${formatted}\n`)
  }

  getRealm(): string {
    return this.onecxEnvironment.realm
  }

  getAdminRealm(): string {
    return this.onecxEnvironment.adminRealm
  }

  getAdminUsername(): string {
    return this.onecxEnvironment.adminUsername
  }

  getAdminPassword(): string {
    return this.onecxEnvironment.adminPassword
  }

  getKeycloakDatabaseUsername(): string {
    return this.onecxEnvironment.keycloakDatabaseUsername
  }

  getKeycloakDatabasePassword(): string {
    return this.onecxEnvironment.keycloakDatabasePassword
  }

  getEnvironmentHostname(): string {
    return this.onecxEnvironment.keycloakHostname
  }

  getPort(): number {
    return this.onecxEnvironment.port
  }

  getKeycloakDatabase() {
    return this.onecxEnvironment.keycloakDatabase
  }

  override async start(): Promise<StartedOnecxKeycloakContainer> {
    this.databaseContainer.createUserAndDatabase(
      this.onecxEnvironment.keycloakDatabaseUsername,
      this.onecxEnvironment.keycloakDatabasePassword
    )

    // Apply the default health check explicitly if it has not been set.
    // This ensures the healthcheck is correctly registered before container startup
    if (!this.healthCheck) {
      const defaultHealthCheck: HealthCheck = this.setDefaultHealthCheck(
        this.onecxEnvironment.realm,
        this.onecxEnvironment.port
      )
      this.withHealthCheck(defaultHealthCheck)
    }

    // Spread existing environment variables to preserve previously set values.
    // This ensures that calling withEnvironment() does not override earlier configurations.
    this.withEnvironment({
      ...this.environment,
      KEYCLOAK_ADMIN: this.onecxEnvironment.adminUsername,
      KEYCLOAK_ADMIN_PASSWORD: this.onecxEnvironment.adminPassword,
      KC_DB: this.databaseContainer.getPostgresDatabase(),
      KC_DB_POOL_INITIAL_SIZE: '1',
      KC_DB_POOL_MAX_SIZE: '5',
      KC_DB_POOL_MIN_SIZE: '2',
      KC_DB_URL_DATABASE: this.onecxEnvironment.keycloakDatabase,
      KC_DB_URL_HOST: this.databaseContainer.getNetworkAliases()[0],
      KC_DB_USERNAME: this.onecxEnvironment.keycloakDatabaseUsername,
      KC_DB_PASSWORD: this.onecxEnvironment.keycloakDatabasePassword,
      // KC_HOSTNAME pins the issuer (`iss`) to one https identity, since this container is
      // reachable on both the plain-http and https ports. BACKCHANNEL_DYNAMIC still lets
      // backend services reach discovery/JWKS over plain http.
      KC_HOSTNAME: `https://${this.onecxEnvironment.keycloakHostname}:8443`,
      KC_HOSTNAME_BACKCHANNEL_DYNAMIC: 'true',
      KC_HTTP_ENABLED: 'true',
      KC_HTTP_PORT: `${this.onecxEnvironment.port}`,
      KC_HEALTH_ENABLED: 'true',
      KC_HTTPS_CERTIFICATE_FILE: '/opt/keycloak/conf/tls.crt',
      KC_HTTPS_CERTIFICATE_KEY_FILE: '/opt/keycloak/conf/tls.key',
      KC_HTTPS_PORT: '8443',
    })

    this.withCopyContentToContainer([
      { content: KEYCLOAK_TLS_CERT, target: '/opt/keycloak/conf/tls.crt', mode: 0o644 },
      { content: KEYCLOAK_TLS_KEY, target: '/opt/keycloak/conf/tls.key', mode: 0o644 },
    ])

    if (this.logFilePath) {
      this.withLogConsumer((stream) => {
        stream.on('data', (line) => this.writeLogToFile(line, this.logFilePath!))
        stream.on('err', (line) => this.writeLogToFile(line, this.logFilePath!))
      })
    }
    this.withInitPath(this.initRealmPath)

    for (const p of this.initDefaultRealms) {
      this.withCopyDirectoriesToContainer([
        {
          source: path.resolve(p),
          target: '/opt/keycloak/data/import',
        },
      ])
    }

    this.withExposedPorts(this.onecxEnvironment.port, 8443).withWaitStrategy(
      Wait.forAll([Wait.forHealthCheck(), Wait.forListeningPorts()])
    )

    return new StartedOnecxKeycloakContainer(
      await super.start(),
      this.onecxEnvironment,
      this.networkAliases,
      this.healthCheck || this.setDefaultHealthCheck(this.onecxEnvironment.realm, this.onecxEnvironment.port)
    )
  }
}

export class StartedOnecxKeycloakContainer extends AbstractStartedContainer implements HealthCheckableContainer {
  constructor(
    startedTestContainer: StartedTestContainer,
    private readonly onecxKeycloakEnvironment: OnecxEnvironment,
    private readonly networkAliases: string[],
    private readonly healthCheck: HealthCheck
  ) {
    super(startedTestContainer)
  }

  /**
   * Creates Quarkus-specific health check strategy
   * Uses URL from health check or falls back to default
   */
  getHealthCheckExecutor(): HealthCheckExecutor {
    const mappedPort = this.getMappedPort(this.getPort())
    const keycloakUrl = `http://localhost:${mappedPort}/realms/${this.getRealm()}/.well-known/openid-configuration`
    // Build URL from health check configuration
    const endpoint = keycloakUrl

    // If no valid URL can be extracted, skip health check
    if (!endpoint) {
      return new SkipHealthCheckExecutor('Keycloak Container - No valid health check URL could be extracted')
    }

    // Use timeout from health check if available, otherwise default
    const timeout = this.healthCheck?.timeout || 8000

    return new HttpHealthCheckExecutor(endpoint, timeout, [200, 503])
  }

  getRealm(): string {
    return this.onecxKeycloakEnvironment.realm
  }

  getAdminRealm(): string {
    return this.onecxKeycloakEnvironment.adminRealm
  }

  getAdminUsername(): string {
    return this.onecxKeycloakEnvironment.adminUsername
  }

  getAdminPassword(): string {
    return this.onecxKeycloakEnvironment.adminPassword
  }

  getKeycloakDatabaseUsername(): string {
    return this.onecxKeycloakEnvironment.keycloakDatabaseUsername
  }

  getKeycloakDatabasePassword(): string {
    return this.onecxKeycloakEnvironment.keycloakDatabasePassword
  }

  getEnvironmentHostname(): string {
    return this.onecxKeycloakEnvironment.keycloakHostname
  }

  getKeycloakDatabase(): string {
    return this.onecxKeycloakEnvironment.keycloakDatabase
  }

  getPort(): number {
    return this.onecxKeycloakEnvironment.port
  }

  getNetworkAliases(): string[] {
    return this.networkAliases
  }
}
