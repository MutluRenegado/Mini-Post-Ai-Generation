// scripts/set-subscription.js
const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue, Timestamp } = require("firebase-admin/firestore");
const path = require("path");

const serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");

if (getApps().length === 0) {
  try {
    const serviceAccount = require(serviceAccountPath);
    initializeApp({
      credential: cert(serviceAccount),
      projectId: "echosofwandering", // Explicitly define project ID
    });
  } catch (err) {
    console.error("\n❌ Service Account key not found!");
    process.exit(1);
  }
}

const db = getFirestore();

async function setSubscription(uid, tier = "pro", days = 30) {
  if (!uid) {
    console.error("❌ Error: Please provide a valid Firebase User UID.");
    process.exit(1);
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const userRef = db.collection("users").doc(uid);

  try {
    await userRef.set(
      {
        subscription: {
          tier: tier,
          status: "active",
          updatedAt: FieldValue.serverTimestamp(),
          expiresAt: Timestamp.fromDate(expiresAt),
        },
      },
      { merge: true }
    );

    console.log(`\n✅ Successfully provisioned ${tier.toUpperCase()} plan for UID: ${uid}`);
    console.log(`📅 Valid for ${days} days (Expires: ${expiresAt.toISOString()})\n`);
  } catch (error) {
    console.error("❌ Failed to update subscription:", error);
  } finally {
    process.exit(0);
  }
}

const args = process.argv.slice(2);
setSubscription(args[0], args[1] || "pro");