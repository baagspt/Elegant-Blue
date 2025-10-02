import React from 'react';

const BrideSection: React.FC = () => {
    // Warna #2C363C adalah Hijau Tua Keabu-abuan.
    const primaryTextColor = "text-[#2C363C]";
    const primaryColor = "#2C363C"; 

    return (
        // Gradien dari #2C363C/100 (atas) ke #79919E (bawah).
        // ✅ PERUBAHAN: Warna gradien atas diubah
        <section className="pt-0 pb-0 bg-gradient-to-b from-[#2C363C]/100 to-[#79919E]"> 
            
            <div className="container mx-auto px-4 pt-20"> 
            
                {/* Card Putih Utama */}
                <div 
                    className="rounded-t-3xl shadow-2xl overflow-hidden w-full mx-auto max-w-2xl"
                    style={{ backgroundColor: '#FFFFFF' }} 
                >
                    
                    {/* The Groom section - Konten di dalam card */}
                    <div className="text-center px-4 pt-12 pb-12">
                    
                        {/* ======================================= */}
                        {/* START: Penambahan Teks OUR WEDDING dan Undangan */}
                        {/* ======================================= */}
                        
                        {/* ✅ PERUBAHAN Teks: OUR WEDDING */}
                        <p className={`text-3xl md:text-4xl font-semibold tracking-widest ${primaryTextColor} mb-2`} style={{fontFamily: "Markazi Text, serif"}}>
                            OUR WEDDING
                        </p>
                        
                        {/* ✅ PERUBAHAN Teks: Pesan Undangan */}
                        <p className={`${primaryTextColor} text-sm italic mb-10 mx-auto max-w-md`} style={{fontFamily: "Markazi Text, serif"}}>
                            Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/I untuk menghadiri acara Pernikahan kami.
                        </p>
                        
                        {/* ======================================= */}
                        {/* END: Penambahan Teks OUR WEDDING dan Undangan */}
                        {/* ======================================= */}

                        {/* Divider di atas judul */}
                        <div className="flex justify-center mt-4 mb-6">
                            {/* ✅ PERUBAHAN Warna: Divider */}
                            <div className="w-10 h-0.5" style={{ backgroundColor: primaryColor }}></div>
                        </div>
                        
                        {/* ✅ PERUBAHAN Teks: Judul The Bride */}
                        <h2 className={`text-3xl md:text-4xl font-medium ${primaryTextColor} mt-6 mb-6`} style={{fontFamily: "Markazi Text, serif"}}>The Bride</h2> 
                        
                    </div>
                    
                    {/* Foto dan Nama */}
                    <div className="flex flex-col items-center px-4">
                    
                        {/* BINGKAI FOTO MELENGKUNG */}
                        <div 
                            className="relative overflow-hidden mx-auto mb-6"
                            style={{
                                width: 'min(90%, 28rem)', 
                                aspectRatio: '7 / 10', 
                                // ✅ PERUBAHAN Warna: Border Foto
                                border: `4px solid ${primaryColor}`, 
                                backgroundColor: '#f0f0f0', 
                                borderRadius: '20rem 20rem 0 0', 
                            }}
                        >
                            <img 
                                src="/assets/images/bride.png" 
                                alt="Groom" 
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                        {/* Akhir Bingkai Foto Melengkung */}
                        
                        {/* ✅ PERUBAHAN Teks: Nama */}
                        <h3 className={`text-2xl md:text-3xl font-medium ${primaryTextColor} mb-2`} style={{fontFamily: "Markazi Text, serif"}}>Pacar </h3>
                        
                        {/* ✅ PERUBAHAN Teks: Putrid Pertama */}
                        <p className={`${primaryTextColor} mb-4`} style={{fontFamily: "Markazi Text, serif"}}>Putri Pertama Dari Keluarga</p>
                        
                        {/* ✅ PERUBAHAN Teks: Nama Orang Tua */}
                        <p className={`${primaryTextColor} mb-0 pb-12`} style={{fontFamily: "Markazi Text, serif"}}>Bapak Milenia & Ibu Story</p> 
                        
                    </div>
                </div>
                
            </div>
        </section>
    );
};

export default BrideSection;