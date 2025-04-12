// typing.js - Logic for Typing Ganteng Generator (JSON Loading Version)

(function() {
    // Variabel untuk menyimpan kamus dan status pemuatan
    let slangDictionary = null;
    let dictionaryLoaded = false;
    let dictionaryError = false;

    // Variabel untuk elemen DOM
    let inputText, generateButton, outputResult, copyButton;

    // --- Fungsi Asinkron untuk Memuat Kamus ---
    async function loadDictionary() {
        // Tampilkan status loading ke pengguna
        if (outputResult) {
            outputResult.textContent = 'Memuat kamus kata...';
            // Jangan tambahkan visible agar tidak ada animasi scale saat loading
        }
        if (generateButton) generateButton.disabled = true; // Pastikan disable selama loading
        if (copyButton) copyButton.disabled = true;

        try {
            const response = await fetch('kamus.json'); // Ambil file JSON
            if (!response.ok) {
                // Tangani jika file tidak ditemukan atau ada error server
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            slangDictionary = await response.json(); // Parse JSON menjadi objek
            dictionaryLoaded = true;
            console.log("Kamus berhasil dimuat.");

            // Hapus pesan loading & set pesan default jika output kosong
            if (outputResult && outputResult.textContent === 'Memuat kamus kata...') {
               outputResult.textContent = 'Hasil akan muncul di sini...';
            }
             updateButtonStates(); // Aktifkan tombol generate jika ada input

        } catch (error) {
            dictionaryError = true;
            console.error("Gagal memuat kamus:", error);
            if (outputResult) {
                // Tampilkan pesan error yang jelas
                outputResult.textContent = "Error: Gagal memuat kamus kata. Periksa konsol (F12) dan coba muat ulang halaman.";
                outputResult.classList.add('visible'); // Tampilkan pesan error
            }
            // Tombol tetap nonaktif jika kamus gagal dimuat
            if (generateButton) generateButton.disabled = true;
            if (copyButton) copyButton.disabled = true;
        }
    }

    // --- Fungsi Inti Konversi Teks ---
    function generateTypingGanteng(text) {
        // Pastikan kamus sudah dimuat dan tidak ada error
        if (!dictionaryLoaded || dictionaryError) {
            return 'Kamus belum siap atau gagal dimuat. Coba lagi nanti.';
        }
        if (!text) return ''; // Kembalikan string kosong jika input kosong

        let result = text.toLowerCase().trim();

        // 1. Lakukan Penggantian Kata menggunakan Kamus yang Dimuat
        if (slangDictionary) {
             for (const key in slangDictionary) {
                // Escape karakter khusus regex dalam 'key'
                const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                 try {
                    // Buat Regex (\b = word boundary, g = global, i = case-insensitive)
                    const regex = new RegExp(`\\b${escapedKey}\\b`, 'gi');
                    result = result.replace(regex, slangDictionary[key]); // Ganti kata
                 } catch (e) {
                     // Tangani jika ada key yang membuat regex tidak valid (jarang terjadi jika di-escape)
                     console.warn(`Skipping invalid regex for key: ${key}`);
                 }
             }
        }

        // 2. Kurangi Karakter Berulang (Maksimal 2)
        result = result.replace(/([a-zA-Z])\1{2,}/g, '$1$1');
        result = result.replace(/wk(wk)+/gi, 'wkwk');
        result = result.replace(/he(he)+/gi, 'hehe');
        result = result.replace(/ha(ha)+/gi, 'haha');
        result = result.replace(/xi(xi)+/gi, 'hehe'); // xixi -> hehe

        // 3. Lembutkan Vokal (Hati-hati)
        result = result.replace(/\b(iya|iyaa|masa|apa|kenapa|gimana|wah|oh|aduh|halo|hai|situ|sini|kamu|aku|itu|ini)(?![a-z])/gi, (match) => {
             if (/(aa|ii|uu|ee|oo)$/.test(match) && match !== 'iyaa') {
                 return match;
             }
             if (['iya', 'masa', 'apa', 'kenapa', 'gimana', 'wah', 'oh', 'aduh', 'halo', 'hai', 'situ', 'sini'].includes(match)) {
                 return match + 'a';
             }
              if (['kamu', 'aku', 'itu', 'ini'].includes(match) && Math.random() < 0.3) {
                  return match + 'u';
              }
             return match;
        });
        result = result.replace(/\biya\b/g, 'iyaa'); // Pastikan iya -> iyaa

        // 4. Tangani Tanda Baca
        result = result.replace(/([.,?!~;:]){2,}/g, '$1');
        result = result.replace(/\.{2,}/g, '...');
        result = result.replace(/(\s*\.\s*){2,}/g, ' ... ');
        result = result.replace(/\s+([.,?!~;:])\s*/g, '$1 ');
        result = result.trim();

        const trimmedResult = result.trim();
        if (trimmedResult.length > 0 && !/[.?!~…]$/.test(trimmedResult) && !/(wkwk|hehe|haha)$/i.test(trimmedResult)) {
            if (trimmedResult.endsWith('terima kasih') || trimmedResult.endsWith('maaf') || trimmedResult.endsWith('tolong') || trimmedResult.endsWith('selamat') || trimmedResult.endsWith('permisi')) {
                 result += '.';
            } else if (Math.random() < 0.5) {
                result += '~';
            } else {
                result += '.';
            }
        }
        result = result.trim();

        // 5. Kapitalisasi Awal Kalimat
        if (result.length > 0) {
            result = result.charAt(0).toUpperCase() + result.slice(1);
        }

        // 6. Tambahkan Emoji (Opsional & Jarang)
        const endsWithPunctuationOrEllipsis = /[.?!~…]$/.test(result.trim());
        const endsWithLaughter = /(wkwk|hehe|haha)$/i.test(result.trim());
        if (result.length > 0 && !endsWithLaughter && Math.random() < 0.15) {
             if (!endsWithPunctuationOrEllipsis || Math.random() < 0.5) {
                 result += ' ^^';
             }
        }

        // 7. Pembersihan Akhir
        result = result.replace(/\s+/g, ' ').trim();

        return result;
    } // Akhir generateTypingGanteng

    // --- Fungsi Event Handler untuk Tombol Generate ---
    function handleGenerate() {
        // Pastikan semua elemen ada dan kamus siap
        if (!dictionaryLoaded || dictionaryError || !inputText || !outputResult || !copyButton) {
            console.warn("Generate dibatalkan: Elemen hilang atau kamus belum siap.");
            return;
        }

        const originalText = inputText.value;
        const gantengText = generateTypingGanteng(originalText); // Panggil fungsi konversi

        outputResult.textContent = gantengText || 'Tidak ada teks untuk diubah...';
        outputResult.classList.add('visible'); // Tampilkan hasil dengan animasi

        // Atur status tombol salin
        const isResultValid = gantengText && !gantengText.startsWith('Kamus belum siap');
        copyButton.disabled = !isResultValid || gantengText === 'Tidak ada teks untuk diubah...';
        copyButton.textContent = 'Salin Hasil';
        copyButton.className = ''; // Reset style tombol salin
    }

    // --- Fungsi Clipboard (Salin, Fallback, Feedback) ---
    // (Sama seperti versi sebelumnya, tidak perlu diubah)
    function handleCopy() {
        if (!outputResult || !copyButton || copyButton.disabled) return;
        const textToCopy = outputResult.textContent;
        if (!textToCopy || textToCopy === 'Hasil akan muncul di sini...' || textToCopy.startsWith('Kamus belum siap')) {
            return;
        }
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                showCopyFeedback(true);
            }).catch(err => {
                console.warn('Modern Clipboard API gagal, mencoba fallback:', err);
                copyFallback(textToCopy);
            });
        } else {
             console.warn('Modern Clipboard API tidak tersedia, menggunakan fallback.');
             copyFallback(textToCopy);
        }
    }
    function copyFallback(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '-9999px';
        textArea.style.left = '-9999px';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        let success = false;
        try {
            success = document.execCommand('copy');
        } catch (err) {
            console.error('Fallback: Error saat execCommand:', err);
        }
        document.body.removeChild(textArea);
        showCopyFeedback(success);
        if (!success) {
            console.error('Fallback: Gagal menyalin dengan execCommand');
        }
    }
    function showCopyFeedback(success) {
        if (!copyButton || !outputResult) return;
        if (success) {
            copyButton.textContent = 'Berhasil Disalin! ✅';
            copyButton.classList.add('success');
            copyButton.classList.remove('error');
        } else {
            copyButton.textContent = 'Gagal Menyalin ❌';
            copyButton.classList.add('error');
             copyButton.classList.remove('success');
        }
        setTimeout(() => {
            copyButton.textContent = 'Salin Hasil';
            copyButton.className = '';
            const gantengText = outputResult.textContent;
             const isResultValid = gantengText && !gantengText.startsWith('Kamus belum siap');
            copyButton.disabled = !isResultValid || gantengText === 'Tidak ada teks untuk diubah...';
        }, 2000);
    }
    // --- Akhir Fungsi Clipboard ---

    // --- Fungsi untuk Mengatur Status Tombol ---
    function updateButtonStates() {
         if (!generateButton || dictionaryError || !inputText) return;
         const hasInput = inputText.value.trim() !== '';
         // Tombol Generate aktif jika kamus sudah dimuat DAN ada input
         generateButton.disabled = !dictionaryLoaded || !hasInput;
    }

    // --- Inisialisasi Saat DOM Siap ---
    document.addEventListener('DOMContentLoaded', () => {
        // Dapatkan referensi ke elemen DOM
        inputText = document.getElementById('inputText');
        generateButton = document.getElementById('generateButton');
        outputResult = document.getElementById('outputResult');
        copyButton = document.getElementById('copyButton');

        // Tambahkan listener ke tombol generate
        if (generateButton) {
             generateButton.addEventListener('click', handleGenerate);
        }
        // Tambahkan listener ke tombol copy
        if (copyButton) {
             copyButton.addEventListener('click', handleCopy);
        }
        // Tambahkan listener ke input textarea
        if (inputText) {
            inputText.addEventListener('input', () => {
                updateButtonStates(); // Update tombol saat user mengetik

                // Reset output jika input berubah (kecuali saat loading/error)
                 if (outputResult && outputResult.classList.contains('visible') && !outputResult.textContent.startsWith('Memuat kamus') && !outputResult.textContent.startsWith('Error:')) {
                     outputResult.classList.remove('visible');
                     setTimeout(() => {
                        if(!outputResult.textContent.startsWith('Memuat kamus') && !outputResult.textContent.startsWith('Error:')){
                             outputResult.textContent = 'Hasil akan muncul di sini...';
                        }
                     }, 150);
                     if (copyButton) {
                        copyButton.textContent = 'Salin Hasil';
                        copyButton.disabled = true;
                        copyButton.className = '';
                     }
                }
            });
        }

        // Mulai memuat kamus dari JSON
        loadDictionary();
    });

})(); // Akhir IIFE
