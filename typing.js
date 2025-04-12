// typing.js - Logic for Typing Ganteng Generator

// Immediately Invoked Function Expression (IIFE) to avoid polluting global scope
(function() {

    // --- DOM Element Selection ---
    // Wait for the DOM to be fully loaded before selecting elements
    document.addEventListener('DOMContentLoaded', () => {
        const inputText = document.getElementById('inputText');
        const generateButton = document.getElementById('generateButton');
        const outputResult = document.getElementById('outputResult');
        const copyButton = document.getElementById('copyButton');

        // --- Initial State ---
        // Disable buttons initially if input is empty
        const hasInitialInput = inputText && inputText.value.trim() !== '';
        if (generateButton) generateButton.disabled = !hasInitialInput;
        if (copyButton) copyButton.disabled = true;


        // --- Event Listeners ---
        if (generateButton) {
            generateButton.addEventListener('click', handleGenerate);
        }

        if (copyButton) {
            copyButton.addEventListener('click', handleCopy);
        }

        if (inputText) {
            inputText.addEventListener('input', () => {
                // Enable generate button only if there's input
                const hasInput = inputText.value.trim() !== '';
                if (generateButton) generateButton.disabled = !hasInput;

                // Reset output and copy button if input changes and output was visible
                if (outputResult && outputResult.classList.contains('visible')) {
                    outputResult.classList.remove('visible');
                    setTimeout(() => { // Delay slightly to allow animation out
                        outputResult.textContent = 'Hasil akan muncul di sini...';
                    }, 150);
                    if (copyButton) {
                        copyButton.textContent = 'Salin Hasil';
                        copyButton.disabled = true;
                        copyButton.className = ''; // Reset button style
                    }
                }
            });
        }
    }); // End DOMContentLoaded listener

    // --- Core Conversion Logic ---
    function generateTypingGanteng(text) {
        if (!text) return ''; // Handle empty input

        let result = text.toLowerCase().trim(); // Lowercase and trim whitespace

        // --- 1. EXPANDED Slang / Abbreviation / Typo Map ---
        // NOTE: Kamus ini diperluas secara signifikan, namun puluhan ribu entri
        //       tidak praktis untuk performa client-side JavaScript.
        //       Fokus pada variasi umum dan relevan.
        const slangMap = {
            // --- Identitas & Sapaan ---
            'aq': 'aku', 'sy': 'saya', 'gw': 'aku', 'gue': 'aku', 'gua': 'aku', 'ane': 'aku', 'saya': 'aku', // Normalize ke 'aku' for casual
            'km': 'kamu', 'klian': 'kalian', 'anda': 'kamu', 'loe': 'kamu', 'lu': 'kamu', 'antum': 'kamu', 'sampean': 'kamu', 'situ': 'kamu', // Normalize ke 'kamu'
            'dia': 'dia', 'doi': 'dia', 'beliau': 'beliau', 'dy': 'dia',
            'kita': 'kita', 'kami': 'kami',
            'org': 'orang', 'tmn': 'teman', 'temen': 'teman', 'kwn': 'kawan', 'sahabat': 'sahabat', 'bestie': 'sahabat', 'besti': 'sahabat', 'pren': 'teman',
            'pak': 'Bapak', 'bpk': 'Bapak', 'bu': 'Ibu', 'mas': 'Mas', 'mbak': 'Mbak', 'kak': 'Kak', 'dek': 'Adik', 'om': 'Om', 'tante': 'Tante', // Sapaan Hormat/Kasual

            // --- Waktu & Tanggal ---
            'td': 'tadi', 'ntr': 'nanti', 'ntar': 'nanti', 'bsk': 'besok', 'lusa': 'lusa',
            'skrg': 'sekarang', 'skrng': 'sekarang', 'rn': 'sekarang', 'now': 'sekarang',
            'dl': 'dulu', 'dlu': 'dulu', 'dulu': 'dulu', // normalize
            'kpn': 'kapan', 'kapan2': 'kapan-kapan',
            'bntr': 'sebentar', 'sbntr': 'sebentar', 'sebentar': 'sebentar',
            'hr': 'hari', 'hri': 'hari', 'senin': 'Senin', 'selasa': 'Selasa', 'rabu': 'Rabu', 'kamis': 'Kamis', 'jumat': 'Jumat', 'sabtu': 'Sabtu', 'minggu': 'Minggu',
            'tgl': 'tanggal', 'date': 'tanggal',
            'bln': 'bulan', 'jan': 'Januari', 'feb': 'Februari', 'mar': 'Maret', 'apr': 'April', 'mei': 'Mei', 'jun': 'Juni', 'jul': 'Juli', 'ags': 'Agustus', 'sep': 'September', 'okt': 'Oktober', 'nov': 'November', 'des': 'Desember',
            'thn': 'tahun', 'taun': 'tahun', 'year': 'tahun',
            'malem': 'malam', 'mlm': 'malam', 'nite': 'malam',
            'pagi': 'pagi', 'morning': 'pagi',
            'siang': 'siang', 'afternoon': 'siang',
            'sore': 'sore', 'evening': 'sore', // evening might be malam too
            'weekend': 'akhir pekan', 'weekday': 'hari kerja',
            'jam': 'jam', 'menit': 'menit', 'detik': 'detik',

             // --- Kata Tanya & Sambung ---
            'yg': 'yang', 'utk': 'untuk', 'dgn': 'dengan', 'dg': 'dengan', 'sama': 'dengan', // 'sama' bisa 'dengan' atau 'same'
            'dr': 'dari', 'dri': 'dari', 'fr': 'dari', // from
            'kmn': 'kemana', 'dmn': 'dimana', 'dimn': 'dimana', 'where': 'dimana',
            'gmn': 'gimana', 'gmana': 'gimana', 'gmna': 'gimana', 'how': 'gimana', // Keep casual 'gimana'
            'knp': 'kenapa', 'napa': 'kenapa', 'why': 'kenapa',
            'brp': 'berapa', 'harganya': 'berapa harganya', 'price': 'harga',
            'bgmn': 'bagaimana', // More formal if needed, but 'gimana' preferred
            'drpd': 'daripada', 'ketimbang': 'daripada',
            'klo': 'kalau', 'kl': 'kalau', 'kalo': 'kalau', 'if': 'kalau',
            'ato': 'atau', 'atw': 'atau', 'or': 'atau',
            'krn': 'karena', 'karna': 'karena', 'sbb': 'sebab', 'because': 'karena', 'coz': 'karena',
            'sblm': 'sebelum', 'sblmnya': 'sebelumnya', 'before': 'sebelum',
            'stlh': 'setelah', 'stlhnya': 'setelahnya', 'after': 'setelah',
            'jd': 'jadi', 'so': 'jadi',
            'tp': 'tapi', 'tpi': 'tapi', 'but': 'tapi',
            'agr': 'agar', 'spy': 'supaya',
            'pdhl': 'padahal', 'pdhal': 'padahal',
            'wlpn': 'walaupun', 'meski': 'meskipun', 'mskpn': 'meskipun', 'although': 'walaupun',
            'serta': 'serta', 'dan': 'dan', 'and': 'dan',
            'utk': 'untuk', 'for': 'untuk',
            'ttg': 'tentang', 'about': 'tentang',
            'd': 'di', 'di': 'di', // simple 'd' -> 'di'
            'k': 'ke', 'ke': 'ke', // simple 'k' -> 'ke'

             // --- Kata Kerja Umum (Common Verbs) ---
            'lg': 'lagi', 'sdg': 'sedang', 'lagi': 'lagi', // normalize
            'blg': 'bilang', 'ngomong': 'bilang', 'ngmg': 'bilang', 'say': 'bilang', 'tell': 'bilang',
            'liat': 'lihat', 'liht': 'lihat', 'nntn': 'nonton', 'watch': 'nonton', 'see': 'lihat',
            'mkn': 'makan', 'sarapan': 'sarapan', 'maksi': 'makan siang', 'mkn mlm': 'makan malam', 'eat': 'makan',
            'ksh': 'kasih', 'beri': 'beri', 'ngasih': 'memberi', 'give': 'beri',
            'blm': 'belum', 'blom': 'belum', 'bloman': 'belum', 'not yet': 'belum',
            'bs': 'bisa', 'bsa': 'bisa', 'can': 'bisa',
            'tdr': 'tidur', 'bobok': 'tidur', 'sleep': 'tidur',
            'krj': 'kerja', 'ngantor': 'ke kantor', 'wfh': 'kerja dari rumah', 'wfo': 'kerja dari kantor', 'work': 'kerja',
            'bljr': 'belajar', 'nugas': 'mengerjakan tugas', 'study': 'belajar', 'learn': 'belajar',
            'byr': 'bayar', 'byrin': 'bayarin', 'pay': 'bayar',
            'cri': 'cari', 'nyari': 'mencari', 'find': 'cari', 'search': 'cari',
            'dpt': 'dapat', 'dapet': 'dapat', 'get': 'dapat',
            'ilang': 'hilang', 'kelangan': 'kehilangan', 'lost': 'hilang',
            'dtg': 'datang', 'dateng': 'datang', 'come': 'datang',
            'plg': 'pulang', 'pulng': 'pulang', 'go home': 'pulang',
            'prgi': 'pergi', 'go': 'pergi',
            'tggu': 'tunggu', 'nunggu': 'menunggu', 'wait': 'tunggu',
            'ngerti': 'mengerti', 'paham': 'paham', 'understand': 'paham',
            'tau': 'tahu', 'know': 'tahu', // \btau\b needed
            'lwt': 'lewat', 'lewati': 'lewati', 'pass': 'lewat',
            'smpai': 'sampai', 'smpe': 'sampai', 'arrive': 'sampai',
            'msk': 'masuk', 'keluar': 'keluar', 'enter': 'masuk', 'exit': 'keluar',
            'naik': 'naik', 'turun': 'turun', 'up': 'naik', 'down': 'turun',
            'bntu': 'bantu', 'nolong': 'menolong', 'help': 'bantu',
            'mnta': 'minta', 'meminta': 'meminta', 'ask': 'minta',
            'coba': 'coba', 'nyoba': 'mencoba', 'try': 'coba',
            'lakuin': 'lakukan', 'ngerjain': 'mengerjakan', 'do': 'lakukan',
            'pke': 'pakai', 'make': 'memakai', 'use': 'pakai',
            'bwa': 'bawa', 'bw': 'bawa', 'bring': 'bawa', 'take': 'ambil', // 'take' is ambiguous
            'beli': 'beli', 'buy': 'beli', 'jual': 'jual', 'sell': 'jual',
            'trima': 'terima', 'nerima': 'menerima', 'receive': 'terima',
            'krm': 'kirim', 'ngirim': 'mengirim', 'send': 'kirim',
            'lupa': 'lupa', 'forget': 'lupa', 'ingat': 'ingat', 'remember': 'ingat',
            'mulai': 'mulai', 'start': 'mulai', 'selesai': 'selesai', 'end': 'selesai', 'finish': 'selesai', 'kelar': 'selesai',
            'suka': 'suka', 'like': 'suka', 'benci': 'benci', 'hate': 'benci',
            'main': 'main', 'play': 'main', 'maen': 'main',
            'ngobrol': 'mengobrol', 'chat': 'mengobrol', 'bicara': 'bicara', 'speak': 'bicara', 'talk': 'bicara',
            'denger': 'dengar', 'listen': 'dengar', 'hear': 'dengar',
            'tny': 'tanya', 'nanya': 'bertanya', 'ask': 'tanya',
            'jwb': 'jawab', 'njawab': 'menjawab', 'answer': 'jawab',
            'pikir': 'pikir', 'think': 'pikir', 'merasa': 'merasa', 'feel': 'merasa',
            'butuh': 'butuh', 'need': 'butuh', 'ingin': 'ingin', 'pengen': 'ingin', 'pingin': 'ingin', 'want': 'ingin',
            'jemput': 'jemput', 'pick up': 'jemput', 'antar': 'antar', 'anter': 'antar', 'drop off': 'antar',
            'masak': 'masak', 'cook': 'masak', 'cuci': 'cuci', 'wash': 'cuci',
            'baca': 'baca', 'read': 'baca', 'tulis': 'tulis', 'write': 'tulis',
            'jalan': 'jalan', 'walk': 'jalan', 'lari': 'lari', 'run': 'lari', 'berenang': 'berenang', 'swim': 'berenang',
            'nyetir': 'menyetir', 'drive': 'menyetir',

            // --- Kata Sifat & Keterangan (Adjectives & Adverbs) ---
            'bgt': 'banget', 'skli': 'sekali', 'amat': 'amat', 'very': 'banget', 'really': 'banget',
            'bnr': 'benar', 'bener': 'benar', 'btl': 'betul', 'true': 'benar', 'right': 'benar',
            'slh': 'salah', 'wrong': 'salah', 'false': 'salah',
            'bgs': 'bagus', 'bgsd': 'bagus', 'good': 'bagus', 'nice': 'bagus', 'keren': 'keren', 'cool': 'keren', 'mantap': 'mantap', 'mantapp': 'mantap', 'awesome': 'keren banget',
            'jlk': 'jelek', 'bad': 'jelek', 'ugly': 'jelek',
            'cpt': 'cepat', 'cepet': 'cepat', 'fast': 'cepat',
            'lmbt': 'lambat', 'lama': 'lama', 'slow': 'lambat',
            'dkt': 'dekat', 'deket': 'dekat', 'near': 'dekat',
            'jauh': 'jauh', 'far': 'jauh',
            'byk': 'banyak', 'bnyak': 'banyak', 'many': 'banyak', 'much': 'banyak', 'a lot': 'banyak',
            'sdkt': 'sedikit', 'dikit': 'sedikit', 'few': 'sedikit', 'little': 'sedikit',
            'lbh': 'lebih', 'more': 'lebih', 'krg': 'kurang', 'less': 'kurang',
            'ckp': 'cukup', 'enough': 'cukup',
            'srg': 'sering', 'often': 'sering', 'kdg': 'kadang', 'kdg2': 'kadang-kadang', 'sometimes': 'kadang-kadang',
            'jrg': 'jarang', 'seldom': 'jarang', 'rarely': 'jarang',
            'psti': 'pasti', 'ykn': 'yakin', 'sure': 'yakin', 'certain': 'pasti',
            'mngkn': 'mungkin', 'bsjd': 'bisa jadi', 'maybe': 'mungkin', 'perhaps': 'mungkin',
            'hrs': 'harus', 'wjb': 'wajib', 'must': 'harus', 'should': 'seharusnya',
            'prnh': 'pernah', 'ever': 'pernah', 'never': 'tidak pernah', 'tdk prnh': 'tidak pernah',
            'blh': 'boleh', 'may': 'boleh', 'can': 'bisa', // 'can' also verb
            'slalu': 'selalu', 'sll': 'selalu', 'senantiasa': 'senantiasa', 'always': 'selalu',
            'br': 'baru', 'bru': 'baru', 'new': 'baru', 'lama': 'lama', 'old': 'lama', // old ambiguous
            'lgsg': 'langsung', 'directly': 'langsung',
            'kyk': 'kayak', 'kek': 'kayak', 'spt': 'seperti', 'like': 'seperti',
            'sm': 'sama', 'ama': 'sama', 'same': 'sama', // 'sama' means 'same' or 'with'/'and'
            'msh': 'masih', 'still': 'masih',
            'sdh': 'sudah', 'udh': 'sudah', 'dah': 'sudah', 'already': 'sudah',
            'gt': 'gitu', 'gitu': 'gitu', 'begitu': 'begitu', // gt -> gitu
            'gini': 'gini', 'begini': 'begini', // Keep gini
            'bkn': 'bukan', 'not': 'bukan',
            'iya': 'iya', 'y': 'iya', 'yo': 'iya', 'ok': 'oke', 'oke': 'oke', 'okey': 'oke', 'sip': 'sip', 'yes': 'iya', 'yeah': 'iya', 'yup': 'iya', // Affirmatives
            'tdk': 'tidak', 'engga': 'enggak', 'enggak': 'enggak', 'gak': 'enggak', 'ngga': 'enggak', 'nggak': 'enggak', 'gk': 'enggak', 'no': 'tidak', 'nope': 'tidak', // Negatives
            'kn': 'kan', 'kan': 'kan', // Keep kan
            'emg': 'emang', 'emang': 'emang', // Keep emang
            'brt': 'berat', 'heavy': 'berat', 'ringan': 'ringan', 'light': 'ringan',
            'skt': 'sakit', 'sick': 'sakit', 'ill': 'sakit', 'sehat': 'sehat', 'healthy': 'sehat',
            'cape': 'capek', 'cae': 'capek', 'lelah': 'lelah', 'tired': 'capek',
            'snang': 'senang', 'sneng': 'senang', 'happy': 'senang', 'bahagia': 'bahagia', 'glad': 'senang',
            'sdh': 'sedih', 'sad': 'sedih', 'galau': 'galau', 'upset': 'sedih',
            'males': 'malas', 'malas': 'malas', 'lazy': 'malas', 'mager': 'malas gerak', // mager
            'gabut': 'sedang bosan', 'bored': 'bosan', // gabut
            'mantul': 'mantap betul', // mantul
            'gpp': 'gapapa', 'gpapa': 'gapapa', 'its ok': 'gapapa', 'no problem': 'gapapa', // gapapa
            'penting': 'penting', 'important': 'penting', 'ga penting': 'tidak penting', 'unimportant': 'tidak penting',
            'susah': 'susah', 'sulit': 'sulit', 'difficult': 'sulit', 'gampang': 'gampang', 'mudah': 'mudah', 'easy': 'mudah',
            'murah': 'murah', 'cheap': 'murah', 'mahal': 'mahal', 'expensive': 'mahal',
            'besar': 'besar', 'big': 'besar', 'kecil': 'kecil', 'small': 'kecil', 'gede': 'besar', 'kcl': 'kecil',
            'panjang': 'panjang', 'long': 'panjang', 'pendek': 'pendek', 'short': 'pendek',
            'tinggi': 'tinggi', 'high': 'tinggi', 'tall': 'tinggi', 'rendah': 'rendah', 'low': 'rendah',
            'kosong': 'kosong', 'empty': 'kosong', 'penuh': 'penuh', 'full': 'penuh',
            'terbuka': 'terbuka', 'buka': 'buka', 'open': 'terbuka', 'tutup': 'tutup', 'closed': 'tutup',
            'ramai': 'ramai', 'crowded': 'ramai', 'sepi': 'sepi', 'quiet': 'sepi',
            'berisik': 'berisik', 'noisy': 'berisik', 'tenang': 'tenang', 'calm': 'tenang',
            'pintar': 'pintar', 'pinter': 'pintar', 'smart': 'pintar', 'cerdas': 'cerdas', 'bodoh': 'bodoh', 'bego': 'bodoh', 'stupid': 'bodoh',
            'cantik': 'cantik', 'cakep': 'cakep', 'ganteng': 'ganteng', 'beautiful': 'cantik', 'handsome': 'ganteng', 'pretty': 'cantik',
            'lucu': 'lucu', 'funny': 'lucu', 'cute': 'lucu', // cute bisa imut
            'serius': 'serius', 'serious': 'serius', 'bercanda': 'bercanda', 'joking': 'bercanda',
            'takut': 'takut', 'afraid': 'takut', 'scared': 'takut', 'berani': 'berani', 'brave': 'berani',
            'malu': 'malu', 'shy': 'malu', 'ashamed': 'malu',
            'kenyang': 'kenyang', 'full': 'kenyang', 'lapar': 'lapar', 'laper': 'lapar', 'hungry': 'lapar', 'haus': 'haus', 'thirsty': 'haus',
            'random': 'random', 'acak': 'acak', // keep random?
            'valid': 'valid', 'benar': 'benar', // valid -> benar
            'santuy': 'santai', 'santai': 'santai', // santuy -> santai
            'parah': 'parah', 'parahh': 'parah', // normalize parah

            // --- Ekspresi, Interjeksi & Slang Internet/Populer ---
            'wkwk': 'wkwk', 'wkwkwk': 'wkwk', 'haha': 'haha', 'hehe': 'hehe', 'xixi': 'hehe', 'kwkwkwk': 'wkwk', 'wkakaka': 'wkwk', 'lol': 'wkwk', 'lmao': 'wkwk', // Normalize laughter
            'astaga': 'astaga', 'astaghfirullah': 'astaghfirullah', 'yaampun': 'ya ampun', 'ya Allah': 'Ya Allah', 'omg': 'ya ampun', // Exclamations
            'anjir': 'astaga', 'anjay': 'astaga', 'anjrit': 'astaga', 'kampret': 'astaga', 'buset': 'astaga', 'jir': 'astaga', // Mild replacement for harsh slang
            'asik': 'asik', 'seru': 'seru', 'fun': 'seru',
            'syukurlah': 'syukurlah', 'alhamdulillah': 'alhamdulillah', 'puji Tuhan': 'puji Tuhan',
            'smg': 'semoga', 'moga': 'semoga', 'wish': 'semoga', 'amin': 'aamiin', 'aamiin': 'aamiin', // Normalize doa
            'syg': 'sayang', 'cinta': 'cinta', 'love': 'cinta', 'dear': 'sayang',
            'maap': 'maaf', 'mf': 'maaf', 'sorry': 'maaf', 'maafin': 'maafin', 'punten': 'maaf', 'ngapunten': 'maaf', // Apologies
            'thx': 'terima kasih', 'tq': 'terima kasih', 'makasi': 'terima kasih', 'makasih': 'terima kasih', 'nuwun': 'terima kasih', 'thanks': 'terima kasih', 'thank you': 'terima kasih', // Thanks
            'pls': 'tolong', 'plis': 'tolong', 'tlng': 'tolong', 'please': 'tolong', // Requests
            'slmt': 'selamat', 'congrats': 'selamat', 'congratulations': 'selamat', 'slmt dtg': 'selamat datang', 'welcome': 'selamat datang',
            'met pagi': 'selamat pagi', 'met siang': 'selamat siang', 'met sore': 'selamat sore', 'met malam': 'selamat malam', 'met ultah': 'selamat ulang tahun', 'hbd': 'selamat ulang tahun', 'ultah': 'ulang tahun', 'birthday': 'ulang tahun', // Greetings
            'salam kenal': 'salam kenal', 'salken': 'salam kenal',
            'btw': 'ngomong-ngomong', 'by the way': 'ngomong-ngomong',
            'otw': 'sedang di jalan', 'on my way': 'sedang di jalan',
            'imho': 'menurutku', 'imo': 'menurutku', 'in my opinion': 'menurutku',
            'afaik': 'setahuku', 'as far as i know': 'setahuku',
            'istg': 'astaga', 'i swear to god': 'astaga',
            'irl': 'di dunia nyata', 'in real life': 'di dunia nyata',
            'dll': 'dan lain-lain', 'etc': 'dan lain-lain', 'et cetera': 'dan lain-lain',
            'lho': 'lho', 'loh': 'lho', 'kok': 'kok', 'sih': 'sih', 'dong': 'dong', 'donk': 'dong', 'deh': 'deh', 'nih': 'nih', 'tuh': 'tuh', // Keep particles
            'sumpah': 'serius', 'demi apa': 'serius', 'beneran': 'serius', // Emphasis -> serius
            'baper': 'terbawa perasaan', // baper
            'bokek': 'tidak punya uang', 'kere': 'tidak punya uang', // bokek
            'hoax': 'berita bohong', 'fake news': 'berita bohong',
            'cringe': 'memalukan', // cringe
            'healing': 'jalan-jalan', // healing -> jalan-jalan (common use)
            'pov': 'sudut pandang', // pov
            'spill': 'ceritakan', 'spill the tea': 'ceritakan', // spill
            'nolep': 'kurang pergaulan', 'no life': 'kurang pergaulan', // nolep
            'fomo': 'takut ketinggalan', 'fear of missing out': 'takut ketinggalan', // fomo
            'ygy': 'ya guys ya', // ygy
            'typo': 'salah ketik', // typo
            'gaje': 'tidak jelas', 'gj': 'tidak jelas', // gaje
            'japri': 'chat pribadi', // japri
            'kepo': 'ingin tahu urusan orang', // kepo
            'lebay': 'berlebihan', // lebay
            'alay': 'norak', // alay -> norak (subjective)
            'mabar': 'main bareng', // mabar
            'pansos': 'panjat sosial', // pansos
            'gercep': 'gerak cepat', // gercep
            'hadeh': 'aduh', // hadeh -> aduh
            'ytta': 'yang tahu-tahu aja', // ytta
            'komuk': 'muka', // komuk -> muka (slang)
            'sambad': 'mengeluh', 'sambat': 'mengeluh', // sambat
            'hy': 'hai', 'hallo': 'halo', 'helo': 'halo', 'heyy': 'hai', // Hi variations
            'okd': 'oke deh', // okd

            // --- Lain-lain & Typos ---
            'jg': 'juga', 'jga': 'juga', 'too': 'juga', 'also': 'juga',
            'brg': 'bareng', 'bareng': 'bareng', // Assume 'brg' means 'bareng'
            'no': 'nomor', 'nmr': 'nomor', 'number': 'nomor',
            'hp': 'ponsel', 'hape': 'ponsel', 'phone': 'ponsel',
            'rmh': 'rumah', 'home': 'rumah', 'house': 'rumah',
            'duit': 'uang', 'cuan': 'uang', 'money': 'uang',
            'mbl': 'mobil', 'car': 'mobil', 'mtr': 'motor', 'motorcycle': 'motor',
            'jln': 'jalan', 'street': 'jalan', 'road': 'jalan',
            'dgn': 'dengan', 'with': 'dengan',
            'krja': 'kerja', 'kja': 'kerja', // common typo
            'skolah': 'sekolah', 'skul': 'sekolah', 'school': 'sekolah',
            'kampus': 'kampus', 'kuliah': 'kuliah', 'kulyah': 'kuliah', 'college': 'kampus', 'university': 'kampus',
            'tpi': 'tapi', // typo tapi
            'syapa': 'siapa', 'syp': 'siapa', // typo siapa
            'trus': 'terus', 'trs': 'terus', 'then': 'terus', // terus
            'banget': 'banget', 'banged': 'banget', // typo banget
            'bangettt': 'banget', // reduce repetition handled later, but good to normalize
            'iyaa': 'iyaa', // Keep double vowel if intended by softening rule later
            'okee': 'oke', // double vowel typo -> single
            'makasihh': 'terima kasih', // double consonant typo
            'good': 'bagus', 'bad': 'jelek', // simple english map
            'the': '', 'a': '', 'an': '', // Remove simple articles (can be risky)
            'is': 'adalah', 'are': 'adalah', 'am': 'adalah', // BE verbs (can be risky)
            'gawe': 'kerja', 'nggawe': 'membuat', // Javanese influence
            'piye': 'gimana', 'pripun': 'gimana', // Javanese influence
            'wae': 'saja', 'ae': 'saja', // Javanese influence
            'mboten': 'tidak', 'ora': 'tidak', // Javanese influence
            'nggeh': 'iya', 'njih': 'iya', // Javanese influence
            'lan': 'dan', // Javanese influence
            'neng': 'di', // Sundanese/Javanese influence
            'teh': '', 'mah': '', // Sundanese particles (remove maybe?)

        };

        // Apply replacements iteratively
        for (const key in slangMap) {
            // Regex: \b(key)\b -> Match whole word only, case insensitive 'i'
            // Escape special regex characters in the key
            const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            // Use try-catch for potentially invalid regex keys (though escaped should be safe)
            try {
                const regex = new RegExp(`\\b${escapedKey}\\b`, 'gi'); // 'g' global, 'i' case-insensitive
                result = result.replace(regex, slangMap[key]);
            } catch (e) {
                console.error(`Invalid regex for key: ${key}`, e);
            }
        }

        // --- 2. Reduce Repeating Characters ---
        // Reduce 3+ identical letters to 2 (e.g., capeeeek -> capeek)
        result = result.replace(/([a-zA-Z])\1{2,}/g, '$1$1');
        // Normalize specific laughter patterns more strictly after general reduction
        result = result.replace(/wkwk(w|k)*/gi, 'wkwk');
        result = result.replace(/hehe(h|e)*/gi, 'hehe');
        result = result.replace(/haha(h|a)*/gi, 'haha');
        result = result.replace(/hihi(h|i)*/gi, 'hehe'); // hihi -> hehe


        // --- 3. Soften Vowels (Subtle Lengthening) ---
        // Add 'a'/'u' to certain words if they end the word (not followed by a letter)
        // Be careful not to overdo this. Focus on common conversational endings.
        result = result.replace(/\b(iya|iyaa|masa|apa|kenapa|gimana|wah|oh|aduh|halo|hai|situ|sini|kamu|aku|itu|ini)(?![a-z])/gi, (match) => {
             // Avoid adding if already double vowel, except for specific common cases like 'iyaa'
             if (/(aa|ii|uu|ee|oo)$/.test(match) && match !== 'iyaa') {
                 return match;
             }
             // Add 'a' commonly
             if (['iya', 'masa', 'apa', 'kenapa', 'gimana', 'wah', 'oh', 'aduh', 'halo', 'hai', 'situ', 'sini'].includes(match)) {
                 return match + 'a';
             }
             // Add 'u' less commonly
              if (['kamu', 'aku', 'itu', 'ini'].includes(match) && Math.random() < 0.3) { // Only sometimes add 'u'
                  return match + 'u';
              }
             return match; // No change if no rule matches
        });
        // Ensure common cases like iyaa are preserved or created
        result = result.replace(/\biya\b/g, 'iyaa');


        // --- 4. Punctuation Handling ---
        // Remove excessive consecutive punctuation
        result = result.replace(/([.,?!~;:]){2,}/g, '$1');
        // Standardize ellipsis
        result = result.replace(/\.{2,}/g, '...'); // 2 or more dots become ...
        result = result.replace(/(\s*\.\s*){2,}/g, ' ... '); // Handle spaced dots
        // Clean up spaces around punctuation
        result = result.replace(/\s+([.,?!~;:])\s*/g, '$1 '); // Remove space before, ensure one space after
        result = result.trim(); // Trim again after space adjustments

        // Ensure sentence ends with appropriate punctuation or a gentle tilde
        const trimmedResult = result.trim();
        if (trimmedResult.length > 0 && !/[.?!~…]$/.test(trimmedResult) && !/(wkwk|hehe|haha)$/i.test(trimmedResult)) {
            if (trimmedResult.endsWith('terima kasih') || trimmedResult.endsWith('maaf') || trimmedResult.endsWith('tolong') || trimmedResult.endsWith('selamat') || trimmedResult.endsWith('permisi')) {
                 result += '.'; // Add period after polite phrases
            } else if (Math.random() < 0.5) { // 50% chance for tilde
                result += '~';
            } else {
                result += '.'; // Default to period
            }
        }
        // Remove trailing spaces if any added
        result = result.trim();


        // --- 5. Capitalization (Sentence case) ---
        // Capitalize the first letter of the entire text
        if (result.length > 0) {
            result = result.charAt(0).toUpperCase() + result.slice(1);
        }
        // Optional: Capitalize after sentence-ending punctuation (more complex)
        // result = result.replace(/([.?!~…]\s+)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());


        // --- 6. Optional: Add Emoji (^^) ---
        // Add very sparingly, e.g., at the end sometimes if not laughter
        const endsWithPunctuationOrEllipsis = /[.?!~…]$/.test(result.trim());
        const endsWithLaughter = /(wkwk|hehe|haha)$/i.test(result.trim());
        if (result.length > 0 && !endsWithLaughter && Math.random() < 0.15) { // 15% chance overall
             if (!endsWithPunctuationOrEllipsis || Math.random() < 0.5) { // Add if no punctuation, or 50% chance if there is
                 result += ' ^^';
             }
        }


        // --- 7. Final Cleanup ---
        result = result.replace(/\s+/g, ' ').trim(); // Ensure single spaces

        return result;
    } // End generateTypingGanteng

    // --- Event Handler Functions ---
    function handleGenerate() {
        const inputText = document.getElementById('inputText');
        const outputResult = document.getElementById('outputResult');
        const copyButton = document.getElementById('copyButton');

        if (!inputText || !outputResult || !copyButton) return; // Safety check

        const originalText = inputText.value;
        const gantengText = generateTypingGanteng(originalText);

        outputResult.textContent = gantengText || 'Tidak ada teks untuk diubah...'; // Display result or default message
        outputResult.classList.add('visible'); // Animate result display
        copyButton.disabled = !gantengText || gantengText === 'Tidak ada teks untuk diubah...'; // Enable copy button if result is valid
        copyButton.textContent = 'Salin Hasil'; // Reset copy button text
        copyButton.className = ''; // Reset copy button style
    }

    // --- Clipboard Handling Functions ---
    function handleCopy() {
        const outputResult = document.getElementById('outputResult');
        const copyButton = document.getElementById('copyButton');

        if (!outputResult || !copyButton || copyButton.disabled) return; // Safety check

        const textToCopy = outputResult.textContent;
        if (!textToCopy || textToCopy === 'Hasil akan muncul di sini...') {
            return; // Don't copy if no valid result
        }

        // Try Modern API First (navigator.clipboard)
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                showCopyFeedback(true); // Success
            }).catch(err => {
                console.warn('Modern Clipboard API gagal, mencoba fallback:', err);
                copyFallback(textToCopy); // Try fallback
            });
        } else {
            // Fallback for non-secure contexts or older browsers
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
        const copyButton = document.getElementById('copyButton');
        const outputResult = document.getElementById('outputResult');
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

        // Reset button after 2 seconds
        setTimeout(() => {
            copyButton.textContent = 'Salin Hasil';
            copyButton.className = ''; // Reset class
            // Re-check disabled state
            const gantengText = outputResult.textContent;
            copyButton.disabled = !gantengText || gantengText === 'Tidak ada teks untuk diubah...';
        }, 2000);
    }

})(); // Execute the IIFE
