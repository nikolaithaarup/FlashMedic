import { getVercelOidcToken } from "@vercel/oidc";
import { getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { ExternalAccountClient } from "google-auth-library";

let cachedApp: App | null = null;

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`missing_${name.toLowerCase()}`);
  return value;
}

function getAdminApp(): App {
  if (cachedApp) return cachedApp;
  if (getApps().length) return getApps()[0];

  const projectId = required("GCP_PROJECT_ID");
  const projectNumber = required("GCP_PROJECT_NUMBER");
  const poolId = required("GCP_WORKLOAD_IDENTITY_POOL_ID");
  const providerId = required("GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID");
  const serviceAccount = required("GCP_SERVICE_ACCOUNT_EMAIL");
  const audience = `//iam.googleapis.com/projects/${projectNumber}/locations/global/workloadIdentityPools/${poolId}/providers/${providerId}`;
  const client = ExternalAccountClient.fromJSON({
    type: "external_account",
    audience,
    subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
    token_url: "https://sts.googleapis.com/v1/token",
    service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccount}:generateAccessToken`,
    subject_token_supplier: { getSubjectToken: getVercelOidcToken },
  } as never);
  if (!client) throw new Error("workload_identity_initialization_failed");

  cachedApp = initializeApp({
    projectId,
    credential: {
      getAccessToken: async () => {
        const result = await client.getAccessToken();
        if (!result.token) throw new Error("workload_identity_token_failed");
        return { access_token: result.token, expires_in: 3_300 };
      },
    },
  });
  return cachedApp;
}

export function getAdminServices() {
  const app = getAdminApp();
  return { auth: getAuth(app), db: getFirestore(app) };
}
