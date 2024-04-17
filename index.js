const qrcode = require('qrcode-terminal');

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: "sessions",
    }),
    puppeteer: {
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--unhandled-rejections=strict"
        ]
    },
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    }
});
const templateMedia = {
    '/2.1': './public/MEDIA_1.pdf',
    '/2.2': './public/MEDIA_2.pdf',
};
const template = {
    "/0":
        `
Terima kasih sudah menghubungi aXara. Chat akan Axara akhiri. Jangan lupa memberikan kritik & saran pada link berikut \n

https://forms.gle/rgwCXJHqHfYSgtcAA

Jika ada pertanyaan atau informasi yang belum tersedia di aksara dapat menghubungi tim terkait.
Ke Balikpapan untuk bersih-bersih
Cukup Sekian & terima Kasih
    `,
    "/1":
        `
Terima kasih sudah menghubungi aXara. Terkait dengan issue yang anda temukan silahkan mengunakan angka 1.1 sampai 1.5 sesuai dengan issue yang anda pada device\n
Hanya perlu mengetikan angka untuk menampilkan jawaban yang anda butuhkan. 

    /1.1 GPS Location is not valid
    /1.2 Near me
    /1.3 Ada Masalah Saat Login
    /1.4 Tidak Bisa Cek out
    /1.5 Rating tidak muncul
    /1.6 Issue tidak muncul ketika masuk ke Outlet
    `,
    "/2":
        `
Terima kasih sudah menghubingi aXara. Axara memiliki banyak manual guideline/panduan yang bisa digunakan sahabat agar lebih mudah dalam menggunakan MIX Mobile.\n
Silahkan menggunakan angka 2.1 samapai 2.5 untuk menampilka jawaban yang diingiinkan. 

    /2.1 Guidence lengkap follow up issue
    /2.2 Guidence Report Productivity
    /2.3 Guidence Report Attendance
    /2.4 Guidence New Check Stock
    /2.5 Guidence Competitor Activity
    `,
    "/3":
        `
Terima kasih sudah menghubingi aXara. Axara memiliki FAQ yang dapat digunakan untuk mencari informasi yang anda butuhkan.\n
Silahkan menggunakan angka 3.1 samapai 3.7 untuk menampilka jawaban yang diingiinkan. 

    /3.1 Apa itu Grouping Issue ?
    /3.2 Bagaimana cara menggunakan grouping issue ?
    /3.3 Siapa saja yang bisa menggunakan grouping issue ?
    /3.4 Apakah MD dapat melakukan grouping issue ?
    /3.5 Apakah Group issue bisa digabungkan dengan groupissue lainnya?
    /3.6 Jika issue di finish dalam keadaan group issue apakah akan menyelsaikan keseluruhan issue?
    /3.7 Apakah deadline issue memoengaruhi group issue ?
    `,
    "/9":
        `
Hai Masih bersama  aXara disini \n
Ada yang bisa Aksara bantu, Berikut adalah menu utama yang dapat dipilih 
    /1. Issue 
    /2. Manual Guide 
    /3. FAQ  
    `,
    "/1.1":
        `
GPS Location is not valid, application will be terminated!!\n
Lakukan langkah-langkah berikut:

    1. Mode Pengembang (Developer Setting) harap dimatikan
    2. Apabila ada aplikasi FAKE GPS dan sejnisnya, silahkan Diuninstall!
    3. Setelah dimatikan, End Task MIX, lalu Login kembali
      
ketik  /1 "Mencari Issue lainnya"
ketik  /0 "Isuue Sudah terselesaikan"
ketik  /9 "Kembali ke menu utama"
    `,
    "/1.2":
        `
Jika mengalami kendala saat Near me\n
Lakukan langkah-langkah berikut:
    1. Perbesar radius jarak
    2. Apabila jarak out of radius coba kalibrasi ulang melalui google maps
    3. Lakukan sikron region dan sinkron master (Tengah)
      
ketik  /1 "Mencari Issue lainnya"
ketik  /0 "Isuue Sudah terselesaikan"
ketik  /9 "Kembali ke menu utama"
    `,
    "/1.3":
        `
Jika mengalami masalah saat login\n
Lakukan langkah-langkah berikut:
    1. Pastikan jaringan/sinyal pada handphone tidak ada kendala
    2. Coba untuk menggunakan jaringan lain hotspot/wifi
      
ketik  /1 "Mencari Issue lainnya"
ketik  /0 "Isuue Sudah terselesaikan"
ketik  /9 "Kembali ke menu utama"
    `,
    "/1.4":
        `
Jika mengalami kendala Tidak bisa cek  out \n
Lakukan langkah-langkah berikut:
      1. End Task MIX Mobile
      2. Setelah masuk start activity, Klik "NEXT” dan Take foto Cek In
      3. Setelah Cek foto Cek In, klik next untuk mengirim semua data
      
ketik  /1 "Mencari Issue lainnya"
ketik  /0 "Isuue Sudah terselesaikan"
ketik  /9 "Kembali ke menu utama"
    `,
    "/1.5":
        `
Jika mengalami kedala Rating tidak Muncul\n
Lakukan langkah-langkah berikut:
      1. Pastikan anda tidak melakukan back/kembali ketika kunjungan
      2. Cek foto pada device anda apakah foto hasil kunjungan dan rating masuk ke internal memori
      3. Jika masih berada ditoko, silahkan lakukan rating ulang terhadap toko tersebut
      
ketik  /1 "Mencari Issue lainnya"
ketik  /0 "Isuue Sudah terselesaikan"
ketik  /9 "Kembali ke menu utama"
    `,
    "/1.6":
        `
Jika mengalami kedala Issue tidak muncul ketika masuk ke Outlet\n
Lakukan langkah-langkah berikut:
      1. Cek kembali pada menu report monitoring joblist.
      2. Jika issue tetap tidak muncul, maka terdapat mapppingan yang belum sesuai. Silahkan hubungi tim yang terkait untuk untuk memonitoring masalah tersebut.
      
ketik  /1 "Mencari Issue lainnya"
ketik  /0 "Isuue Sudah terselesaikan"
ketik  /9 "Kembali ke menu utama"
`,
    "/1.7":
        `
Jika mengalami kedala Gagal Sending/kirim data data\n
Lakukan langkah-langkah berikut:
Lakukan Langkah2 berikut :
    1.Pastikan jaringan anda tidak bermasalah (Bisa menggunakan jaringan provoder lain, hospot atau WIFI).
    2.Matika mode hemat pada handphone jika masih dalam mode ON.
ketik  /1 "Mencari Issue lainnya"
ketik  /0 "Isuue Sudah terselesaikan"
ketik  /9 "Kembali ke menu utama"
    `,
    "/2.1":
        `
Berikut guidence lengkap Follow Up issue, Silahkan download File pada link berikut: 
Guidance lengkap follow up issue
https://bitly.ws/3g94J
              
What's New Follow Issue
https://bitly.ws/3g95e
      
ketik  /2 "Mencari Guidance lainnya"
ketik  /0 "Guidance sudah berhasil di download"
ketik  /9 "Kembali ke menu utama"
    `,
    "/2.2":
        `
"Berikut guidence lengkap Report Productivity, Silahkan download File pada link berikut: 
Guidance lengkap Report Productivity
https://bitly.ws/3g957
      
ketik  /2 ""Mencari Guidance lainnya""
ketik  /0 ""Guidance sudah berhasil di download""
ketik  /9 ""Kembali ke menu utama"
    `,
    "/2.3":
        `
Berikut guidence lengkap Report Attendance, Silahkan download File pada link berikut: 
Guidance lengkap Report Attendance 
https://bitly.ws/3g95F
      
ketik  /2 "Mencari Guidance lainnya"
ketik  /0 "Guidance sudah berhasil di download"
ketik  /9 "Kembali ke menu utama"
    `,
    "/2.4":
        `
Berikut guidence lengkap Competitor Activity, Silahkan download File pada link berikut: 
Guidance lengkap Competitor Activity
https://bitly.ws/3g95L
      
ketik  /2 "Mencari Guidance lainnya"
ketik  /0 "Guidance sudah berhasil di download"
ketik  /9 "Kembali ke menu utama"
    `,
    "/2.5":
        `
Berikut guidence lengkap New Check Stock, Silahkan download File pada link berikut: 
Guidance lengkap New Check Stock
https://bitly.ws/3g95V
      
ketik /2 "Mencari Guidance lainnya"
ketik /0 "Guidance sudah berhasil di download"
ketik /9 "Kembali ke menu utama"
    `,
    "/3.1":
        `
    "Halo sahabat Grouping issue merupakan bagian dari follow up issue yang 
    menggabungkan beberapa issue untuk memberikan kemudahan 
    kepada pengguna dalam melakukan action atas issue yang dibuat"
      
ketik /3 "Mencari FAQ lainnya"
ketik /0 "Pertanyaan sudah terjawab"
ketik /9 "Kembali ke menu utama"
    `,
    "/3.2":
        `
    "Berikut langkah dalam menggunakan grouping issue.
    1. Buka menu report monitoring joblist.
    2. Pillih issue yang memiliki kesamaaan kategori permaslaahan.
    3. Ceklis menggunakan cek box dipojok kanan, Pilih tombol Action
    4. Masuk ke halaman Grouping issue, lengkapi semua filed/kolom yang ada.
    
    Untuk Detail penggunaanya anda dapat mengunduh Guideline pada link dibawah ini :
    Guidance lengkap follow up issue
    https://bitly.ws/3g94J
          
    What's New Follow Issue
    https://bitly.ws/3g95e"
      
ketik /3 "Mencari FAQ lainnya"
ketik /0 "Pertanyaan sudah terjawab"
ketik /9 "Kembali ke menu utama"
    `,
    "/3.3":
        `
    "Pengguna yang dapat melakukan grouping issue dimulai dari TL>SS>RSM>GRSM>NSM"
      
ketik /3 "Mencari FAQ lainnya"
ketik /0 "Pertanyaan sudah terjawab"
ketik /9 "Kembali ke menu utama"
    `,
    "/3.4":
        `
    "Saat ini MD tidak bisa melakukan groupin issue. MD hanya akan dapat membuat issue 
    tungga atas permaslahan di outlet. MD juga hanya akan menerima delegasi issue atas 
    issue yang dibuatnya maupun yang ditujukaan langsung ke MD sesuai hirarkinya"
      
ketik /3 "Mencari FAQ lainnya"
ketik /0 "Pertanyaan sudah terjawab"
ketik /9 "Kembali ke menu utama"
    `,
    "/3.5":
        `
    "Issuu dalam bentuk groupinh dapat digabungkan dengan group issue lainnya dengan 
    memperhatikan beberpa as[ek yaitu kesamaan katagori."
      
ketik /3 "Mencari FAQ lainnya"
ketik /0 "Pertanyaan sudah terjawab"
ketik /9 "Kembali ke menu utama"
    `,
    "/3.6":
        `
    "Jika issue di Finish/done salam bentuk group maka akan menyelesaikan seluruh issue 
    yang ada pada group itu dianggap sudah selesai."
      
ketik /3 "Mencari FAQ lainnya"
ketik /0 "Pertanyaan sudah terjawab"
ketik /9 "Kembali ke menu utama"
    `,
    "/3.7":
        `
    "Deadline issue tidak mempengaruhi tenggat waktu penyelesaian issue pada group issue.
    Deadline issue tetap hanya kan ada pada delegasi issue yang sebelumnya dibuat oleh
    PIC yang menemukan issue"
      
ketik /3 "Mencari FAQ lainnya"
ketik /0 "Pertanyaan sudah terjawab"
ketik /9 "Kembali ke menu utama"
    `,
}
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async msg => {

    const pesan = msg.body.toLowerCase()
    if (pesan == "/tanya axara") {
        await msg.reply("Halo sahabat saat ini anda sedang terhubung  dengan aXara \n Ada yang bisa Axara bantu\n\n Tambahkan /angka untuk masuk ke menu berikutnya\n /1. Issue \n /2. Manual Guide \n /3. FAQ  ");
    }
    // if (pesan == "/tanya selamat pagi") {
    //     await msg.reply("Sukses Selalu, selamat bergabung dengan aXara \n terima kasih telah menggunakan layanan kami \n Ada yang bisa Aksara bantu\n 1. Issue \n 2. Manual Guide \n 3. FAQ  ");
    // }
    // if (pesan == "/tanya selamat siang") {
    //     await msg.reply("Semangat Terus, selamat bergabung dengan aXara \n terima kasih telah menggunakan layanan kami \n Ada yang bisa Aksara bantu\n 1. Issue \n 2. Manual Guide \n 3. FAQ  ");
    // }
    // if (pesan == "/tanya selamat sore") {
    //     await msg.reply("Tetap Semangat, selamat bergabung dengan aXara \n terima kasih telah menggunakan layanan kami \n Ada yang bisa Aksara bantu\n 1. Issue \n 2. Manual Guide \n 3. FAQ  ");
    // }
    // if (pesan == "/tanya selamat malam") {
    //     await msg.reply("Tetap Semangat, selamat bergabung dengan aXara \n terima kasih telah menggunakan layanan kami \n Ada yang bisa Aksara bantu\n 1. Issue \n 2. Manual Guide \n 3. FAQ  ");
    // }
    if (Object.keys(template).includes(pesan)) {
        await msg.reply(template[pesan])
        if (Object.keys(templateMedia).includes(pesan)) {
            const media = MessageMedia.fromFilePath(templateMedia[pesan]);
            await msg.reply(media);
        }

    }
});

client.initialize();

// const qrcode = require('qrcode-terminal');
// const { askQuestion } = require('./utils');

// const { Client } = require('whatsapp-web.js');
// const client = new Client();

// client.on('qr', (qr) => {
//     qrcode.generate(qr, { small: true });
// });

// client.on('ready', () => {
//     console.log('Client is ready!');
// });

// client.on('message', async msg => {

//     if (pesan.startsWith('/tanya') || pesan.includes('tanya')) {
//       const response = await askQuestion(pesan);
//       await msg.reply(response);
//     } else {
//       await msg.reply("Ini pesan template: \n Untuk bertanya silahkan ketik /tanya <pertanyaan> \n\n Contoh: /tanya 1.1 \n\n Terima kasih!")
//     }
// })

// client.initialize();