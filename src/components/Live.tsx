import React from 'react';

const Live: React.FC = () => {
    // Warna Teks Baru
    const TEXT_COLOR = '#2C363C';
    
    // === ID VIDEO YOUTUBE (Video Vertikal) ===
    const YOUTUBE_VIDEO_ID = 'bk0tr_NQiFU'; 
    
    // URL embed untuk ditampilkan di iframe
    const youtubeEmbedUrl = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=1&rel=0`;

    return (
        <section 
            className="py-16 md:py-20"
            style={{
                // ✅ PERUBAHAN 1: Gradasi dari atas ke bawah (to bottom): Putih (atas) ke #727E6A (bawah)
                // Catatan: Saya mengasumsikan Anda ingin warna gradasi tetap dipertahankan seperti di kode sebelumnya, hanya teks yang diubah. Jika Anda ingin gradasi diubah ke #2C363C, beri tahu saya.
                // Saat ini, gradasi tetap: Putih (atas) ke #94AAB7 (bawah)
                backgroundImage: 'linear-gradient(to bottom, #ffffff, #94AAB7)',
            }}
        >
            <div className="container mx-auto px-4 max-w-4xl"> 
                <div className="text-center">
                    {/* Header with icon */}
                    <div className="mb-8">
                        <img 
                            src="/assets/images/live.png" 
                            alt="Live Streaming" 
                            className="mx-auto max-w-[200px] md:max-w-[280px]"
                        />
                    </div>
                    
                    {/* Description */}
                    {/* ✅ PERUBAHAN 2: Teks Deskripsi diubah menjadi #2C363C */}
                    <p 
                        className="text-base leading-relaxed mb-8" 
                        style={{ fontFamily: "Markazi Text, serif", color: TEXT_COLOR }}
                    >
                        Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/I berkenan hadir untuk memberikan doa restu kepada kedua mempelai
                    </p>
                    
                    {/* Live stream embed - TETAP ADA */}
                    <div className="mb-8">
                        {/* Tambahkan `mx-auto` pada div luar untuk memastikan centering dalam max-w-4xl */}
                        <div className="aspect-w-9 aspect-h-16 bg-gray-200 rounded-xl overflow-hidden max-w-md mx-auto">
                            <iframe 
                                className="w-full h-full" 
                                src={youtubeEmbedUrl}
                                title="YouTube Live Stream"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                frameBorder="0"
                            ></iframe>
                        </div>
                    </div>
                    
                    {/* === BLOK JUDUL NAMA PASANGAN (Menggantikan Title "LIVE Streaming") === */}
                    {/* ✅ PERUBAHAN 3: Container teks diubah menjadi #2C363C */}
                    <div style={{ color: TEXT_COLOR }}> 
                        {/* 1. Jarak di bawah "The Wedding Of" dijadikan renggang (mb-3) */}
                        <div className="mb-3"> 
                            <p 
                                className="text-xs md:text-sm tracking-widest font-bold" 
                                style={{ fontFamily: "Montserrat, sans-serif" }} 
                            >
                                The Wedding Of
                            </p>
                        </div>

                        {/* 2. Jarak di bawah "Alya & Rian" dijadikan renggang (mb-3) */}
                        <h1 
                            className="text-3xl md:text-5xl font-normal tracking-tight mb-3" 
                            style={{ fontFamily: "Whisper, cursive" }} 
                        >
                            Brian &amp; Niken
                        </h1>
                        {/* 3. Jarak di bawah "02.02.2026" dihilangkan (mb-0) agar rapat dengan batas section bawah */}
                        <p className="text-sm font-bold font-Alan-Sans mb-0">06.06.2026</p>
                    </div>
                    {/* ============================================= */}

                </div>
            </div>
        </section>
    );
};

export default Live;