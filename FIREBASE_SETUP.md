# Firebase setup

The customer editor uses Firebase Authentication, Cloud Firestore, and Cloud Storage.

1. In Firebase Console, enable **Email/Password** and **Anonymous** sign-in providers.
2. Create a Firestore database and enable Firebase Storage for the project configured in `src/firebase/config.ts`.
3. From the project folder, sign in to Firebase CLI, then deploy both rule files to `milenia-story`:

   ```sh
   pnpm dlx firebase-tools login
   pnpm dlx firebase-tools deploy --project milenia-story --only firestore:rules,storage
   ```

4. Deploy the Vite site to Vercel as usual. Customers open `?edit=1`, create an account, choose an unused invitation slug, and save their content. Their public invitation is available at `?slug=<slug>`.

The rules make invitations publicly readable and editable only by the authenticated account recorded as `ownerUid`. Customer image uploads are limited to image files smaller than 5 MB and stored under that account's UID. RSVP messages are stored separately under each invitation.

Existing invitation documents without an `ownerUid` cannot be claimed through the customer editor. An administrator must verify the customer and assign the account's Firebase UID before enabling edits to an existing invitation. Otherwise, the customer can create a new invitation using an unused slug.

QRIS billing and customer subdomains are not included yet. A payment provider, verified payment backend, root domain, and Vercel wildcard DNS configuration are still required for those features.
