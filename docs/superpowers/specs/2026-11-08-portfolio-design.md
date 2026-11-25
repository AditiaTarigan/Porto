# Portofolio Developer dengan Keyboard Three.js Persisten

## Tujuan

Mengadaptasi portofolio satu halaman menjadi showcase developer dengan keyboard Three.js 3D sebagai elemen visual utama. Satu canvas keyboard tetap berada di layar dan berubah pose ketika pengunjung berpindah antarbagian Home, Skills, Projects, dan Contact.

## Sasaran

- Tema hampir hitam dengan bintang halus, tipografi tebal, keycap warna-warni, dan bayangan keyboard lembut.
- Grid 5×5 berisi 25 keycap dengan mark/logo teknologi yang dapat diubah melalui data lokal.
- Hover mengangkat keycap; klik, tap, atau hotkey menekan keycap, menunjukkan nama teknologi dan kalimat santai, lalu melepasnya saat interaksi berakhir.
- Pose keyboard berubah saat scroll: kecil di Hero, besar dan isometrik di Skills, kecil di Projects, lalu menyamping dan kecil di Contact.
- Ada indikator/preloader singkat, maskot kucing SVG di Projects, carousel empat kartu proyek, formulir Contact tervalidasi, dan footer sosial.
- Responsif, tetap dapat dibaca tanpa WebGL, DPR dibatasi, resource Three.js dibersihkan, dan gerakan berat dihormati saat `prefers-reduced-motion` aktif.
- README menjelaskan cara menjalankan proyek dan mengganti konten lokal.

## Batasan dan keputusan teknologi

- Pertahankan proyek yang ada: Next.js 16.4.5 App Router, React 19, TypeScript, Tailwind CSS 4, dan Three.js langsung.
- Jangan migrasi ke Vite dan jangan menambah React Three Fiber, Drei, GSAP, Framer Motion, Lenis, layanan backend, atau paket animasi lain.
- Gunakan event scroll browser dan `requestAnimationFrame` untuk satu timeline pose keyboard; DOM section tetap semantic dan berada di atas canvas tetap.
- Tidak ada kontak, sosial, atau URL proyek asli yang diberikan. Simpan URL kosong dan tampilkan tombol nonaktif sampai pemilik mengisinya.
- Email contoh dari brief adalah `email@contoh.com`; tampilkan sebagai contoh yang bisa diedit dan gunakan `mailto:` tanpa backend.
- Daftar teknologi dalam brief dipakai sebagai data awal yang mudah diganti; pemilik perlu menyesuaikan daftar akhir dengan keahlian nyata.

## Rancangan bagian

- **Navbar:** Home, Skills, Projects, Contact; semua menuju anchor dalam satu halaman.
- **Hero:** nama besar dan peran di kiri; keyboard 3D kecil di kanan; indikator scroll.
- **Skills:** judul besar, petunjuk menekan tombol, keyboard 5×5 di tengah, teknologi aktif di sisi kiri.
- **Projects:** keyboard mengecil dan naik; maskot kucing SVG mengetik saat keycap ditekan; carousel empat kartu dengan thumbnail, nama, ringkasan, tag, dan tautan opsional.
- **Contact:** judul LET'S WORK TOGETHER, form name/email/message tervalidasi, state membuka draf email, alamat contoh yang bisa diganti.
- **Footer:** ikon/label GitHub, LinkedIn, X, Instagram; tautan aktif hanya untuk URL yang diisi.

## Gaya interaksi

- Keycap memakai material warna glossy dan mark teknologi berkontras tinggi.
- Hover mengangkat keycap dan menambah emisi; tekan memakai interpolasi spring sederhana dan suara tetap nonaktif secara default.
- Tombol keyboard berfungsi melalui hotkey lokal yang unik; pointer/touch memicu keycap yang sama.
- Satu kanvas fixed tetap hidup sepanjang halaman. Scroll mengubah transform keyboard berdasarkan posisi section dengan interpolasi lembut.
- Stiker mengikuti pointer di desktop; tap tetap menjadi interaksi utama di layar sentuh.
- Preloader menunjukkan progres keycap yang dibentuk lokal; tidak menunggu jaringan atau aset remote.

## Konten awal

- Nama profil yang sudah tersedia dipertahankan. Peran, perkenalan, dan daftar keahlian tetap mudah diedit.
- Empat proyek contoh dibuat sebagai dummy; URL demo/source kosong sampai diganti.
- Email contoh dan URL sosial kosong harus diberi label yang jelas agar tidak tampak sebagai detail nyata.

## Persetujuan

Revisi pengguna pada 2026-11-08: pertahankan teknologi proyek yang sudah dibuat dan sesuaikan desain serta fitur lain ke brief client.
