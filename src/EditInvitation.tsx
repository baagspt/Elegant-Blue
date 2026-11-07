import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "./firebase/config";
import {
  createCustomerInvitation,
  findCustomerInvitation,
  loginCustomer,
  registerCustomer,
  saveCustomerInvitation,
  uploadInvitationImage,
} from "./firebase/invitationService";
import {
  type InvitationData,
  type InvitationImages,
  type InvitationStoryEvent,
  normalizeInvitationData,
} from "./firebase/invitationTypes";

type EditableFieldKey = Exclude<
  keyof InvitationData,
  "slug" | "ownerUid" | "images" | "storyEvents"
>;
type SingleImageKey = Exclude<
  keyof InvitationImages,
  "coupleStrip" | "gallery"
>;

const textFields: {
  section: string;
  key: EditableFieldKey;
  label: string;
  multiline?: boolean;
  type?: "date";
}[] = [
  { section: "Mempelai", key: "brideName", label: "Nama mempelai wanita" },
  { section: "Mempelai", key: "groomName", label: "Nama mempelai pria" },
  { section: "Mempelai", key: "eventDate", label: "Tanggal acara", type: "date" },
  { section: "Mempelai", key: "dateLabel", label: "Format tanggal di sampul" },
  { section: "Mempelai", key: "weddingLabel", label: "Judul pernikahan" },
  {
    section: "Mempelai",
    key: "invitationText",
    label: "Teks undangan",
    multiline: true,
  },
  { section: "Mempelai", key: "coupleQuote", label: "Kutipan", multiline: true },
  { section: "Mempelai", key: "coupleQuoteSource", label: "Sumber kutipan" },
  { section: "Mempelai", key: "brideRole", label: "Keterangan mempelai wanita" },
  { section: "Mempelai", key: "brideParents", label: "Orang tua mempelai wanita" },
  { section: "Mempelai", key: "groomRole", label: "Keterangan mempelai pria" },
  { section: "Mempelai", key: "groomParents", label: "Orang tua mempelai pria" },
  { section: "Akad Nikah", key: "ceremonyTitle", label: "Nama acara" },
  { section: "Akad Nikah", key: "ceremonyWeekday", label: "Hari" },
  { section: "Akad Nikah", key: "ceremonyDay", label: "Tanggal" },
  { section: "Akad Nikah", key: "ceremonyMonthYear", label: "Bulan dan tahun" },
  { section: "Akad Nikah", key: "ceremonyTime", label: "Waktu" },
  { section: "Akad Nikah", key: "ceremonyLocation", label: "Lokasi" },
  { section: "Akad Nikah", key: "ceremonyMapLink", label: "Link Google Maps" },
  { section: "Resepsi", key: "receptionTitle", label: "Nama acara" },
  { section: "Resepsi", key: "receptionWeekday", label: "Hari" },
  { section: "Resepsi", key: "receptionDay", label: "Tanggal" },
  { section: "Resepsi", key: "receptionMonthYear", label: "Bulan dan tahun" },
  { section: "Resepsi", key: "receptionTime", label: "Waktu" },
  { section: "Resepsi", key: "receptionExtraTime", label: "Jadwal tambahan" },
  { section: "Resepsi", key: "receptionLocation", label: "Lokasi" },
  { section: "Resepsi", key: "receptionMapLink", label: "Link Google Maps" },
  {
    section: "Cerita",
    key: "storyIntro",
    label: "Teks pengantar cerita",
    multiline: true,
  },
  {
    section: "Hadiah",
    key: "giftDescription",
    label: "Deskripsi hadiah",
    multiline: true,
  },
  { section: "Hadiah", key: "bankName", label: "Nama bank / metode transfer" },
  { section: "Hadiah", key: "bankAccount", label: "Nomor rekening" },
  { section: "Hadiah", key: "bankHolder", label: "Nama pemilik rekening" },
  { section: "Hadiah", key: "giftAddressTitle", label: "Judul alamat kirim kado" },
  {
    section: "Hadiah",
    key: "giftAddress",
    label: "Alamat kirim kado",
    multiline: true,
  },
  { section: "Hadiah", key: "giftWhatsapp", label: "Nomor WhatsApp konfirmasi" },
  {
    section: "Live & E-ticket",
    key: "liveDescription",
    label: "Deskripsi live streaming",
    multiline: true,
  },
  { section: "Live & E-ticket", key: "youtubeVideoId", label: "ID video YouTube" },
  {
    section: "Live & E-ticket",
    key: "qrDescription",
    label: "Teks e-ticket",
    multiline: true,
  },
  { section: "Live & E-ticket", key: "qrTitle", label: "Judul e-ticket" },
  { section: "RSVP", key: "rsvpDeadlineText", label: "Teks batas konfirmasi" },
  { section: "RSVP", key: "rsvpFormTitle", label: "Judul formulir RSVP" },
];

const singleImageFields: { key: SingleImageKey; label: string }[] = [
  { key: "coverBackground", label: "Latar sampul" },
  { key: "coupleBackground", label: "Latar bagian pembuka" },
  { key: "bride", label: "Foto mempelai wanita" },
  { key: "groom", label: "Foto mempelai pria" },
  { key: "eventHeading", label: "Gambar judul acara" },
  { key: "galleryHeading", label: "Gambar judul galeri" },
  { key: "storyHeading", label: "Gambar judul cerita" },
  { key: "giftHeading", label: "Gambar judul hadiah" },
  { key: "liveHeading", label: "Gambar judul live streaming" },
  { key: "qrLogo", label: "Logo e-ticket" },
  { key: "footerLogo", label: "Logo footer" },
  { key: "bankBca", label: "Logo bank BCA" },
  { key: "bankQris", label: "Gambar QRIS hadiah" },
  { key: "bankSeabank", label: "Logo SeaBank" },
  { key: "rsvpHeading", label: "Gambar judul RSVP" },
];

interface EditInvitationProps {
  initialSlug: string;
}

interface ImageUploaderProps {
  label: string;
  value: string;
  onUpload: (file: File) => Promise<void>;
}

function ImageUploader({ label, value, onUpload }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      await onUpload(file);
    } catch (uploadError) {
      console.error("Gagal mengunggah gambar:", uploadError);
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Gagal mengunggah gambar. Coba lagi.",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <img
        src={value}
        alt={label}
        className="mt-2 h-32 w-full rounded-md bg-slate-100 object-contain"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={uploading}
        className="mt-2 block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2"
      />
      {uploading && <p className="mt-1 text-sm text-slate-500">Mengunggah...</p>}
      {error && <p className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
  );
}

export default function EditInvitation({ initialSlug }: EditInvitationProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [slug, setSlug] = useState(initialSlug === "arya-sinta" ? "" : initialSlug);
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loadingInvitation, setLoadingInvitation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      setInvitation(null);
      return;
    }

    let active = true;
    setLoadingInvitation(true);
    setError("");
    findCustomerInvitation(user.uid)
      .then((customerInvitation) => {
        if (active) {
          setInvitation(
            customerInvitation
              ? normalizeInvitationData(customerInvitation)
              : null,
          );
          if (customerInvitation?.slug) setSlug(customerInvitation.slug);
        }
      })
      .catch((loadError: unknown) => {
        console.error("Gagal memuat undangan customer:", loadError);
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Gagal memuat data undangan.",
          );
        }
      })
      .finally(() => {
        if (active) setLoadingInvitation(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  const handleAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("");
    try {
      if (mode === "signup") {
        await registerCustomer(email, password);
      } else {
        await loginCustomer(email, password);
      }
    } catch (authError) {
      console.error("Autentikasi customer gagal:", authError);
      setError(
        authError instanceof Error
          ? authError.message
          : "Gagal masuk. Periksa email dan kata sandi.",
      );
    }
  };

  const handleCreateInvitation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 40) {
      setError("Slug harus berisi huruf kecil, angka, dan tanda hubung.");
      return;
    }

    setError("");
    setStatus("");
    try {
      const newInvitation = await createCustomerInvitation(user.uid, slug);
      setInvitation(newInvitation);
      window.history.replaceState(null, "", `?edit=1&slug=${slug}`);
      setStatus("Undangan berhasil dibuat. Silakan lengkapi isinya.");
    } catch (createError) {
      console.error("Gagal membuat undangan customer:", createError);
      setError(
        createError instanceof Error
          ? createError.message
          : "Gagal membuat undangan. Coba lagi.",
      );
    }
  };

  const updateField = (key: EditableFieldKey, value: string) => {
    setInvitation((current) => {
      if (!current) return current;
      if (key !== "eventDate") return { ...current, [key]: value };
      if (!value) return { ...current, eventDate: value };

      const date = new Date(`${value}T00:00:00`);
      const day = String(date.getDate()).padStart(2, "0");
      const monthYear = new Intl.DateTimeFormat("id-ID", {
        month: "long",
        year: "numeric",
      }).format(date);
      const weekday = new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
      }).format(date);

      return {
        ...current,
        eventDate: value,
        dateLabel: `${day}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`,
        ceremonyWeekday: weekday,
        ceremonyDay: day,
        ceremonyMonthYear: monthYear,
        receptionWeekday: weekday,
        receptionDay: day,
        receptionMonthYear: monthYear,
      };
    });
  };

  const uploadImage = async (
    file: File,
    onUploaded: (url: string) => void,
  ) => {
    if (!user || !invitation?.slug) return;
    const url = await uploadInvitationImage(user.uid, invitation.slug, file);
    onUploaded(url);
  };

  const updateStoryEvent = (
    index: number,
    key: keyof InvitationStoryEvent,
    value: string,
  ) => {
    setInvitation((current) => {
      if (!current) return current;
      const storyEvents = [...current.storyEvents];
      storyEvents[index] = { ...storyEvents[index], [key]: value };
      return { ...current, storyEvents };
    });
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !invitation?.slug) return;

    setSaving(true);
    setError("");
    setStatus("");
    try {
      await saveCustomerInvitation(invitation.slug, user.uid, invitation);
      setStatus("Perubahan berhasil disimpan.");
    } catch (saveError) {
      console.error("Gagal menyimpan undangan:", saveError);
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Gagal menyimpan perubahan.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    setError("");
    try {
      await signOut(auth);
    } catch (signOutError) {
      console.error("Gagal keluar dari akun:", signOutError);
      setError("Gagal keluar dari akun. Coba lagi.");
    }
  };

  if (!authReady || loadingInvitation) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <p className="text-slate-600">Memuat akun dan undangan...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <form
          onSubmit={handleAuth}
          className="mx-auto max-w-md space-y-5 rounded-2xl bg-white p-6 shadow"
        >
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {mode === "signup" ? "Buat akun customer" : "Masuk ke akun"}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Kelola isi dan gambar undangan pernikahan Anda.
            </p>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Kata sandi
            <input
              type="password"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              minLength={6}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-md bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-700"
          >
            {mode === "signup" ? "Daftar" : "Masuk"}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signup" ? "login" : "signup");
              setError("");
            }}
            className="w-full text-sm text-slate-700 underline"
          >
            {mode === "signup"
              ? "Sudah punya akun? Masuk"
              : "Belum punya akun? Daftar"}
          </button>
        </form>
      </main>
    );
  }

  if (!invitation) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <form
          onSubmit={handleCreateInvitation}
          className="mx-auto max-w-md space-y-5 rounded-2xl bg-white p-6 shadow"
        >
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Buat undangan Anda
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Link undangan: <span className="font-medium">?slug={slug || "nama-undangan"}</span>
            </p>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            Nama link undangan
            <input
              type="text"
              minLength={3}
              maxLength={40}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              required
              value={slug}
              onChange={(event) =>
                setSlug(
                  event.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "")
                    .replace(/--+/g, "-"),
                )
              }
              placeholder="nama-undangan"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-md bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-700"
          >
            Buat undangan
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full text-sm text-slate-700 underline"
          >
            Keluar
          </button>
        </form>
      </main>
    );
  }

  const sections = [...new Set(textFields.map((field) => field.section))];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Editor undangan
            </h1>
            <p className="text-sm text-slate-600">
              Akun {user.email} · link:{" "}
              <a
                href={`?slug=${invitation.slug}`}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                ?slug={invitation.slug}
              </a>
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm"
          >
            Keluar
          </button>
        </header>

        <form onSubmit={handleSave} className="space-y-5">
          {sections.map((section) => (
            <section
              key={section}
              className="rounded-xl bg-white p-5 shadow-sm"
            >
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                {section}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {textFields
                  .filter((field) => field.section === section)
                  .map((field) => (
                    <label
                      key={field.key}
                      className="block text-sm font-medium text-slate-700"
                    >
                      {field.label}
                      {field.multiline ? (
                        <textarea
                          value={invitation[field.key]}
                          onChange={(event) =>
                            updateField(field.key, event.target.value)
                          }
                          rows={3}
                          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                        />
                      ) : (
                        <input
                          type={field.type ?? "text"}
                          required={field.type === "date"}
                          value={invitation[field.key]}
                          onChange={(event) =>
                            updateField(field.key, event.target.value)
                          }
                          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                        />
                      )}
                    </label>
                  ))}
              </div>
              {section === "Cerita" && (
                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                  {invitation.storyEvents.map((story, index) => (
                    <fieldset
                      key={index}
                      className="space-y-3 rounded-lg border border-slate-200 p-4"
                    >
                      <legend className="px-1 font-medium">
                        Cerita {index + 1}
                      </legend>
                      {(
                        ["date", "title", "description"] as const
                      ).map((key) => (
                        <label
                          key={key}
                          className="block text-sm text-slate-700"
                        >
                          {key === "date"
                            ? "Tanggal"
                            : key === "title"
                              ? "Judul"
                              : "Deskripsi"}
                          {key === "description" ? (
                            <textarea
                              value={story[key]}
                              onChange={(event) =>
                                updateStoryEvent(index, key, event.target.value)
                              }
                              rows={3}
                              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                            />
                          ) : (
                            <input
                              value={story[key]}
                              onChange={(event) =>
                                updateStoryEvent(index, key, event.target.value)
                              }
                              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                            />
                          )}
                        </label>
                      ))}
                      <ImageUploader
                        label="Foto cerita"
                        value={story.imageUrl}
                        onUpload={(file) =>
                          uploadImage(file, (url) =>
                            updateStoryEvent(index, "imageUrl", url),
                          )
                        }
                      />
                    </fieldset>
                  ))}
                </div>
              )}
            </section>
          ))}

          <section className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Gambar undangan
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {singleImageFields.map(({ key, label }) => (
                <ImageUploader
                  key={key}
                  label={label}
                  value={invitation.images[key]}
                  onUpload={(file) =>
                    uploadImage(file, (url) =>
                      setInvitation((current) =>
                        current
                          ? {
                              ...current,
                              images: { ...current.images, [key]: url },
                            }
                          : current,
                      ),
                    )
                  }
                />
              ))}
              {invitation.images.coupleStrip.map((image, index) => (
                <ImageUploader
                  key={`couple-${index}`}
                  label={`Foto pembuka ${index + 1}`}
                  value={image}
                  onUpload={(file) =>
                    uploadImage(file, (url) =>
                      setInvitation((current) => {
                        if (!current) return current;
                        const coupleStrip = [...current.images.coupleStrip];
                        coupleStrip[index] = url;
                        return {
                          ...current,
                          images: { ...current.images, coupleStrip },
                        };
                      }),
                    )
                  }
                />
              ))}
              {invitation.images.gallery.map((image, index) => (
                <ImageUploader
                  key={`gallery-${index}`}
                  label={`Foto galeri ${index + 1}`}
                  value={image}
                  onUpload={(file) =>
                    uploadImage(file, (url) =>
                      setInvitation((current) => {
                        if (!current) return current;
                        const gallery = [...current.images.gallery];
                        gallery[index] = url;
                        return {
                          ...current,
                          images: { ...current.images, gallery },
                        };
                      }),
                    )
                  }
                />
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Format gambar apa pun yang didukung browser, maksimal 5 MB per file.
            </p>
          </section>

          {error && (
            <p role="alert" className="rounded-md bg-red-50 p-3 text-red-700">
              {error}
            </p>
          )}
          {status && (
            <p role="status" className="rounded-md bg-green-50 p-3 text-green-800">
              {status}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-md bg-slate-800 px-5 py-3 font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan perubahan"}
          </button>
        </form>
      </div>
    </main>
  );
}
