import {
  addDoc,
  collection,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db, rsvpAuth } from "./config";

export interface RsvpData {
  id?: string;
  name: string;
  email: string;
  attendance: "yes" | "no" | "maybe";
  guests: number;
  message: string;
  createdAt?: Timestamp;
  userId?: string;
}

function getAnonymousUserId(): string {
  const user = rsvpAuth.currentUser;
  if (!user || !user.isAnonymous) {
    throw new Error("RSVP requires an anonymous Firebase user.");
  }
  return user.uid;
}

export async function addRSVP(
  invitationSlug: string,
  data: Omit<RsvpData, "id" | "createdAt" | "userId">,
): Promise<void> {
  const userId = getAnonymousUserId();
  await addDoc(collection(db, "invitations", invitationSlug, "rsvps"), {
    ...data,
    userId,
    createdAt: Timestamp.now(),
  });
}

export async function getRSVPs(invitationSlug: string): Promise<RsvpData[]> {
  const snapshot = await getDocs(
    collection(db, "invitations", invitationSlug, "rsvps"),
  );
  const rsvps = snapshot.docs.map((snapshotDoc) => ({
    id: snapshotDoc.id,
    ...snapshotDoc.data(),
  })) as RsvpData[];

  rsvps.sort(
    (first, second) =>
      (second.createdAt?.toMillis() ?? 0) - (first.createdAt?.toMillis() ?? 0),
  );
  return rsvps;
}
