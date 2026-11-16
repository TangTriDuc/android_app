const functionsV1 = require('firebase-functions/v1');
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { createHash } = require('node:crypto');

initializeApp();

const db = getFirestore();

const normalizeEmail = email => email.trim().toLowerCase();

const getDeletedAccountRef = email => {
  const id = createHash('sha256').update(normalizeEmail(email)).digest('hex');

  return db.collection('deletedAccounts').doc(id);
};

// Tự chạy khi tài khoản Firebase Auth bị xóa.
exports.recordDeletedAccount = functionsV1.auth.user().onDelete(async user => {
  if (!user.email) return;

  await getDeletedAccountRef(user.email).set({
    deletedAt: FieldValue.serverTimestamp(),
  });
});

// Kiểm tra email có thuộc tài khoản đã xóa hay không.
exports.checkDeletedAccount = onCall(async request => {
  const email = request.data?.email;

  if (typeof email !== 'string' || !email.trim() || email.length > 254) {
    throw new HttpsError('invalid-argument', 'Invalid email.');
  }

  const normalizedEmail = normalizeEmail(email);
  const ref = getDeletedAccountRef(normalizedEmail);

  try {
    // Tài khoản đang tồn tại: không hiện "Vui lòng tạo tài khoản".
    await getAuth().getUserByEmail(normalizedEmail);

    await ref.delete();

    return { deleted: false };
  } catch (error) {
    if (error.code !== 'auth/user-not-found') {
      throw new HttpsError('internal', 'Unable to check account.');
    }
  }

  const snapshot = await ref.get();

  return { deleted: snapshot.exists };
});

// Xóa dấu khi người dùng tạo lại hoặc đăng nhập thành công.
exports.clearDeletedAccount = onCall(async request => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Sign in required.');
  }

  const user = await getAuth().getUser(request.auth.uid);

  if (user.email) {
    await getDeletedAccountRef(user.email).delete();
  }

  return { success: true };
});
