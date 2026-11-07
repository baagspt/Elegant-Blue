import { useState, useRef, useEffect } from "react";
import { db } from "./firebase/config";
import { doc, getDoc } from "firebase/firestore";
import EditInvitation from "./EditInvitation";
import { DEFAULT_INVITATION, normalizeInvitationData, type InvitationData } from "./firebase/invitationTypes";

import AudioPlayer from "./components/AudioPlayer";
import CoverScreen from "./components/CoverScreen";
import CoupleSection from "./components/CoupleSection";
import BrideSection from "./components/BrideSection";
import GroomSection from "./components/GroomSection";
import EventSection from "./components/EventSection";
import GallerySection from "./components/GallerySection";
import Story from "./components/Story";
import GiftSection from "./components/GiftSection";
import Live from "./components/Live";
import QRSection from "./components/QRSection";
import RSVPSection from "./components/RSVPSection";
import Footer from "./components/Footer";

// Ambil nama tamu dari URL (Parameter ?to=)
const getUrlParameter = (name: string) => {
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(name) || "Tamu Undangan";
  if (value && value !== "Tamu Undangan") {
    return value
      .split(" ")
      .map(
        word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
  }
  return value;
};

function App() {
  const guestName = getUrlParameter("to");

  // Ambil slug undangan dari URL (Contoh: ?slug=arya-sinta atau default "arya-sinta")
  const urlParams = new URLSearchParams(window.location.search);
  const invitationSlug = urlParams.get("slug") || "arya-sinta";
  const isEditPage = urlParams.has("edit");

  const [showContent, setShowContent] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const [weddingData, setWeddingData] = useState<InvitationData>(DEFAULT_INVITATION);
  const [loading, setLoading] = useState(!isEditPage);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (isEditPage) return;
    let active = true;
    setLoadError("");

    async function fetchInvitationData() {
      try {
        const docRef = doc(db, "invitations", invitationSlug);
        const docSnap = await getDoc(docRef);

        if (active && docSnap.exists()) {
          setWeddingData(normalizeInvitationData(docSnap.data()));
        } else if (active) {
          setWeddingData(DEFAULT_INVITATION);
        }
      } catch (error) {
        console.error("Gagal mengambil data dari Firebase:", error);
        if (active) setLoadError("Data undangan gagal dimuat dari Firebase.");
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchInvitationData();
    return () => {
      active = false;
    };
  }, [invitationSlug, isEditPage]);
  
  // Ref untuk Div 30% (Konten Utama) - Target Scroll
  const contentRef = useRef<HTMLDivElement>(null); 

  const handleOpenInvitation = () => {
    setShowContent(true);
    setAudioPlaying(true);
  };

  const toggleAudio = () => {
    setAudioPlaying(!audioPlaying);
  };
  
  // Fungsi untuk Mengarahkan Scroll dari 70% ke 30%
  const handleWheelOnCover = (e: React.WheelEvent<HTMLDivElement>) => {
    if (contentRef.current) {
      e.preventDefault(); 
      contentRef.current.scrollTop += e.deltaY;
    }
  };

  if (isEditPage) {
    return <EditInvitation initialSlug={invitationSlug} />;
  }

  const MainContentSections = (
    <>
      <CoupleSection weddingData={weddingData} />
      <BrideSection weddingData={weddingData} />
      <GroomSection weddingData={weddingData} />
      <EventSection weddingData={weddingData} />
      <GallerySection weddingData={weddingData} />
      <Story weddingData={weddingData} />
      <GiftSection weddingData={weddingData} />
      <Live weddingData={weddingData} />
      <QRSection weddingData={weddingData} />
      <RSVPSection invitationSlug={invitationSlug} weddingData={weddingData} />
      <Footer weddingData={weddingData} />
    </>
  );

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center font-serif bg-white">
        <p className="text-gray-500 animate-pulse">Memuat Undangan...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen font-serif overflow-hidden">
      <a
        href={`?edit=1&slug=${encodeURIComponent(invitationSlug)}`}
        className="fixed right-3 top-3 z-50 rounded-full bg-white/90 px-4 py-2 text-sm text-slate-800 shadow"
      >
        Kelola Undangan
      </a>
      {loadError && (
        <p role="alert" className="fixed bottom-3 left-3 z-50 rounded bg-red-50 px-3 py-2 text-sm text-red-800">
          {loadError}
        </p>
      )}
      {showContent && (
        <AudioPlayer 
          src="/audio/bg.mp3" 
          isPlaying={audioPlaying} 
          onPlayPause={toggleAudio} 
        />
      )}
      
      {/* ==================== MOBILE / TABLET LAYOUT ==================== */}
      <div className="block xl:hidden w-full h-full">
        {!showContent ? (
          <CoverScreen
            guestName={guestName}
            weddingData={weddingData}
            onOpenInvitation={handleOpenInvitation}
            audioPlaying={audioPlaying}
            showButton={true} 
          />
        ) : (
          <div className="w-full h-full overflow-y-auto bg-white shadow-lg">
            {MainContentSections}
          </div>
        )}
      </div>

      {/* ==================== DESKTOP LAYOUT ==================== */}
      <div className="hidden xl:flex w-full h-full"> 
        {showContent ? (
          <>
            <div 
              className="w-[68%] h-full" 
              onWheel={handleWheelOnCover}
            > 
              <CoverScreen
                guestName={guestName}
                weddingData={weddingData}
                onOpenInvitation={handleOpenInvitation}
                audioPlaying={audioPlaying}
                showButton={false} 
              />
            </div>

            <div 
              className="w-[32%] h-full overflow-y-auto bg-white shadow-lg"
              ref={contentRef}
            >
              {MainContentSections}
            </div>
          </>
        ) : (
          <div className="w-full h-full">
            <CoverScreen
              guestName={guestName}
              weddingData={weddingData}
              onOpenInvitation={handleOpenInvitation}
              audioPlaying={audioPlaying}
              showButton={true} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;