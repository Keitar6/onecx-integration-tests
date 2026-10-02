"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedUiContainer = exports.UiContainer = void 0;
const tslib_1 = require("tslib");
const testcontainers_1 = require("testcontainers");
const fs = tslib_1.__importStar(require("fs"));
const health_check_executor_1 = require("../../utils/health-check-executor");
const wait_strategy_utils_1 = require("../../utils/wait-strategy.utils");
const DEFAULT_LOG_WAIT_MESSAGE = /start worker process/;
// LOCAL PATCH (patch-package): every UI container gets an 8443 TLS listener (reverse-proxied to
// its own plain-http port) + CORS_ENABLED, so the shell (https) can load any MFE's manifest/assets
// cross-origin without mixed-content/CORS errors. Cert is shared/self-signed and test-only; Playwright
// runs with ignoreHTTPSErrors: true so the CN/SAN mismatch per-host doesn't matter.
const UI_TLS_CERT = `-----BEGIN CERTIFICATE-----
MIIDOTCCAiGgAwIBAgIUPrGlDB8qDokADnuvmCDMmSAGUQ4wDQYJKoZIhvcNAQEL
BQAwGTEXMBUGA1UEAwwOb25lY3gtc2hlbGwtdWkwHhcNMjYxMDAxMTA0MzQxWhcN
MzYwOTI4MTA0MzQxWjAZMRcwFQYDVQQDDA5vbmVjeC1zaGVsbC11aTCCASIwDQYJ
KoZIhvcNAQEBBQADggEPADCCAQoCggEBAJ/RWFESw3zXQoxlF+2okMsMFZmhpocB
2SU/98gKHVgI8SIWkOYfs7WoetGPOyVqiAYXei+ALytJK1Rb++lDPSsqQSjq60L3
45gwT1I2brRInTMAMRhevxWr78X/ImQ5u1AEgFvib8wPhfNcqVGNSyEbbSsW9UT4
LmuRUtBR4Ema5hY7anjLRsC+6p964bliPnRD8I0DFv3oYrvPcgUz8XHfFCFgXVX1
Od1q/CjuJyB7faCc8+dN/TW9qFhW+I4PYHF5qqfFA1m0CS0AJiqHFBGvuj28ZSVg
mzMEsL5VxoKYTd+RhU4cKNK/ue17McIUfz+SnRKyoKDDlWuUXum22RkCAwEAAaN5
MHcwHQYDVR0OBBYEFLotHBQRCab7oyqNzGjMgHHtBskKMB8GA1UdIwQYMBaAFLot
HBQRCab7oyqNzGjMgHHtBskKMA8GA1UdEwEB/wQFMAMBAf8wJAYDVR0RBB0wG4IO
b25lY3gtc2hlbGwtdWmCCWxvY2FsaG9zdDANBgkqhkiG9w0BAQsFAAOCAQEAlfrh
hCl6dot8sw8NWRWl53oRRB9YMR4Q3Cl5nE/3ffOUYDFn9s3EPsMdaF2BOOmmE3TP
M1NehNYJX1UpDwpFKhP/7hpb6pXwyVH3b2ULo74zNNgTGfhtvg7PMJGlJdTat483
tzJPDYbIXLu5QkoOcCXb6Qm/+FWzGvdbmLzmUGEpriCBmif5ayPokjfVfNleN6et
vUHWjQ/21VC4yjnWQiPE47+il/LKXi1yn/i0F8+7+OqA3rjNfV0B6CPcuMyfsPt8
on+98YrqD7D4yEXM7BK+MDohKH3BF0+70lEh0ci431HpfK2xn1lOwSvLOfV/fv+S
spWXwgwfohyUxsU8hg==
-----END CERTIFICATE-----
`;
const UI_TLS_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCf0VhREsN810KM
ZRftqJDLDBWZoaaHAdklP/fICh1YCPEiFpDmH7O1qHrRjzslaogGF3ovgC8rSStU
W/vpQz0rKkEo6utC9+OYME9SNm60SJ0zADEYXr8Vq+/F/yJkObtQBIBb4m/MD4Xz
XKlRjUshG20rFvVE+C5rkVLQUeBJmuYWO2p4y0bAvuqfeuG5Yj50Q/CNAxb96GK7
z3IFM/Fx3xQhYF1V9Tndavwo7icge32gnPPnTf01vahYVviOD2BxeaqnxQNZtAkt
ACYqhxQRr7o9vGUlYJszBLC+VcaCmE3fkYVOHCjSv7ntezHCFH8/kp0SsqCgw5Vr
lF7pttkZAgMBAAECggEABlH5V+Vx0S1THqm9z0KADWOaNBPqOcMXMwurUSAjRnC+
Fn7FdrBQw1GZH9H2ARYMMI97n8bGNsRDQCgOF4y27c7TOlrF+IVEnSdl76ai7KLF
greSeXf/vwvoZNBg7A1DbNfsupWDHdMMVVI4CPdZPgMvZ0mWZAabkVnzKDVgtRBo
z8apBQYl72GWiLXZxtyUy+1u+1BU20a+LdkbihdhedALcRbE9XHRvCqVeHuLGkzo
yF1XUNI05MKkGjSrv8zf3TyDCeacic782za3xA0jy2wV29BYPXC8Uq/qYhlkSACn
GAbSDmBFl9CVhm3IihKcRZpcqVgXZvFQtHU+0+NB/QKBgQDeysY9mm3tvXS5mIEh
TCC6LYe/1Ep5pxAHrIbh/Nqm0mBO7WVCA61m/EsTOtKRO+e6+lFwFEVPtVOBP+je
kk6D82FrJTXw3pruLkXJ3+9OgzxeRnyiIjBNzFp9Gozk/+ymKVnLZfVEpUH2US7l
c/vsfvpvGQVn/QHnnYN7GBbsJQKBgQC3o539UKF1Azz2y2z5UystjRCaPPl+MJWv
36uYe6CGu7GD+UNUyYxuDmf6NYuc0pMC5nyJ9QKhmj2rDJl32N+jXW/ojBm7yf3z
ZBz28kXNv6cD95/EBXzTsXacCyAivK7By5xk9zUX4LnC0a4c9Ol/ZWMi0WzxnftA
CfpXTF5s5QKBgA8jTgb/iDqgJd86eoOtrYeY8mFZZloPvOoYke2nBaBSKRMT1E6A
+3ZE7ED5PTd7D4rH2WK5LeB1nJ/qnMMKw+T5U4Q5OgoMxhAq+rj1y0fVaPOq7GsD
0a5nlTps5Gfm78h2hNBqNBke9XVsHLiggdyW4CNOWuyu50M6k6V4hI41AoGBAJ2a
6N8dMlSwoMPWtwIMZQRFCzi0mBO7MtyshCLsB0tbDvELHsRH7iQObSKKjfXbq5xT
oBLumoGDVOXWfGglU1pruL3Gb9eBdlhLVaiDKXF5yKdZAF9Frmoo5njp+3yUnw9n
5iOpHoINtqADQQFNGJDjvP+G6Y88XQQLDDWcL3YZAoGAEQrSI1ChQWHex+KMAbme
XdT+/cAxk8rOevub7E+FOatX6x6jOET7saHzMooPLU6F4GhNka3zZSpGqxq68AwN
G7wkFLFTNJCkPqolWvLGTuTJNxRY2I93YYVFPIjVhkZ7oVT3Bp4rhvMlE84Fu1d6
pbT63RWoId4XuwiU/lWqr98=
-----END PRIVATE KEY-----
`;
function buildUiTlsServerConf(upstreamPort) {
    return `server {
  listen 8443 ssl;
  server_name _;
  ssl_certificate     /etc/nginx/certs/tls.crt;
  ssl_certificate_key /etc/nginx/certs/tls.key;
  location / {
    proxy_pass http://127.0.0.1:${upstreamPort};
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto https;
    proxy_set_header X-Forwarded-For $remote_addr;
  }
}
`;
}
class UiContainer extends testcontainers_1.GenericContainer {
    details = {
        appBaseHref: '',
        appId: '',
        productName: '',
    };
    port = 8080;
    loggingEnabled = false;
    logFilePath;
    commandHealthCheckConfig;
    healthCheckConfigs = [];
    constructor(image) {
        super(image);
    }
    withAppBaseHref(appBaseHref) {
        this.details.appBaseHref = appBaseHref;
        return this;
    }
    withAppId(appId) {
        this.details.appId = appId;
        return this;
    }
    withProductName(productName) {
        this.details.productName = productName;
        return this;
    }
    withPort(port) {
        this.port = port;
        return this;
    }
    withCommandHealthCheck(config) {
        this.commandHealthCheckConfig = config;
        return this;
    }
    withHealthChecks(configs) {
        this.healthCheckConfigs = configs;
        return this;
    }
    withLoggingEnabled(log) {
        this.loggingEnabled = log;
        return this;
    }
    withLogFilePath(filePath) {
        this.logFilePath = filePath;
        return this;
    }
    getFormattedLogLine(line) {
        const timestamp = new Date().toISOString();
        const text = typeof line === 'string' ? line : line.toString();
        return `[${timestamp}] ${text}`;
    }
    writeLogToFile(line, logFilePath) {
        const formatted = this.getFormattedLogLine(line);
        fs.appendFileSync(logFilePath, `${formatted}\n`);
    }
    async start() {
        this.withEnvironment({
            ...this.environment,
            APP_BASE_HREF: `${this.details.appBaseHref}`,
            APP_ID: `${this.details.appId}`,
            PRODUCT_NAME: `${this.details.productName}`,
            CORS_ENABLED: 'true',
        });
        if (this.logFilePath) {
            this.withLogConsumer((stream) => {
                stream.on('data', (line) => this.writeLogToFile(line, this.logFilePath));
                stream.on('err', (line) => this.writeLogToFile(line, this.logFilePath));
            });
        }
        this.withExposedPorts(this.port, 8443);
        this.withCopyContentToContainer([
            { content: UI_TLS_CERT, target: '/etc/nginx/certs/tls.crt', mode: 0o644 },
            { content: UI_TLS_KEY, target: '/etc/nginx/certs/tls.key', mode: 0o644 },
            { content: buildUiTlsServerConf(this.port), target: '/etc/nginx/conf.d/tls-ui.conf', mode: 0o644 },
        ]);
        const hasCustomConfig = this.commandHealthCheckConfig !== undefined || this.healthCheckConfigs.length > 0;
        if (this.commandHealthCheckConfig) {
            this.withHealthCheck((0, wait_strategy_utils_1.toTestcontainersHealthCheck)(this.commandHealthCheckConfig));
        }
        if (hasCustomConfig) {
            const waitStrategies = (0, wait_strategy_utils_1.buildWaitStrategies)(this.commandHealthCheckConfig, this.healthCheckConfigs);
            this.withWaitStrategy(testcontainers_1.Wait.forAll(waitStrategies));
        }
        else {
            // Default: wait for nginx worker process log message
            this.withWaitStrategy(testcontainers_1.Wait.forLogMessage(DEFAULT_LOG_WAIT_MESSAGE)).withStartupTimeout(120_000);
        }
        return new StartedUiContainer(await super.start(), this.details, this.networkAliases, this.port, this.commandHealthCheckConfig, this.healthCheckConfigs);
    }
}
exports.UiContainer = UiContainer;
class StartedUiContainer extends testcontainers_1.AbstractStartedContainer {
    details;
    networkAliases;
    port;
    commandHealthCheck;
    healthCheckConfigs;
    constructor(startedTestContainer, details, networkAliases, port, commandHealthCheck, healthCheckConfigs) {
        super(startedTestContainer);
        this.details = details;
        this.networkAliases = networkAliases;
        this.port = port;
        this.commandHealthCheck = commandHealthCheck;
        this.healthCheckConfigs = healthCheckConfigs;
    }
    getHealthCheckExecutor() {
        return new health_check_executor_1.SkipHealthCheckExecutor('UI Container');
    }
    getAppBaseHref() {
        return this.details.appBaseHref;
    }
    getAppId() {
        return this.details.appId;
    }
    getProductName() {
        return this.details.productName;
    }
    getNetworkAliases() {
        return this.networkAliases;
    }
    getPort() {
        return this.port;
    }
    getCommandHealthCheck() {
        return this.commandHealthCheck;
    }
    getHealthCheckConfigs() {
        return this.healthCheckConfigs;
    }
    getStartedTestContainer() {
        return this.startedTestContainer;
    }
    getDetails() {
        return this.details;
    }
}
exports.StartedUiContainer = StartedUiContainer;
//# sourceMappingURL=onecx-ui.js.map