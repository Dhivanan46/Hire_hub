// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node" ;

Sentry.init({
  dsn: "https://289f55319e6a985cf0e336f77440ee77@o4509492338032640.ingest.us.sentry.io/4509492344389632",
  integrations: [Sentry.mongooseIntegration()],

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});