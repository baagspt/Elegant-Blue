import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type User,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "./config";
import {
  DEFAULT_INVITATION,
  normalizeInvitationData,
  type InvitationData,
} from "./invitationTypes";

export async function registerCustomer(
  email: string,
  password: string,
): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function loginCustomer(
  email: string,
  password: string,
): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function findCustomerInvitation(
  uid: string,
): Promise<InvitationData | null> {
  const invitations = await getDocs(
    query(collection(db, "invitations"), where("ownerUid", "==", uid)),
  );

  if (invitations.docs.length > 1) {
    throw new Error(
      "Akun ini memiliki lebih dari satu undangan. Hubungi admin untuk bantuan.",
    );
  }

  if (invitations.empty) {
    return null;
  }

  const invitation = invitations.docs[0];
  return normalizeInvitationData({
    ...invitation.data(),
    slug: invitation.id,
  });
}

export async function createCustomerInvitation(
  uid: string,
  slug: string,
): Promise<InvitationData> {
  const invitationRef = doc(db, "invitations", slug);
  const invitationData = {
    ...DEFAULT_INVITATION,
    slug,
    ownerUid: uid,
    updatedAt: serverTimestamp(),
  };

  await runTransaction(db, async (transaction) => {
    const existing = await transaction.get(invitationRef);
    if (existing.exists()) {
      throw new Error("Slug ini sudah digunakan. Pilih nama link yang lain.");
    }

    transaction.set(invitationRef, invitationData);
  });

  return invitationData;
}

export async function saveCustomerInvitation(
  slug: string,
  uid: string,
  data: InvitationData,
): Promise<void> {
  const editableData = { ...data };
  delete editableData.ownerUid;
  delete editableData.slug;
  await updateDoc(doc(db, "invitations", slug), {
    ...editableData,
    slug,
    ownerUid: uid,
    updatedAt: serverTimestamp(),
  });
}

export async function uploadInvitationImage(
  uid: string,
  slug: string,
  file: File,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Pilih file gambar.");
  }
  if (file.size >= 5 * 1024 * 1024) {
    throw new Error("Ukuran gambar harus kurang dari 5 MB.");
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const imageRef = ref(
    storage,
    `invitations/${uid}/${slug}/${Date.now()}-${safeName}`,
  );
  await uploadBytes(imageRef, file, { contentType: file.type });
  return getDownloadURL(imageRef);
}
