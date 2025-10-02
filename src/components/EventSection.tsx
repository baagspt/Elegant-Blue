import React from 'react';

const EventSection: React.FC = () => {
    
    // MENGGUNAKAN TAUTAN GOOGLE MAPS DARI GAMBAR YANG ANDA BERIKAN
    const mapLink = "https://maps.app.goo.gl/N8gHezkV5xduzzSH6";
    
    // Warna tombol baru: #2C363C
    const buttonColor = '#2C363C';
    // Warna hover (sedikit lebih gelap, misalnya #1F282C)
    const buttonHoverColor = '#1F282C';

    // Warna teks utama
    const primaryTextColor = "text-[#2C363C]";
    
    return (
        // Mengubah pt-20 menjadi pt-12 (jarak atas menjadi lebih rapat)
        <section 
            className="pt-12 relative" 
            // Latar belakang abu-abu kebiruan
            style={{ backgroundColor: '#79919E' }} 
        > 
        
            {/* Konten atas "WEDDING Event" */}
            {/* Mengubah mb-10 menjadi mb-6 (jarak bawah header menjadi lebih rapat) */}
            <div className="container mx-auto px-4 text-center mb-6 md:mb-16">
                <div className="mb-4">
                    <img 
                        src="/assets/images/weddingevent.png" 
                        alt="Wedding Event" 
                        className="mx-auto max-w-[200px] md:max-w-[280px]"
                    />
                </div>
            </div>

            {/* CARD UTAMA BERBENTUK KUBAH (PUTIH) */}
            <div className="w-full relative z-10"> 
                <div 
                    // PERUBAHAN UTAMA: shadow-2xl Dihapus!
                    className="overflow-hidden w-full" 
                    style={{ 
                        backgroundColor: '#FFFFFF',
                        // Mempertahankan bentuk kubah yang lebih datar
                        borderTopLeftRadius: '60% 25%', 
                        borderTopRightRadius: '60% 25%', 
                    }}
                >
                    
                    {/* Konten di dalam Card */}
                    <div className="container mx-auto px-4 py-12 md:py-16 text-center"> 

                        {/* AKAD NIKAH */}
                        <div className="mb-12 md:mb-16">
                            {/* Ikon cincin */}
                            {/* ✅ PERUBAHAN 1: Ikon cincin dan border diubah menjadi text-[#2C363C] dan border-[#2C363C] */}
                            <div className={`mb-4 ${primaryTextColor} mx-auto w-12 h-12 flex items-center justify-center rounded-full border border-[#2C363C]`}>
                                💍 
                            </div>
                            
                            {/* ✅ PERUBAHAN 2: Judul 'Akad Nikah' diubah menjadi text-[#2C363C] */}
                            <h3 className={`text-4xl md:text-5xl font-script ${primaryTextColor} mb-6`} style={{ fontFamily: "Markazi Text, serif" }}>
                                Akad Nikah
                            </h3>
                            {/* ✅ PERUBAHAN 3: Hari diubah menjadi text-[#2C363C] */}
                            <p className={`text-xl ${primaryTextColor} mb-2`} style={{ fontFamily: "Markazi Text, serif" }}>Sabtu</p>
                            {/* ✅ PERUBAHAN 4: Divider horizontal diubah menjadi border-[#2C363C] */}
                            <hr className="w-16 mx-auto border-[#2C363C] mb-2" /> 
                            {/* ✅ PERUBAHAN 5: Tanggal diubah menjadi text-[#2C363C] */}
                            <p className={`text-5xl md:text-6xl font-bold ${primaryTextColor} mb-2`} style={{ fontFamily: "Markazi Text, serif" }}>02</p>
                            {/* ✅ PERUBAHAN 6: Bulan/Tahun diubah menjadi text-[#2C363C] */}
                            <p className={`text-xl ${primaryTextColor} mb-4`} style={{ fontFamily: "Markazi Text, serif" }}>Februari 2029</p>
                            
                            {/* Waktu dan Lokasi */}
                            {/* ✅ PERUBAHAN 7: Waktu diubah menjadi text-[#2C363C] */}
                            <p className={`${primaryTextColor} mb-4`} style={{ fontFamily: "Markazi Text, serif" }}>Pukul 08.00 - Selesai</p>
                            {/* ✅ PERUBAHAN 8: Ikon lokasi dan teks lokasi diubah menjadi text-[#2C363C] */}
                            <div className={`flex items-center justify-center ${primaryTextColor} mb-4`}>
                                {/* ✅ PERUBAHAN: Warna stroke ikon diubah menjadi #2C363C */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke={buttonColor} strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span style={{ fontFamily: "Markazi Text, serif" }}>Kediaman Mempelai Wanita</span>
                            </div>
                            
                            {/* ✅ PERUBAHAN 9: Tombol Klik Maps diubah menggunakan buttonColor (#2C363C) dan hoverColor (#1F282C) */}
                            <a 
                                href={mapLink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center px-6 py-3 text-white text-sm font-medium rounded-full shadow-lg transition-colors"
                                style={{ backgroundColor: buttonColor }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = buttonHoverColor)}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = buttonColor)}
                            >
                                <span style={{fontFamily: "Markazi Text, serif"}}>Klik Maps</span>
                            </a>
                        </div>

                        {/* Divider antara dua event (warna disesuaikan) */}
                        {/* ✅ PERUBAHAN 10: Divider diubah menjadi bg-[#2C363C] */}
                        <div className="w-16 h-0.5 bg-[#2C363C] mx-auto my-12 md:my-16"></div>

                        {/* RESEPSI */}
                        <div>
                            {/* Ikon cincin */}
                            {/* ✅ PERUBAHAN 11: Ikon cincin dan border diubah menjadi text-[#2C363C] dan border-[#2C363C] */}
                            <div className={`mb-4 ${primaryTextColor} mx-auto w-12 h-12 flex items-center justify-center rounded-full border border-[#2C363C]`}>
                                💍
                            </div>
                            
                            {/* ✅ PERUBAHAN 12: Judul 'Resepsi' diubah menjadi text-[#2C363C] */}
                            <h3 className={`text-4xl md:text-5xl font-script ${primaryTextColor} mb-6`} style={{ fontFamily: "Markazi Text, serif" }}>
                                Resepsi
                            </h3>
                            {/* ✅ PERUBAHAN 13: Hari diubah menjadi text-[#2C363C] */}
                            <p className={`text-xl ${primaryTextColor} mb-2`} style={{ fontFamily: "Markazi Text, serif" }}>Minggu</p>
                            {/* ✅ PERUBAHAN 14: Divider horizontal diubah menjadi border-[#2C363C] */}
                            <hr className="w-16 mx-auto border-[#2C363C] mb-2" />
                            {/* ✅ PERUBAHAN 15: Tanggal diubah menjadi text-[#2C363C] */}
                            <p className={`text-5xl md:text-6xl font-bold ${primaryTextColor} mb-2`} style={{ fontFamily: "Markazi Text, serif" }}>03</p>
                            {/* ✅ PERUBAHAN 16: Bulan/Tahun diubah menjadi text-[#2C363C] */}
                            <p className={`text-xl ${primaryTextColor} mb-4`} style={{ fontFamily: "Markazi Text, serif" }}>Februari 2029</p>
                            
                            {/* Waktu dan Lokasi */}
                            {/* ✅ PERUBAHAN 17: Waktu diubah menjadi text-[#2C363C] */}
                            <p className={`${primaryTextColor} mb-4`} style={{ fontFamily: "Markazi Text, serif" }}>Pukul 08.00 - Selesai</p>
                            {/* ✅ PERUBAHAN 18: Ikon lokasi dan teks lokasi diubah menjadi text-[#2C363C] */}
                            <div className={`flex items-center justify-center ${primaryTextColor} mb-4`}>
                                {/* ✅ PERUBAHAN: Warna stroke ikon diubah menjadi #2C363C */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke={buttonColor} strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span style={{ fontFamily: "Markazi Text, serif" }}>Kediaman Mempelai Wanita</span>
                            </div>
                            
                            {/* ✅ PERUBAHAN 19: Tombol Klik Maps diubah menggunakan buttonColor (#2C363C) dan hoverColor (#1F282C) */}
                            <a 
                                href={mapLink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center px-6 py-3 text-white text-sm font-medium rounded-full shadow-lg transition-colors"
                                style={{ backgroundColor: buttonColor }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = buttonHoverColor)}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = buttonColor)}
                            >
                                <span style={{fontFamily: "Markazi Text, serif"}}>Klik Maps</span>
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default EventSection;