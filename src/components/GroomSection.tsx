import React from 'react';

const GroomSection: React.FC = () => {
    // Definisi warna utama agar mudah diubah
    const primaryTextColor = "text-[#2C363C]";
    const primaryColor = "#2C363C"; 

    return (
        // Latar belakang section tetap sama
        <section className="pt-0 pb-20" style={{ backgroundColor: '#79919E' }}>
            
            <div className="container mx-auto px-4">
            
                {/* Card Putih Utama */}
                <div 
                    className="rounded-b-3xl shadow-2xl overflow-hidden w-full mx-auto max-w-2xl"
                    style={{ backgroundColor: '#FFFFFF' }} 
                >
                    
                    {/* The Groom section - Konten di dalam card */}
                    <div className="text-center px-4 pt-12 pb-12">
                    
                        {/* ======================================= */}
                        {/* START: Area Teks Undangan (Sekarang Kosong) */}
                        {/* ======================================= */}
                        
                        {/* Paragraf Undangan yang berisi "Tanpa mengurangi rasa hormat..." sudah dihapus. */}
                        
                        {/* ======================================= */}
                        {/* END: Area Teks Undangan */}
                        {/* ======================================= */}

                        {/* Divider di atas judul */}
                        <div className="flex justify-center mt-4 mb-6">
                            {/* ✅ PERUBAHAN 1: Divider diubah menjadi bg-[#2C363C] */}
                            <div className="w-10 h-0.5" style={{ backgroundColor: primaryColor }}></div>
                        </div>
                        
                        {/* Judul The Groom */}
                        {/* ✅ PERUBAHAN 2: Judul 'The Groom' diubah menjadi text-[#2C363C] */}
                        <h2 className={`text-3xl md:text-4xl font-medium ${primaryTextColor} mt-6 mb-6`} style={{fontFamily: "Markazi Text, serif"}}>The Groom</h2> 
                        
                    </div>
                    
                    {/* Foto dan Nama */}
                    <div className="flex flex-col items-center px-4">
                    
                        {/* BINGKAI FOTO MELENGKUNG (SEPERTI BRIDE SECTION) */}
                        <div 
                            className="relative overflow-hidden mx-auto mb-6"
                            style={{
                                // Menjaga lebar keseluruhan (sama dengan Bride Section)
                                width: 'min(90%, 28rem)', 
                                
                                // MENGGUNAKAN ASPECT RATIO untuk mengatur dimensi
                                aspectRatio: '7 / 10', // Rasio panjang yang disepakati (mis. 3.5 / 5)
                                
                                // ✅ PERUBAHAN Warna: Border Foto
                                border: `4px solid ${primaryColor}`, 
                                backgroundColor: '#f0f0f0', 
                                
                                // KUNCI PERUBAHAN: Menggunakan radius besar di kiri-atas dan kanan-atas
                                borderRadius: '20rem 20rem 0 0', 
                            }}
                        >
                            <img 
                                src="/assets/images/groom.png" 
                                alt="Groom" 
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                        {/* Akhir Bingkai Foto Melengkung */}
                        
                        {/* ✅ PERUBAHAN 3: Nama 'Yudhistira' diubah menjadi text-[#2C363C] */}
                        <h3 className={`text-2xl md:text-3xl font-medium ${primaryTextColor} mb-2`} style={{fontFamily: "Markazi Text, serif"}}>Yudhistira</h3>
                        
                        {/* ✅ PERUBAHAN 4: Teks 'Putra Kedua Dari Keluarga' diubah menjadi text-[#2C363C] */}
                        <p className={`${primaryTextColor} mb-4`} style={{fontFamily: "Markazi Text, serif"}}>Putra Kedua Dari Keluarga</p>
                        
                        {/* ✅ PERUBAHAN 5: Teks 'Bapak Milenia & Ibu Story' diubah menjadi text-[#2C363C] */}
                        <p className={`${primaryTextColor} mb-0 pb-12`} style={{fontFamily: "Markazi Text, serif"}}>Bapak Milenia & Ibu Story</p>
                    </div>
                </div>
                
            </div>
        </section>
    );
};

export default GroomSection;