import React, { useState, useEffect, FC } from 'react';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth'; 
import { auth, db } from '../firebase/config';
import { 
    collection, query, onSnapshot, addDoc, 
    Timestamp, orderBy, CollectionReference, DocumentData, 
    deleteDoc, doc 
} from 'firebase/firestore'; 

// --- Tipe Data untuk RSVP ---
interface RsvpData {
    id: string; 
    name: string;
    attendance: 'yes' | 'no' | 'maybe';
    message: string;
    createdAt: Timestamp | null;
    userId: string;
}

// Konstanta untuk batas tampilan awal dan langkah pemuatan
const INITIAL_LIMIT = 5; 
const LOAD_MORE_STEP = 5;  

// ------------------------------------------------------------------
// PENGATURAN WARNA BARU SESUAI PERMINTAAN
// ------------------------------------------------------------------
const BACKGROUND_COLOR = '#94AAB7';          // Warna background utama
const NEW_COLOR = '#2C363C';                 // Warna Utama (judul, label, tombol, nama, pesan)
const NEW_COLOR_LIGHT = '#414C52';           // Warna untuk Hover/Efek sedikit terang
const TEXT_WHITE_COLOR = '#FFFFFF';          // Warna Putih
const SHADOW_BASE_COLOR = NEW_COLOR;         // Warna dasar shadow
const NEW_COLOR_SHADOW_STRONG = `${SHADOW_BASE_COLOR}70`; // Shadow kuat untuk box (Opacity 70%)
const NEW_COLOR_SHADOW_MEDIUM = `${SHADOW_BASE_COLOR}40`; // Shadow sedang untuk tombol & list (Opacity 40%)
// ------------------------------------------------------------------


// Komponen Utama Aplikasi
const RSVPSection: FC = () => {
    // --- State Management ---
    const [guestName, setGuestName] = useState<string>('');
    const [attendance, setAttendance] = useState<'yes' | 'no' | ''>('');
    const [messages, setMessages] = useState<RsvpData[]>([]); 
    const [message, setMessage] = useState<string>('');
    const [userId, setUserId] = useState<string | null>(null); 
    const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
    const [submitStatus, setSubmitStatus] = useState<string>('Menghubungkan ke database...');
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(true);
    const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT); 

    const PUBLIC_COLLECTION_PATH = `rsvps`;

    // UTILITY: Mengambil nilai 'to' dari URL
    const getGuestNameFromUrl = (): string => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const name = params.get('to');
            return name ? decodeURIComponent(name.replace(/\+/g, ' ')) : '';
        }
        return '';
    };

    // Fungsi Otentikasi dan Pengaturan State
    const handleAuth = async (initialUser: User | null) => {
        try {
            let user: User | null = initialUser;
            if (!user) {
                const result = await signInAnonymously(auth);
                user = result.user;
            }
            if (user) {
                setUserId(user.uid);
                // Status awal koneksi disembunyikan di UI, tapi state ini penting
                setSubmitStatus("Tersambung dan siap."); 
            } else {
                setSubmitStatus("Error: Gagal otentikasi.");
            }
        } catch (error) {
            console.error("Firebase authentication error:", error);
            setSubmitStatus("Error: Gagal otentikasi. Cek konfigurasi Firebase Auth.");
        } finally {
            setIsAuthReady(true);
        }
    };

    // 1. Otentikasi, Mendapatkan UserId, dan Mengisi Nama Tamu
    useEffect(() => {
        const urlName = getGuestNameFromUrl();
        if (urlName) {
            setGuestName(urlName);
        }
        if (!auth) {
            setSubmitStatus("Error: Firebase Auth tidak diinisialisasi.");
            setIsAuthReady(true);
            return;
        }
        let isMounted = true; 
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!isMounted) return;
            if (!isAuthReady) { 
                handleAuth(user);
            }
        });
        return () => {
            isMounted = false;
            unsubscribe();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 2. Mendengarkan Pesan Secara Real-time (onSnapshot)
    useEffect(() => {
        if (!isAuthReady || !db) return;
        
        setIsLoadingMessages(true);
        // setSubmitStatus("Memuat ucapan..."); // Baris ini tidak perlu karena disembunyikan

        try {
            const rsvpsCol = collection(db, PUBLIC_COLLECTION_PATH) as CollectionReference<DocumentData>;
            const q = query(rsvpsCol, orderBy('createdAt', 'desc')); 

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const fetchedMessages: RsvpData[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    fetchedMessages.push({
                        id: doc.id,
                        name: data.name || 'Anonim',
                        attendance: (['yes', 'no'].includes(data.attendance) ? data.attendance : 'maybe') as 'yes' | 'no' | 'maybe',
                        message: data.message || 'Tidak ada pesan',
                        createdAt: data.createdAt instanceof Timestamp ? data.createdAt : null,
                        userId: data.userId || 'unknown',
                    });
                });

                setMessages(fetchedMessages); 
                setIsLoadingMessages(false);
                
                // Status koneksi real-time disembunyikan, hanya update jika error/berhasil
                if (!submitStatus.toLowerCase().includes('error') && !submitStatus.toLowerCase().includes('berhasil')) {
                    // Set status tersambung, tapi tidak akan terlihat di UI
                    setSubmitStatus(`Tersambung, ${fetchedMessages.length} ucapan dimuat.`); 
                }
            }, (error) => {
                console.error("Error mendengarkan koleksi RSVP:", error);
                setIsLoadingMessages(false);
                setSubmitStatus("Error: Gagal memuat pesan real-time. Cek aturan 'read'.");
            });

            return () => unsubscribe();

        } catch (error) {
            console.error("Error setting up onSnapshot:", error);
            setIsLoadingMessages(false);
            setSubmitStatus("Error: Gagal menyiapkan listener database.");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthReady]); 

    // --- FUNGSI UNTUK LOAD MORE/VIEW LESS ---
    const handleLoadMore = () => {
        setDisplayLimit((prevLimit: number) => prevLimit + LOAD_MORE_STEP); 
    };

    const handleViewLess = () => {
        setDisplayLimit(INITIAL_LIMIT); 
    };

    // Ambil pesan yang akan ditampilkan
    const messagesToDisplay = messages.slice(0, displayLimit);
    const hasMoreMessages = messages.length > displayLimit;
    const isExpanded = displayLimit > INITIAL_LIMIT;


    // 3. Handler Pengiriman Formulir (Create)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId || !db) {
            console.error("Pengiriman dibatalkan. userId:", userId, "isAuthReady:", isAuthReady); 
            setSubmitStatus("Otentikasi belum selesai. Mohon tunggu 'Connecting...' hilang dan coba lagi.");
            return;
        }

        if (guestName.trim() === '' || attendance === '' || message.trim() === '') {
            setSubmitStatus("Mohon isi semua kolom yang wajib.");
            return;
        }

        setSubmitStatus("Mengirim...");

        try {
            const rsvpsCol = collection(db, PUBLIC_COLLECTION_PATH);

            const newRsvpData = {
                name: guestName.trim(),
                userId: userId,
                attendance: attendance as 'yes' | 'no' | 'maybe',
                guests: 1, 
                message: message.trim(),
                createdAt: Timestamp.now(), 
            };
            
            await addDoc(rsvpsCol, newRsvpData);

            if (!getGuestNameFromUrl()) {
                setGuestName(''); 
            }
            setAttendance('');
            setMessage('');
            setSubmitStatus("Berhasil Dikirim! Terima kasih. Ucapan Anda akan segera muncul.");

        } catch (error) {
            console.error("Error menambahkan dokumen:", error);
            setSubmitStatus(`Error mengirim: Gagal menyimpan data. Cek lagi aturan 'create' Firestore. Detail: ${(error as Error).message}`); 
        }
    };
    
    // 4. Handler Penghapusan Pesan (Delete)
    const handleDeleteMessage = async (messageId: string) => { 
        if (!userId || !db) {
            setSubmitStatus("Pengguna belum terautentikasi.");
            return;
        }

        if (window.confirm("Apakah Anda yakin ingin menghapus ucapan Anda? Tindakan ini tidak dapat dibatalkan.")) {
            setSubmitStatus("Menghapus pesan...");
            try {
                const messageRef = doc(db, PUBLIC_COLLECTION_PATH, messageId);
                
                await deleteDoc(messageRef); 

                setSubmitStatus("Pesan berhasil dihapus.");
            } catch (error) {
                console.error("Error menghapus dokumen:", error);
                setSubmitStatus(`Error menghapus: Gagal menghapus data. Anda hanya bisa menghapus pesan milik Anda.`); 
            }
        }
    };

    // Utilitas untuk format timestamp
    const formatTimestamp = (timestamp: Timestamp | null): string => { 
        if (!timestamp) return 'Baru saja';
        try {
            const date = timestamp.toDate();
            return date.toLocaleString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return 'Baru saja';
        }
    };
    
    // UI Rendering
    return (
        <div className="min-h-screen">
            <style>
                {/* Definisi CSS kustom di sini untuk Focus Ring dan Hover */}
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Markazi+Text:wght@400..700&family=Inter:wght@100..900&display=swap');
                    .font-markazi {
                        font-family: 'Markazi Text', serif;
                        font-optical-sizing: auto;
                        font-weight: 500;
                    }
                    * {
                        font-family: 'Inter', sans-serif;
                    }
                    /* Class khusus untuk Focus Ring yang menggunakan warna dinamis NEW_COLOR */
                    .focus-ring-custom:focus {
                        outline: none;
                        border-color: ${NEW_COLOR}; 
                        box-shadow: 0 0 0 3px ${NEW_COLOR_SHADOW_MEDIUM}; /* Ring shadow manual */
                    }
                    /* Class khusus untuk hover tombol utama */
                    .hover-bg-custom:hover {
                        background-color: ${NEW_COLOR_LIGHT}; /* Warna hover sedikit lebih terang */
                    }
                `}
            </style>
            
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            
            {/* Background section menggunakan BACKGROUND_COLOR */}
            <section className="py-12 md:py-20 min-h-screen flex items-center justify-center" style={{ backgroundColor: BACKGROUND_COLOR }}> 
                <div className="container mx-auto px-4 w-full max-w-4xl">
                    
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="mb-4">
                        <img 
                            src="/assets/images/doa.png" 
                            alt="Doa" 
                            className="mx-auto max-w-[200px] md:max-w-[280px]"
                            onError={(e) => e.currentTarget.style.display = 'none'} 
                        />
                        </div>
                        
                        {/* Teks ini berwarna putih */}
                        <p className="text-l max-w-2xl mx-auto tracking-wider font-markazi" style={{ color: TEXT_WHITE_COLOR }}>
                            Tolong konfirmasi kehadiran sebelum tanggal 06 Juni 2025
                        </p>
                    </div>

                    {/*
                        STATUS MESSAGE MODIFIKASI:
                        Hanya tampilkan jika status mengandung 'error' atau 'berhasil'
                    */}
                    {(submitStatus.toLowerCase().includes('error') || submitStatus.toLowerCase().includes('berhasil')) && (
                        <div className={`max-w-2xl mx-auto mb-4 p-4 rounded-lg text-center font-medium text-base ${submitStatus.toLowerCase().includes('error') ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                            {submitStatus}
                        </div>
                    )}
                    
                    {/* Form Card */}
                    <div 
                        className="max-w-2xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-2xl"
                        // Shadow box menggunakan NEW_COLOR_SHADOW_STRONG
                        style={{ boxShadow: `0 25px 50px -12px ${NEW_COLOR_SHADOW_STRONG}` }} 
                    >
                        {/* Header form menggunakan NEW_COLOR */}
                        <h1 className="font-bold mb-6 text-center font-markazi text-3xl md:text-4xl" style={{ color: NEW_COLOR }}>Konfirmasi & Ucapan</h1>
                        <form onSubmit={handleSubmit}>
                            {/* Nama */}
                            <div className="mb-6">
                                {/* Label form menggunakan NEW_COLOR */}
                                <label htmlFor="name" className="block mb-2 font-semibold text-sm md:text-base font-markazi" style={{ color: NEW_COLOR }}>
                                    Nama Anda
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    readOnly={getGuestNameFromUrl() !== ''} 
                                    // Border dan focus ring menggunakan NEW_COLOR
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-ring-custom text-sm md:text-base text-black transition disabled:bg-gray-100"
                                    style={{ borderColor: NEW_COLOR }} 
                                    placeholder="Tamu Undangan"
                                    required
                                />
                                {getGuestNameFromUrl() !== '' && (
                                    <p className="text-xs text-gray-500 mt-1">Nama ini diambil dari link undangan.</p>
                                )}
                            </div>
                            
                            {/* Attendance */}
                            <div className="mb-6">
                                {/* Label form menggunakan NEW_COLOR */}
                                <p className="mb-3 font-semibold text-sm md:text-base font-markazi" style={{ color: NEW_COLOR }}>Apakah anda akan hadir?</p>
                                <div className="flex space-x-6">
                                    {/* Ya */}
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="attending-yes"
                                            name="attendance"
                                            checked={attendance === 'yes'}
                                            onChange={() => setAttendance('yes')}
                                            // Warna radio button menggunakan NEW_COLOR
                                            className="mr-2 h-5 w-5 border-gray-300 focus:ring-2"
                                            style={{ accentColor: NEW_COLOR }} 
                                            required
                                        />
                                        <label htmlFor="attending-yes" className="text-gray-700 text-sm md:text-base font-markazi">
                                            Ya, saya akan hadir.
                                        </label>
                                    </div>
                                    {/* Tidak */}
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="attending-no"
                                            name="attendance"
                                            checked={attendance === 'no'}
                                            onChange={() => setAttendance('no')}
                                            // Warna radio button menggunakan NEW_COLOR
                                            className="mr-2 h-5 w-5 border-gray-300 focus:ring-2"
                                            style={{ accentColor: NEW_COLOR }} 
                                            required
                                        />
                                        <label htmlFor="attending-no" className="text-gray-700 text-sm md:text-base font-markazi">
                                            Tidak, saya tidak akan hadir.
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Pesan */}
                            <div className="mb-8">
                                {/* Label form menggunakan NEW_COLOR */}
                                <label htmlFor="message" className="block mb-2 font-semibold text-sm md:text-base font-markazi" style={{ color: NEW_COLOR }}> 
                                    Pesan (Ucapan & Doa)
                                </label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={4}
                                    // Border dan focus ring menggunakan NEW_COLOR
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-ring-custom text-sm md:text-base text-black transition"
                                    style={{ borderColor: NEW_COLOR }} 
                                    placeholder="Bagikan Ucapan Kepada Mempelai" 
                                    required
                                ></textarea>
                            </div>

                            {/* Tombol Submit */}
                            <button
                                type="submit"
                                disabled={!isAuthReady || !userId} 
                                // Latar belakang dan hover tombol menggunakan NEW_COLOR
                                className="w-full text-white font-medium py-2 px-4 rounded-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover-bg-custom text-sm md:text-base"
                                style={{ 
                                    backgroundColor: NEW_COLOR, 
                                    // Shadow tombol menggunakan NEW_COLOR_SHADOW_MEDIUM
                                    boxShadow: `0 4px 6px -1px ${NEW_COLOR_SHADOW_MEDIUM}, 0 2px 4px -2px ${NEW_COLOR_SHADOW_MEDIUM}` 
                                }}
                            >
                                {/* MODIFIKASI TEKS TOMBOL: Selalu tampilkan "Kirim Ucapan dan Doa" */}
                                Kirim Ucapan dan Doa
                            </button>
                        </form>
                    </div>

                    {/* Daftar Ucapan */}
                    {(messages.length > 0 || isLoadingMessages) && (
                        <div className="max-w-2xl mx-auto mt-12">
                            <h3 
                                // Teks "Ucapan & Doa Restu" berwarna putih
                                className="text-2xl font-bold mb-6 text-center font-markazi"
                                style={{ color: TEXT_WHITE_COLOR }}
                            >
                                Ucapan & Doa Restu ({messages.length})
                            </h3>
                            
                            {isLoadingMessages && messages.length === 0 ? (
                                <div className='text-center text-white text-lg font-medium'>Memuat ucapan...</div>
                            ) : (
                                <ul className="space-y-4 p-2"> 
                                    {messagesToDisplay.map((msg: RsvpData) => ( 
                                        <li key={msg.id} 
                                            // Border Top dan Shadow menggunakan NEW_COLOR
                                            className="bg-white p-5 rounded-xl shadow-xl"
                                            style={{ 
                                                borderTop: `8px solid ${NEW_COLOR}`,
                                                // Shadow list menggunakan NEW_COLOR_SHADOW_MEDIUM
                                                boxShadow: `0 4px 6px -1px ${NEW_COLOR_SHADOW_MEDIUM}, 0 2px 4px -2px ${NEW_COLOR_SHADOW_MEDIUM}`
                                            }}>
                                            <div className='flex justify-between items-start mb-2'>
                                                <p 
                                                    // Warna teks nama "Arek Ganteng" dan "Husnul Khotima Yudis" menggunakan NEW_COLOR
                                                    className="font-bold text-xl font-markazi"
                                                    style={{ color: NEW_COLOR }}>
                                                    {msg.name} 
                                                </p>
                                                <span className={`ml-4 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${msg.attendance === 'yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {msg.attendance === 'yes' ? 'Hadir' : (msg.attendance === 'no' ? 'Tidak Hadir' : 'Maybe')}
                                                </span>
                                            </div>
                                            
                                            <p className="text-gray-700 text-base italic leading-relaxed mb-3 font-markazi">
                                                "{msg.message}"
                                            </p>
                                            
                                            <div className='flex justify-between items-center border-t pt-2'>
                                                
                                                {/* KONTROL KONDISIONAL: Tombol HAPUS hanya muncul untuk pemilik pesan */}
                                                {msg.userId === userId && (
                                                    <button 
                                                        onClick={() => handleDeleteMessage(msg.id)}
                                                        className='text-[10px] text-red-600 hover:text-red-800 font-medium py-0.5 px-1 rounded-sm transition border border-transparent hover:border-red-600'
                                                    >
                                                        ❌ Hapus
                                                    </button>
                                                )}

                                                {/* Timestamp */}
                                                <p className={`text-xs text-gray-500 text-right ${msg.userId === userId ? '' : 'w-full'}`}>
                                                    {formatTimestamp(msg.createdAt)}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* KONTROL TOMBOL DI BAWAH LIST */}
                            {(hasMoreMessages || isExpanded) && ( 
                                <div className='text-center mt-6 flex justify-center space-x-4'>
                                    
                                    {/* TOMBOL "LIHAT LEBIH SEDIKIT" */}
                                    {isExpanded && (
                                        <button
                                            onClick={handleViewLess}
                                            // Warna tombol View Less dan Shadow baru menggunakan NEW_COLOR
                                            className="bg-gray-200 font-medium py-1.5 px-3 rounded-lg transition duration-300 shadow-md text-sm"
                                            style={{ 
                                                color: NEW_COLOR, 
                                                boxShadow: `0 4px 6px -1px ${NEW_COLOR_SHADOW_MEDIUM}, 0 2px 4px -2px ${NEW_COLOR_SHADOW_MEDIUM}` 
                                            }}
                                        >
                                            Lihat Lebih Sedikit ({INITIAL_LIMIT})
                                        </button>
                                    )}

                                    {/* TOMBOL "LOAD MORE" */}
                                    {hasMoreMessages && (
                                        <button
                                            onClick={handleLoadMore}
                                            // Warna tombol Load More dan Shadow baru menggunakan NEW_COLOR
                                            className="bg-white font-medium py-1.5 px-3 rounded-lg transition duration-300 shadow-md text-sm"
                                            style={{ 
                                                color: NEW_COLOR, 
                                                boxShadow: `0 4px 6px -1px ${NEW_COLOR_SHADOW_MEDIUM}, 0 2px 4px -2px ${NEW_COLOR_SHADOW_MEDIUM}` 
                                            }}
                                        >
                                            Lihat {Math.min(LOAD_MORE_STEP, messages.length - displayLimit)} Ucapan Lainnya
                                        </button>
                                    )}
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default RSVPSection;