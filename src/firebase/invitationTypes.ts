export interface InvitationStoryEvent {
  date: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface InvitationImages {
  coverBackground: string;
  coupleBackground: string;
  bride: string;
  groom: string;
  eventHeading: string;
  galleryHeading: string;
  storyHeading: string;
  giftHeading: string;
  liveHeading: string;
  qrLogo: string;
  footerLogo: string;
  bankBca: string;
  bankQris: string;
  bankSeabank: string;
  rsvpHeading: string;
  coupleStrip: string[];
  gallery: string[];
}

export interface InvitationData {
  slug?: string;
  ownerUid?: string;
  brideName: string;
  groomName: string;
  eventDate: string;
  dateLabel: string;
  weddingLabel: string;
  invitationText: string;
  coupleQuote: string;
  coupleQuoteSource: string;
  brideRole: string;
  brideParents: string;
  groomRole: string;
  groomParents: string;
  ceremonyTitle: string;
  ceremonyWeekday: string;
  ceremonyDay: string;
  ceremonyMonthYear: string;
  ceremonyTime: string;
  ceremonyLocation: string;
  ceremonyMapLink: string;
  receptionTitle: string;
  receptionWeekday: string;
  receptionDay: string;
  receptionMonthYear: string;
  receptionTime: string;
  receptionExtraTime: string;
  receptionLocation: string;
  receptionMapLink: string;
  storyIntro: string;
  storyEvents: InvitationStoryEvent[];
  giftDescription: string;
  bankName: string;
  bankAccount: string;
  bankHolder: string;
  giftAddressTitle: string;
  giftAddress: string;
  giftWhatsapp: string;
  liveDescription: string;
  youtubeVideoId: string;
  qrDescription: string;
  qrTitle: string;
  rsvpDeadlineText: string;
  rsvpFormTitle: string;
  images: InvitationImages;
}

export const DEFAULT_INVITATION: InvitationData = {
  brideName: "Shinta",
  groomName: "Arya",
  eventDate: "2026-09-25",
  dateLabel: "25.09.2026",
  weddingLabel: "The Wedding Of",
  invitationText:
    "Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/I untuk menghadiri acara Pernikahan kami.",
  coupleQuote:
    "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antarmu rasa kasih dan sayang.",
  coupleQuoteSource: "QS. Ar-Rum 21",
  brideRole: "Putri Dari Keluarga",
  brideParents: "Bapak & Ibu",
  groomRole: "Putra Dari Keluarga",
  groomParents: "Bapak & Ibu",
  ceremonyTitle: "Akad Nikah",
  ceremonyWeekday: "Jumat",
  ceremonyDay: "25",
  ceremonyMonthYear: "September 2026",
  ceremonyTime: "Pukul 09.00 - Selesai",
  ceremonyLocation:
    "Jln. Cemara Wangi RT 4 RW 5 ( Depan Balaidesa Sidumulyo), Kota Batu, Malang",
  ceremonyMapLink: "https://maps.app.goo.gl/95ggRWm29xfbycUh7",
  receptionTitle: "Resepsi",
  receptionWeekday: "Jumat",
  receptionDay: "25",
  receptionMonthYear: "September 2026",
  receptionTime: "Pukul 12.00 - Selesai",
  receptionExtraTime: "",
  receptionLocation:
    "Jln. Cemara Wangi RT 4 RW 5 ( Depan Balaidesa Sidumulyo), Kota Batu, Malang",
  receptionMapLink: "https://maps.app.goo.gl/95ggRWm29xfbycUh7",
  storyIntro: "The beautiful journey of our love",
  storyEvents: [
    {
      date: "2020",
      title: "Awal Bertemu",
      description: "-",
      imageUrl: "/assets/images/s1.jpg",
    },
    {
      date: "2020",
      title: "Kencan Pertama",
      description: "-",
      imageUrl: "/assets/images/s2.jpg",
    },
    {
      date: "2026",
      title: "Lamaran",
      description: "",
      imageUrl: "/assets/images/s3.jpg",
    },
  ],
  giftDescription:
    "Doa restu anda merupakan karunia yang sangat berarti bagi kami, dan jika memberi adalah ungkapan tanda kasih anda, anda dapat memberi kado secara cashless.",
  bankName: "Bank BCA / QRIS / Seabank",
  bankAccount: "1234567890",
  bankHolder: "Nama Mempelai Pria/Wanita",
  giftAddressTitle: "Kota Mojokerto, Jawa Timur",
  giftAddress:
    "Jl. Veteran, Mergelo, Magersari, Kec. Magersari, Kota Mojokerto, Jawa Timur 61324",
  giftWhatsapp: "6289528048690",
  liveDescription:
    "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/I berkenan hadir untuk memberikan doa restu kepada kedua mempelai",
  youtubeVideoId: "rCJwHEf6UjY",
  qrDescription:
    "Merupakan suatu kehormatan bagi kami atas kehadiran Anda.",
  qrTitle: "E-TICKET TAMU UNDANGAN",
  rsvpDeadlineText:
    "Tolong konfirmasi kehadiran sebelum tanggal 25 September 2026",
  rsvpFormTitle: "Konfirmasi & Ucapan",
  images: {
    coverBackground: "/assets/images/bg.jpg",
    coupleBackground: "/assets/images/bg1.jfif",
    bride: "/assets/images/bride.jfif",
    groom: "/assets/images/groom.jfif",
    eventHeading: "/assets/images/weddingevent.png",
    galleryHeading: "/assets/images/gallerymoment.png",
    storyHeading: "/assets/images/lovestory.png",
    giftHeading: "/assets/images/weddinggift.png",
    liveHeading: "/assets/images/live.png",
    qrLogo: "/assets/images/logo2.png",
    footerLogo: "/assets/images/logo3.png",
    bankBca: "/assets/images/BCA.png",
    bankQris: "/assets/images/QRIS2.png",
    bankSeabank: "/assets/images/Seabank.png",
    rsvpHeading: "/assets/images/doa.png",
    coupleStrip: [
      "/assets/images/couple.jfif",
      "/assets/images/couple.jfif",
      "/assets/images/couple.jfif",
      "/assets/images/couple.jfif",
    ],
    gallery: [
      "/assets/images/1.jpg",
      "/assets/images/2.jpg",
      "/assets/images/3.jpg",
      "/assets/images/4.jpg",
      "/assets/images/5.jpg",
      "/assets/images/6.jpg",
      "/assets/images/7.jpg",
      "/assets/images/8.jpg",
    ],
  },
};

export function normalizeInvitationData(
  value: Record<string, unknown> | Partial<InvitationData> | undefined,
): InvitationData {
  const data = value ?? {};
  const candidateEventDate =
    typeof data.eventDate === "string"
      ? data.eventDate
      : DEFAULT_INVITATION.eventDate;
  const candidateDate = new Date(`${candidateEventDate}T00:00:00`);
  const hasValidEventDate =
    /^\d{4}-\d{2}-\d{2}$/.test(candidateEventDate) &&
    Number.isFinite(candidateDate.getTime());
  const eventDate = hasValidEventDate
    ? candidateEventDate
    : DEFAULT_INVITATION.eventDate;
  const parsedEventDate = hasValidEventDate
    ? candidateDate
    : new Date(`${DEFAULT_INVITATION.eventDate}T00:00:00`);
  const dateParts = {
        dateLabel: `${String(parsedEventDate.getDate()).padStart(2, "0")}.${String(parsedEventDate.getMonth() + 1).padStart(2, "0")}.${parsedEventDate.getFullYear()}`,
        weekday: new Intl.DateTimeFormat("id-ID", {
          weekday: "long",
        }).format(parsedEventDate),
        day: String(parsedEventDate.getDate()).padStart(2, "0"),
        monthYear: new Intl.DateTimeFormat("id-ID", {
          month: "long",
          year: "numeric",
        }).format(parsedEventDate),
      };
  const legacyLocation =
    "location" in data && typeof data.location === "string"
      ? data.location
      : undefined;
  const rawImages =
    typeof data.images === "object" && data.images !== null
      ? (data.images as Partial<InvitationImages>)
      : {};

  return {
    ...DEFAULT_INVITATION,
    ...data,
    eventDate,
    dateLabel:
      typeof data.dateLabel === "string"
        ? data.dateLabel
        : dateParts.dateLabel,
    ceremonyWeekday:
      typeof data.ceremonyWeekday === "string"
        ? data.ceremonyWeekday
        : dateParts.weekday,
    ceremonyDay:
      typeof data.ceremonyDay === "string"
        ? data.ceremonyDay
        : dateParts.day,
    ceremonyMonthYear:
      typeof data.ceremonyMonthYear === "string"
        ? data.ceremonyMonthYear
        : dateParts.monthYear,
    ceremonyLocation:
      typeof data.ceremonyLocation === "string"
        ? data.ceremonyLocation
        : (legacyLocation ?? DEFAULT_INVITATION.ceremonyLocation),
    receptionWeekday:
      typeof data.receptionWeekday === "string"
        ? data.receptionWeekday
        : dateParts.weekday,
    receptionDay:
      typeof data.receptionDay === "string"
        ? data.receptionDay
        : dateParts.day,
    receptionMonthYear:
      typeof data.receptionMonthYear === "string"
        ? data.receptionMonthYear
        : dateParts.monthYear,
    receptionLocation:
      typeof data.receptionLocation === "string"
        ? data.receptionLocation
        : (legacyLocation ?? DEFAULT_INVITATION.receptionLocation),
    images: {
      ...DEFAULT_INVITATION.images,
      ...rawImages,
      coupleStrip: Array.isArray(rawImages.coupleStrip)
        ? rawImages.coupleStrip
        : DEFAULT_INVITATION.images.coupleStrip,
      gallery: Array.isArray(rawImages.gallery)
        ? rawImages.gallery
        : DEFAULT_INVITATION.images.gallery,
    },
    storyEvents: Array.isArray(data.storyEvents)
      ? (data.storyEvents as InvitationStoryEvent[])
      : DEFAULT_INVITATION.storyEvents,
  } as InvitationData;
}

export function safeExternalUrl(value: string): string {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : "#";
  } catch {
    return "#";
  }
}
