import { deleteApp, initializeApp } from "firebase/app";
import {
  deleteUser,
  getAuth,
  inMemoryPersistence,
  setPersistence,
  signInAnonymously,
} from "firebase/auth";
import {
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
} from "firebase/firestore";

const projectId = "flashmedic-edf96";
const firebaseConfig = {
  apiKey: "AIzaSyBL6Jm7196_80oBhAH9n1Zz7Qq8iKgUaf4",
  authDomain: `${projectId}.firebaseapp.com`,
  projectId,
  appId: "1:1019339255388:web:323f184265e61cc301c099",
};

function isPermissionDenied(error: unknown) {
  return typeof error === "object"
    && error !== null
    && "code" in error
    && (error as { code?: string }).code === "permission-denied";
}

async function main() {
  const targetUserUid = process.env.LIVE_RULES_TARGET_UID;
  if (!targetUserUid) throw new Error("LIVE_RULES_TARGET_UID is required.");

  const suffix = `${Date.now()}`;
  const guestApp = initializeApp(firebaseConfig, `live-rules-guest-${suffix}`);
  const anonymousApp = initializeApp(firebaseConfig, `live-rules-anonymous-${suffix}`);
  const anonymousAuth = getAuth(anonymousApp);

  try {
    const cards = await getDocs(collectionGroup(getFirestore(guestApp), "cards"));
    const canonicalPathsOnly = cards.docs.every((card) => /\/cards\/[^/]+$/.test(card.ref.path));

    await setPersistence(anonymousAuth, inMemoryPersistence);
    const credential = await signInAnonymously(anonymousAuth);
    const anonymousDb = getFirestore(anonymousApp);

    let crossUserDenied = false;
    try {
      await getDoc(doc(
        anonymousDb,
        `flashmedic_users/${targetUserUid}/progressEvents/rules-cross-user-probe`,
      ));
    } catch (error) {
      crossUserDenied = isPermissionDenied(error);
    }

    let forgedLeaderboardDenied = false;
    try {
      await setDoc(
        doc(anonymousDb, `weekly_results/2099-W01/users/${credential.user.uid}`),
        { uid: credential.user.uid, totalScore: 999999999 },
      );
    } catch (error) {
      forgedLeaderboardDenied = isPermissionDenied(error);
    }

    const result = {
      guestCollectionGroupReadable: cards.size > 0,
      guestCardCount: cards.size,
      canonicalPathsOnly,
      crossUserDenied,
      forgedLeaderboardDenied,
    };
    if (!result.guestCollectionGroupReadable
      || !result.canonicalPathsOnly
      || !result.crossUserDenied
      || !result.forgedLeaderboardDenied) {
      throw new Error("Live Firestore rules verification failed.");
    }
    console.log(JSON.stringify(result));
  } finally {
    if (anonymousAuth.currentUser) await deleteUser(anonymousAuth.currentUser).catch(() => undefined);
    await Promise.all([deleteApp(guestApp), deleteApp(anonymousApp)]);
  }
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Live Firestore rules verification failed.");
  process.exitCode = 1;
});
