// typing.js - Logic for Typing Ganteng Generator (JSON Loading + Improved Rules)

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
            outputResult.textContent = 'Memuat kamus kata (mungkin perlu waktu)...';
        }
        if (generateButton) generateButton.disabled = true;
        if (copyButton) copyButton.disabled = true;

        console.log("Mulai memuat kamus..."); // Debug log
        try {
            const response = await fetch('kamus.json'); // Ambil file JSON
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            slangDictionary = await response.json(); // Parse JSON menjadi objek
            dictionaryLoaded = true;
            console.log(`Kamus berhasil dimuat (${Object.keys(slangDictionary).length} entri).`); // Debug log size

            // Hapus pesan loading & set pesan default jika output kosong
            if (outputResult && outputResult.textContent.startsWith('Memuat kamus')) {
               outputResult.textContent = 'Hasil akan muncul di sini...';
            }
             updateButtonStates(); // Aktifkan tombol generate jika ada input

        } catch (error) {
            dictionaryError = true;
            console.error("Gagal memuat kamus:", error);
            if (outputResult) {
                outputResult.textContent = "Error: Gagal memuat kamus kata. Periksa konsol (F12) dan coba muat ulang halaman.";
                outputResult.classList.add('visible');
            }
            // Tombol tetap nonaktif
            if (generateButton) generateButton.disabled = true;
            if (copyButton) copyButton.disabled = true;
        }
    }

    // --- Fungsi Inti Konversi Teks ---
    function generateTypingGanteng(text) {
        if (!dictionaryLoaded || dictionaryError) {
            return 'Kamus belum siap atau gagal dimuat. Coba lagi nanti.';
        }
        if (!text) return '';

        let result = text.toLowerCase().trim();
        const startTime = performance.now(); // Ukur waktu mulai

        // 1. Lakukan Penggantian Kata menggunakan Kamus yang Dimuat
        //    Penting: Dengan kamus besar, bagian ini akan lebih lambat.
        if (slangDictionary) {
             for (const key in slangDictionary) {
                const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                 try {
                    const regex = new RegExp(`\\b${escapedKey}\\b`, 'gi');
                    result = result.replace(regex, slangDictionary[key]);
                 } catch (e) {
                     console.warn(`Skipping invalid regex for key: ${key}`);
                 }
             }
        }
        const replaceTime = performance.now();
        console.log(`Waktu penggantian kamus: ${(replaceTime - startTime).toFixed(2)} ms`); // Debug waktu

        // 2. Kurangi Karakter Berulang
        result = result.replace(/([a-zA-Z])\1{2,}/g, '$1$1');
        result = result.replace(/wk(wk)+/gi, 'wkwk');
        result = result.replace(/he(he)+/gi, 'hehe');
        result = result.replace(/ha(ha)+/gi, 'haha');
        result = result.replace(/xi(xi)+/gi, 'hehe');

        // 3. Lembutkan Vokal (Hati-hati)
        result = result.replace(/\b(iya|iyaa|masa|apa|kenapa|gimana|wah|oh|aduh|halo|hai|situ|sini|kamu|aku|itu|ini)(?![a-z])/gi, (match) => {
             if (/(aa|ii|uu|ee|oo)$/.test(match) && match !== 'iyaa') return match;
             if (['iya', 'masa', 'apa', 'kenapa', 'gimana', 'wah', 'oh', 'aduh', 'halo', 'hai', 'situ', 'sini'].includes(match)) return match + 'a';
             if (['kamu', 'aku', 'itu', 'ini'].includes(match) && Math.random() < 0.3) return match + 'u';
             return match;
        });
        result = result.replace(/\biya\b/g, 'iyaa');

        // 4. Tangani Tanda Baca (Sedikit perbaikan)
        result = result.replace(/([.,?!~;:]){2,}/g, '$1'); // Hapus duplikat tanda baca
        result = result.replace(/\.{2,}/g, '...'); // Standardize ellipsis
         result = result.replace(/(\s*\.\s*){2,}/g, ' ... '); // Handle spaced dots -> ellipsis with space
         result = result.replace(/\s*([.,?!~;:])\s*/g, '$1 '); // Hapus spasi sebelum, pastikan 1 spasi sesudah
         result = result.replace(/\?\s*!/g, '?!'); // Kombinasi ?!
         result = result.replace(/!\s*\?/g, '?!'); // Kombinasi !? -> ?!
         result = result.trim(); // Trim awal/akhir

        // Tambahkan tanda baca akhir jika belum ada
        const trimmedResult = result.trim();
        if (trimmedResult.length > 0 && !/[.?!~…]$/.test(trimmedResult) && !/(wkwk|hehe|haha)$/i.test(trimmedResult)) {
            if (trimmedResult.endsWith('terima kasih') || trimmedResult.endsWith('maaf') || trimmedResult.endsWith('tolong') || trimmedResult.endsWith('selamat') || trimmedResult.endsWith('permisi') || trimmedResult.endsWith('monggo')) {
                 result += '.';
            } else if (Math.random() < 0.5) {
                result += '~';
            } else {
                result += '.';
            }
        }
        result = result.trim(); // Trim lagi

        // 5. Kapitalisasi (Ditingkatkan: Awal teks + setelah . ! ? ...)
        if (result.length > 0) {
            // Kapitalisasi awal teks
            result = result.charAt(0).toUpperCase() + result.slice(1);
             // Kapitalisasi setelah tanda baca akhir kalimat + spasi
             result = result.replace(/([.?!…]\s+)([a-z])/g, (match, p1, p2) => {
                 return p1 + p2.toUpperCase();
             });
        }

        // 6. Tambahkan Emoji (Opsional & Jarang)
        const endsWithPunctuationOrEllipsis = /[.?!~…]$/.test(result.trim());
        const endsWithLaughter = /(wkwk|hehe|haha)$/i.test(result.trim());
        if (result.length > 0 && !endsWithLaughter && Math.random() < 0.1) { // Frekuensi dikurangi lagi
             if (!endsWithPunctuationOrEllipsis || Math.random() < 0.3) { // Lebih jarang jika sudah ada tanda baca
                 result += ' ^^';
             }
        }

        // 7. Pembersihan Akhir Spasi
        result = result.replace(/\s+/g, ' ').trim();

        const endTime = performance.now();
        console.log(`Waktu proses total generate: ${(endTime - startTime).toFixed(2)} ms`); // Debug waktu total

        return result;
    } // Akhir generateTypingGanteng

    // --- Fungsi Event Handler untuk Tombol Generate ---
    function handleGenerate() {
        if (!dictionaryLoaded || dictionaryError || !inputText || !outputResult || !copyButton) {
            console.warn("Generate dibatalkan: Elemen hilang atau kamus belum siap.");
            return;
        }
        // Tampilkan indikator loading singkat saat proses
        outputResult.textContent = "Memproses...";
        outputResult.classList.remove('visible'); // Sembunyikan dulu

        // Gunakan setTimeout untuk membiarkan UI update sebelum proses berat dimulai
        setTimeout(() => {
            const originalText = inputText.value;
            const gantengText = generateTypingGanteng(originalText);

            outputResult.textContent = gantengText || 'Tidak ada teks untuk diubah...';
            outputResult.classList.add('visible');

            const isResultValid = gantengText && !gantengText.startsWith('Kamus belum siap') && gantengText !== 'Memproses...';
            copyButton.disabled = !isResultValid || gantengText === 'Tidak ada teks untuk diubah...';
            copyButton.textContent = 'Salin Hasil';
            copyButton.className = '';
        }, 10); // Delay kecil
    }

    // --- Fungsi Clipboard (Salin, Fallback, Feedback) ---
    // (Sama seperti versi sebelumnya)
    function handleCopy() {
        if (!outputResult || !copyButton || copyButton.disabled) return;
        const textToCopy = outputResult.textContent;
        if (!textToCopy || textToCopy === 'Hasil akan muncul di sini...' || textToCopy.startsWith('Kamus belum siap') || textToCopy === 'Memproses...') {
            return;
        }
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textToCopy).then(() => { showCopyFeedback(true); })
            .catch(err => { console.warn('Modern Clipboard API gagal, mencoba fallback:', err); copyFallback(textToCopy); });
        } else {
             console.warn('Modern Clipboard API tidak tersedia, menggunakan fallback.'); copyFallback(textToCopy);
        }
    }
    function copyFallback(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = 'fixed'; textArea.style.top = '-9999px'; textArea.style.left = '-9999px'; textArea.style.opacity = '0';
        document.body.appendChild(textArea); textArea.focus(); textArea.select();
        let success = false;
        try { success = document.execCommand('copy'); } catch (err) { console.error('Fallback: Error saat execCommand:', err); }
        document.body.removeChild(textArea); showCopyFeedback(success);
        if (!success) { console.error('Fallback: Gagal menyalin dengan execCommand'); }
    }
    function showCopyFeedback(success) {
        if (!copyButton || !outputResult) return;
        if (success) {
            copyButton.textContent = 'Berhasil Disalin! ✅'; copyButton.classList.add('success'); copyButton.classList.remove('error');
        } else {
            copyButton.textContent = 'Gagal Menyalin ❌'; copyButton.classList.add('error'); copyButton.classList.remove('success');
        }
        setTimeout(() => {
            copyButton.textContent = 'Salin Hasil'; copyButton.className = '';
            const gantengText = outputResult.textContent;
            const isResultValid = gantengText && !gantengText.startsWith('Kamus belum siap') && gantengText !== 'Memproses...';
            copyButton.disabled = !isResultValid || gantengText === 'Tidak ada teks untuk diubah...';
        }, 2000);
    }
    // --- Akhir Fungsi Clipboard ---

    // --- Fungsi untuk Mengatur Status Tombol ---
    function updateButtonStates() {
         if (!generateButton || dictionaryError || !inputText) return;
         const hasInput = inputText.value.trim() !== '';
         generateButton.disabled = !dictionaryLoaded || !hasInput;
    }

    // --- Inisialisasi Saat DOM Siap ---
    document.addEventListener('DOMContentLoaded', () => {
        inputText = document.getElementById('inputText');
        generateButton = document.getElementById('generateButton');
        outputResult = document.getElementById('outputResult');
        copyButton = document.getElementById('copyButton');

        if (generateButton) generateButton.addEventListener('click', handleGenerate);
        if (copyButton) copyButton.addEventListener('click', handleCopy);
        if (inputText) {
            inputText.addEventListener('input', () => {
                updateButtonStates();
                 if (outputResult && outputResult.classList.contains('visible') && !outputResult.textContent.startsWith('Memuat kamus') && !outputResult.textContent.startsWith('Error:') && outputResult.textContent !== 'Memproses...') {
                     outputResult.classList.remove('visible');
                     setTimeout(() => {
                         if(!outputResult.textContent.startsWith('Memuat kamus') && !outputResult.textContent.startsWith('Error:') && outputResult.textContent !== 'Memproses...'){
                             outputResult.textContent = 'Hasil akan muncul di sini...';
                         }
                     }, 150);
                     if (copyButton) { copyButton.textContent = 'Salin Hasil'; copyButton.disabled = true; copyButton.className = ''; }
                 }
            });
        }

        // Mulai memuat kamus dari JSON
        loadDictionary();
    });

})(); // Akhir IIFE
