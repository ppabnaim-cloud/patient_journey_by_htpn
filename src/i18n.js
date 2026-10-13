/* ===========================================================================
   i18n.js — RULE 2 of this project: every user-facing string goes through
   L(en, ms) and is read with pick(value, lang). Clinical text included, not
   just the buttons. A bare string literal in a component is a bug.

   REGISTER
   The Malay is written in the formal register a government hospital uses with
   the public: "Sila", full verb forms, proper clinical nouns (Indikasi,
   Diagnosis, Reaksi, Tahap Keterukan), and no colloquial contractions. It is
   not a word-for-word rendering of the English — several strings are phrased
   differently in each language because the natural formal phrasing differs.
   ========================================================================= */

export const LANGS = [
  { id: 'ms', label: 'BM', full: 'Bahasa Melayu' },
  { id: 'en', label: 'EN', full: 'English' }
]

export const DEFAULT_LANG = 'ms'

export const L = (en, ms) => ({ en, ms })

/* Accepts a bilingual object, or a plain string for things that are the same
   in both languages (a number, a proper noun, a URL). Falls back to English
   rather than rendering nothing, so a missing translation is visible as
   English text and never as a blank space. */
export function pick (value, lang) {
  if (value == null) return ''
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  return value[lang] ?? value.en ?? value.ms ?? ''
}

export const T = {
  /* --- shell --------------------------------------------------------- */
  appName: L('Patient Journey', 'Perjalanan Pesakit'),
  appBy: L('by HTPN', 'oleh HTPN'),
  prototype: L('Prototype', 'Prototaip'),
  credit: L('Prototype design by Dr Naim, HTPN', 'Reka bentuk prototaip oleh Dr Naim, HTPN'),
  back: L('Back', 'Kembali'),
  next: L('Next', 'Seterusnya'),
  close: L('Close', 'Tutup'),
  save: L('Save', 'Simpan'),
  cancel: L('Cancel', 'Batal'),
  add: L('Add', 'Tambah'),
  remove: L('Remove', 'Buang'),
  open: L('Open', 'Buka'),
  step: L('Step', 'Langkah'),
  of: L('of', 'daripada'),
  page: L('Page', 'Halaman'),
  none: L('No records yet', 'Belum ada rekod'),
  none_hint: L(
    'Add an entry below, or photograph the document and let the app read it for you.',
    'Tambah catatan di bawah, atau ambil gambar dokumen dan biarkan aplikasi membacanya untuk anda.'
  ),
  offlineReady: L('Works offline', 'Berfungsi luar talian'),
  needsInternet: L('Requires an internet connection', 'Memerlukan sambungan internet'),
  settings: L('Privacy & settings', 'Privasi & Tetapan'),
  example: L('Example', 'Contoh'),
  ann_open: L('What this means for you', 'Apa maksudnya bagi anda'),
  ann_source: L('Source', 'Sumber'),
  ann_headline_note: L(
    'Headline as given in the link; not quoted word for word.',
    'Tajuk seperti yang terdapat dalam pautan; bukan petikan kata demi kata.'
  ),

  /* --- tabs ---------------------------------------------------------- */
  tab_dashboard: L('My Journey', 'Perjalanan Saya'),
  tab_records: L('My Records', 'Rekod Saya'),
  tab_measurements: L('Monitoring', 'Pemantauan'),
  tab_wayfinding: L('Finding Your Way', 'Mencari Arah'),
  tab_iqms: L('Queue Number', 'Nombor Giliran'),
  tab_myubat: L('Medicine Delivery', 'Penghantaran Ubat'),
  tab_rakyat: L("The Public's Role", 'Peranan Rakyat'),
  tab_gayahidup: L('Healthy Living', 'Gaya Hidup Sihat'),

  /* Short labels for the tab bar itself. Eight tabs across a 360px phone
     leaves about seven characters each, and a truncated word with an ellipsis
     names nothing. The full names stay on the screen headings. */
  short_dashboard: L('Charts', 'Carta'),
  short_records: L('Records', 'Rekod'),
  short_measurements: L('Monitor', 'Pantau'),
  short_wayfinding: L('Map', 'Arah'),
  short_iqms: L('Queue', 'Giliran'),
  short_myubat: L('Medicine', 'Ubat'),
  short_rakyat: L('Public', 'Rakyat'),
  short_gayahidup: L('Active', 'Sihat'),

  /* --- dashboard ----------------------------------------------------- */
  dash_lead: L(
    'A summary of your record, with whatever needs attention placed first.',
    'Ringkasan rekod anda, dengan perkara yang memerlukan perhatian diutamakan.'
  ),
  dash_sub_overview: L('Overview', 'Gambaran Keseluruhan'),
  dash_sub_actions: L('Needs attention', 'Perlu Perhatian'),
  dash_sub_checked: L('Reviewed', 'Telah Disemak'),
  dash_empty_body: L(
    'Nothing has been entered yet, so every figure here is zero. This screen only ever shows what you have recorded.',
    'Belum ada apa-apa dimasukkan, maka setiap angka di sini adalah sifar. Skrin ini hanya memaparkan apa yang telah anda rekodkan.'
  ),
  dash_empty_cta: L('Start my record', 'Mulakan rekod saya'),
  dash_nothing_to_act: L('Nothing requires action', 'Tiada tindakan diperlukan'),
  dash_print: L('Print a summary for the clinic', 'Cetak ringkasan untuk klinik'),

  kpi_meds: L('Medicines', 'Ubat'),
  kpi_meds_sub: L('currently taking', 'sedang diambil'),
  kpi_issues: L('Active problems', 'Masalah Aktif'),
  kpi_issues_sub: L('on your record', 'dalam rekod anda'),
  kpi_allergy: L('Allergies', 'Alahan'),
  kpi_allergy_sub: L('recorded', 'direkodkan'),
  kpi_allergy_none: L('None recorded — worth adding', 'Belum direkodkan — wajar ditambah'),
  kpi_allergy_more: L('more', 'lagi'),
  kpi_lastlab: L('Last blood test', 'Ujian Darah Terakhir'),
  kpi_days_ago: L('days ago', 'hari lalu'),
  kpi_never: L('none recorded', 'belum direkodkan'),

  chart_hba1c: L('HbA1c over time', 'HbA1c mengikut masa'),
  chart_weight: L('Weight over time', 'Berat mengikut masa'),
  chart_bmi: L('BMI over time', 'BMI mengikut masa'),
  chart_bp: L('Blood pressure over time', 'Tekanan darah mengikut masa'),
  chart_fpg: L('Fasting glucose over time', 'Glukosa puasa mengikut masa'),
  chart_steps: L('Steps over time', 'Langkah mengikut masa'),
  chart_kcal: L('Energy burned over time', 'Tenaga dibakar mengikut masa'),
  chart_compare_note: L(
    'Steps, energy and weight are shown on the same dates so you can look at them together. The app does not calculate a relationship between them: weight is moved by food, fluid, illness and medicines as much as by walking, and a month of readings from one person cannot separate those.',
    'Langkah, tenaga dan berat dipaparkan pada tarikh yang sama supaya anda boleh melihatnya bersama. Aplikasi ini tidak mengira hubungan antara ketiga-tiganya: berat dipengaruhi oleh makanan, cecair, penyakit dan ubat sama banyak dengan berjalan, dan sebulan bacaan daripada seorang individu tidak dapat memisahkan faktor-faktor itu.'
  ),
  m_activity: L('From your watch', 'Daripada jam anda'),
  /* --- appointments (tab 1) --- */
  tab_appt: L('Record Your Appointments', 'Rekodkan Janji Temu Anda'),
  short_appt: L('Appt', 'Janji'),
  appt_lead: L(
    'Your appointments, kept on this phone. Type in what your appointment card says and the app will remind you the day before.',
    'Janji temu anda, disimpan dalam telefon ini. Taipkan apa yang tertera pada kad janji temu anda dan aplikasi akan mengingatkan anda sehari sebelumnya.'
  ),
  appt_next: L('Coming up', 'Akan Datang'),
  appt_past: L('Already been', 'Telah Berlalu'),
  appt_add: L('Add', 'Tambah'),
  appt_none: L('No appointment saved yet', 'Tiada janji temu disimpan lagi'),
  appt_none_past: L('Nothing here yet', 'Tiada apa-apa di sini lagi'),
  appt_dept: L('Department', 'Jabatan'),
  appt_clinic: L('Clinic or unit', 'Klinik atau unit'),
  appt_date: L('Date', 'Tarikh'),
  appt_time: L('Time (if your card gives one)', 'Masa (jika tertera pada kad)'),
  appt_note: L('Note to yourself', 'Nota untuk diri sendiri'),
  appt_note_eg: L('e.g. fasting since midnight, bring your scan films', 'cth. berpuasa sejak tengah malam, bawa filem imbasan'),
  appt_save: L('Save appointment', 'Simpan janji temu'),
  appt_today: L('TODAY', 'HARI INI'),
  appt_tomorrow: L('TOMORROW', 'ESOK'),
  appt_in_days: L('In {n} days', '{n} hari lagi'),
  appt_days_ago: L('{n} days ago', '{n} hari lalu'),
  appt_remind_on: L('Reminder set for', 'Peringatan ditetapkan pada'),
  appt_calendar: L('Add to phone calendar', 'Tambah ke kalendar telefon'),
  appt_calendar_all: L('Put them all in my calendar', 'Masukkan semuanya ke kalendar saya'),
  appt_how_title: L('How the reminder reaches you', 'Bagaimana peringatan sampai kepada anda'),
  appt_remove: L('Remove', 'Buang'),
  appt_queried: L('Name to confirm with HTPN', 'Nama untuk disahkan dengan HTPN'),
  appt_phase2: L('Coming later', 'Akan Datang'),
  appt_pick_dept: L('Choose a department', 'Pilih jabatan'),
  appt_pick_clinic: L('Choose a clinic or unit', 'Pilih klinik atau unit'),
  /* --- feedback (tab 9) --- */
  /* --- the home hub --- */
  home_title: L('Patient Journey', 'Perjalanan Pesakit'),
  home_lead: L('Everything in one place. Tap any card to open it.', 'Semuanya di satu tempat. Ketik mana-mana kad untuk membukanya.'),
  home_back: L('Home', 'Utama'),
  d_appointments: L('Your clinic dates, and a reminder the day before', 'Tarikh klinik anda, dan peringatan sehari sebelumnya'),
  d_dashboard: L('Your readings over time, at a glance', 'Bacaan anda dari semasa ke semasa, sepintas lalu'),
  d_records: L('Medicines, allergies, operations, results', 'Ubat, alahan, pembedahan, keputusan'),
  d_measurements: L('Weight, blood pressure, sugar, steps', 'Berat, tekanan darah, gula, langkah'),
  d_wayfinding: L('Find the right building and department', 'Cari bangunan dan jabatan yang betul'),
  d_iqms: L('Check the queue before you set off', 'Semak giliran sebelum anda bertolak'),
  d_myubat: L('Have repeat medicines delivered', 'Dapatkan ubat ulangan dihantar ke rumah'),
  d_rakyat: L('When to come, and when not to', 'Bila perlu datang, dan bila tidak perlu'),
  d_feedback: L('Thank the team, or tell us what to fix', 'Hargai pasukan kami, atau beritahu apa perlu diperbaiki'),
  tab_fb: L('Feedback', 'Maklum Balas'),
  short_fb: L('Say', 'Suara'),
  fb_title: L('Tell us how we did', 'Beritahu Kami Pengalaman Anda'),
  fb_lead: L(
    'Rate the service and tell HTPN what happened. This is the one screen in the app that sends what you type to the hospital.',
    'Nilaikan perkhidmatan kami dan beritahu HTPN apa yang berlaku. Ini satu-satunya skrin dalam aplikasi ini yang menghantar apa yang anda taip kepada pihak hospital.'
  ),
  fb_sent_banner: L('What you type here is sent to HTPN', 'Apa yang anda taip di sini akan dihantar kepada HTPN'),
  fb_step_what: L('What for', 'Tujuan'),
  fb_step_detail: L('Details', 'Butiran'),
  fb_step_you: L('About you', 'Tentang Anda'),
  fb_rating: L('How was the service?', 'Bagaimana perkhidmatan kami?'),
  fb_area: L('Which department or service?', 'Jabatan atau perkhidmatan yang mana?'),
  fb_area_pick: L('Choose one', 'Pilih satu'),
  fb_visit: L('When did this happen?', 'Bilakah ia berlaku?'),
  fb_message: L('In your own words', 'Dalam ayat anda sendiri'),
  fb_message_eg: L('What happened, and who was involved if you remember', 'Apa yang berlaku, dan siapa yang terlibat jika anda ingat'),
  fb_photo: L('Attach a photograph', 'Lampirkan gambar'),
  fb_photo_note: L(
    'Made smaller on this phone before it is sent, and the location stamp your camera adds is dropped.',
    'Dikecilkan dalam telefon ini sebelum dihantar, dan cap lokasi daripada kamera anda akan digugurkan.'
  ),
  fb_photo_remove: L('Remove photograph', 'Buang gambar'),
  fb_photo_toobig: L('That image is too large even after shrinking. Try another.', 'Gambar itu terlalu besar walaupun selepas dikecilkan. Sila cuba yang lain.'),
  fb_anon: L('Send this anonymously', 'Hantar tanpa nama'),
  fb_anon_note: L(
    'No name, registration number or email is sent. HTPN reads it, and cannot reply.',
    'Tiada nama, nombor pendaftaran atau e-mel akan dihantar. HTPN akan membacanya, tetapi tidak dapat membalas.'
  ),
  fb_name: L('Name', 'Nama'),
  fb_rn: L('Hospital registration number (RN)', 'Nombor pendaftaran hospital (RN)'),
  fb_rn_note: L('If you have it to hand. It helps HTPN find your case.', 'Jika ada pada anda. Ia membantu HTPN mengesan kes anda.'),
  fb_email: L('Email', 'E-mel'),
  fb_age: L('Age', 'Umur'),
  fb_ic: L('IC number', 'Nombor kad pengenalan'),
  fb_send: L('Send to HTPN', 'Hantar kepada HTPN'),
  fb_sending: L('Sending…', 'Menghantar…'),
  fb_sent: L('Sent. Thank you.', 'Telah dihantar. Terima kasih.'),
  fb_ref: L('Your reference', 'Rujukan anda'),
  fb_ref_note: L('Write this down if you would like to follow it up.', 'Catatkan nombor ini sekiranya anda ingin membuat susulan.'),
  fb_another: L('Send another', 'Hantar satu lagi'),
  fb_fail_off: L(
    'The form is not accepting submissions yet. Nothing was sent, and what you wrote is still here.',
    'Borang ini belum menerima penghantaran. Tiada apa-apa yang dihantar, dan apa yang anda tulis masih ada di sini.'
  ),
  fb_fail_net: L(
    'That did not go through. What you wrote is still here — try again when you have a connection.',
    'Penghantaran tidak berjaya. Apa yang anda tulis masih ada di sini — sila cuba semula apabila anda mempunyai sambungan.'
  ),
  fb_need: L('Please choose a department and write a few words.', 'Sila pilih jabatan dan tulis beberapa patah perkataan.'),
  fb_need_email: L('An email address is needed if you would like a reply.', 'Alamat e-mel diperlukan sekiranya anda mahukan balasan.'),
  fb_bad_email: L('That email address does not look right.', 'Alamat e-mel itu kelihatan tidak betul.'),
  fb_also_share: L('Share it on Facebook yourself too', 'Kongsikan juga di Facebook anda sendiri'),
  fb_official: L('Hospital form', 'Borang Hospital'),
  fb_goes_to: L('Goes to', 'Dihantar kepada'),
  fb_back: L('Choose something else', 'Pilih yang lain'),
  fb_board: L('Appreciation in 2026', 'Penghargaan 2026'),
  fb_board_lead: L(
    'Every one of these began with somebody deciding to say so. Yours would be the next.',
    'Setiap satu daripadanya bermula apabila seseorang mengambil keputusan untuk menyuarakannya. Penghargaan anda akan menjadi yang seterusnya.'
  ),
  fb_board_total: L('appreciations received', 'penghargaan diterima'),
  fb_board_places: L('wards, clinics and units named', 'wad, klinik dan unit dinamakan'),
  fb_board_period: L('Between {a} and {b}', 'Antara {a} dan {b}'),
  fb_board_top: L('Where they went', 'Ke mana ia pergi'),
  fb_board_rest: L('{n} more places received one each', '{n} tempat lain menerima satu setiap satu'),
  fb_board_teaser: L('{n} appreciations received in 2026 — see where they went', '{n} penghargaan diterima pada 2026 — lihat ke mana ia pergi'),
  fb_board_live: L('Updated from HTPN\u2019s register', 'Dikemas kini daripada daftar HTPN'),
  fb_board_asat: L('As at {d}', 'Sehingga {d}'),
  fb_who_reads: L('Who reads this', 'Siapa yang membacanya'),
  gh_sub_tpl: L('Templates', 'Templat'),
  ubat_read_news: L('Read the news report', 'Baca laporan berita'),
  gh_sub_how: L('How to post', 'Cara Berkongsi'),
  gh_tab_title: L('With HTPN on Social Media', 'Bersama Media Sosial HTPN'),
  gh_tab_lead: L(
    'Two things we share with the hospital page: staying well, and thanking the people who look after us.',
    'Dua perkara yang kami kongsikan bersama halaman hospital: kekal sihat, dan menghargai mereka yang merawat kita.'
  ),
  gh_h_tags: L('Hashtags to use', 'Hashtag untuk digunakan'),
  gh_h_posts: L('Ready-made posts', 'Templat hantaran'),
  gh_h_steps: L('Three steps', 'Tiga langkah'),
  gh_tpl_title: L('Hashtags and ready-made posts', 'Hashtag dan templat hantaran'),
  gh_tag_htpn: L('Tag the hospital', 'Tandakan hospital'),
  gh_open_page: L('Open the hospital page', 'Buka halaman hospital'),
  gh_copy_post: L('Copy the post', 'Salin hantaran'),
  gh_unchecked: L('Not yet checked', 'Belum disemak'),
  gh_also: L('Post it with', 'Kongsikan bersama'),
  gh_recent: L('Latest entries', 'Entri terkini'),
  m_steps_help: L(
    'Steps and energy are saved with your walking log, so they appear on the same charts whichever screen you enter them on.',
    'Langkah dan tenaga disimpan bersama log jalan kaki anda, maka ia dipaparkan pada carta yang sama tidak kira skrin mana anda memasukkannya.'
  ),
  chart_meds_by: L('Medicines by indication', 'Ubat mengikut indikasi'),
  chart_cutoff: L('Cut-off', 'Titik potong'),
  chart_other: L('Other', 'Lain-lain'),
  chart_not_recorded: L('Not recorded', 'Belum direkodkan'),
  chart_need_two: L(
    'Two or more entries are needed before a trend can be drawn.',
    'Dua catatan atau lebih diperlukan sebelum arah aliran dapat dilukis.'
  ),
  chart_table_view: L('View as a table', 'Lihat sebagai jadual'),
  chart_chart_view: L('View as a chart', 'Lihat sebagai carta'),

  level_warning: L('Read this first', 'Perhatian Segera'),
  level_attention: L('Raise with your doctor', 'Bincang Dengan Doktor'),
  level_watch: L('Worth mentioning', 'Patut Dimaklumkan'),
  level_none: L('Recorded', 'Direkodkan'),
  whatToDo: L('Recommended action', 'Tindakan Yang Disyorkan'),
  basedOn: L('Reference', 'Rujukan'),
  notBasedOn: L('Not based on a guideline', 'Tiada garis panduan rujukan'),

  /* --- records ------------------------------------------------------- */
  rec_lead: L(
    'Your own record, kept on this device. Work through the stations in order, or go straight to the one you need.',
    'Rekod anda sendiri, disimpan pada peranti ini. Lengkapkan setiap stesen mengikut urutan, atau terus ke stesen yang diperlukan.'
  ),
  rec_station: L('Station', 'Stesen'),
  rec_progress: L('stations completed', 'stesen telah dilengkapkan'),
  sec_meds: L('Medicines', 'Ubat'),
  sec_issues: L('Active problems', 'Masalah Aktif'),
  sec_allergies: L('Allergies', 'Alahan'),
  sec_surgery: L('Operations', 'Pembedahan'),
  sec_bloods: L('Blood results', 'Keputusan Darah'),
  sec_imaging: L('Imaging reports', 'Laporan Pengimejan'),
  sec_activity: L('Walking & activity', 'Jalan Kaki & Aktiviti'),

  /* Short names for the station pipeline; six across a phone leaves little
     room, and a truncated station name tells a patient nothing. */
  short_meds: L('Medicines', 'Ubat'),
  short_issues: L('Problems', 'Masalah'),
  short_allergies: L('Allergies', 'Alahan'),
  short_surgery: L('Surgery', 'Bedah'),
  short_bloods: L('Bloods', 'Darah'),
  short_imaging: L('Scans', 'Imbasan'),
  short_activity: L('Activity', 'Aktiviti'),

  col_drug: L('Medicine', 'Ubat'),
  col_dose: L('Dose', 'Dos'),
  col_indication: L('Indication / diagnosis', 'Indikasi / Diagnosis'),
  col_status: L('Status', 'Status'),
  status_on: L('Taking', 'Sedang Diambil'),
  status_off: L('Stopped', 'Dihentikan'),
  col_started: L('Started on', 'Mula Pada'),
  col_until: L('Supply until', 'Bekalan Hingga'),
  col_stopped: L('Stopped on', 'Dihentikan Pada'),
  med_since: L('since', 'sejak'),
  med_until: L('until', 'hingga'),
  med_until_help: L(
    'The date your current supply runs out, or the date the doctor reviews it. Leave it blank if you do not know.',
    'Tarikh bekalan semasa anda habis, atau tarikh doktor menyemaknya semula. Biarkan kosong jika anda tidak pasti.'
  ),
  med_stopped_help: L(
    'The date you stopped taking it. This matters as much as what you are taking now.',
    'Tarikh anda berhenti mengambilnya. Ini sama pentingnya dengan apa yang anda ambil sekarang.'
  ),

  col_problem: L('Problem', 'Masalah'),
  col_since: L('Since', 'Sejak'),
  status_active: L('Active', 'Aktif'),
  status_resolved: L('Resolved', 'Selesai'),

  col_substance: L('Cause of allergy', 'Punca Alahan'),
  col_reaction: L('Reaction', 'Reaksi'),
  col_severity: L('Severity', 'Tahap Keterukan'),
  sev_mild: L('Mild', 'Ringan'),
  sev_severe: L('Severe', 'Teruk'),
  sev_severe_help: L(
    'Record it as severe if you had difficulty breathing, swelling, fainting, or required emergency treatment.',
    'Rekodkan sebagai teruk sekiranya anda mengalami kesukaran bernafas, bengkak, pengsan, atau memerlukan rawatan kecemasan.'
  ),
  allergy_none_known: L('Record that I have no known allergy', 'Rekodkan bahawa saya tiada alahan yang diketahui'),
  allergy_none_known_label: L('No known allergy', 'Tiada alahan yang diketahui'),

  col_operation: L('Operation', 'Pembedahan'),
  col_date: L('Date', 'Tarikh'),
  col_where: L('Facility', 'Tempat'),

  col_test: L('Investigation', 'Ujian'),
  col_value: L('Result', 'Keputusan'),
  col_range: L('Reference range on your report', 'Julat Rujukan pada Laporan Anda'),
  range_low: L('Lower', 'Bawah'),
  range_high: L('Upper', 'Atas'),
  range_help: L(
    'Copy the two figures printed beside your result. Every laboratory sets its own range, so this app will not assume them on your behalf.',
    'Salin dua angka yang dicetak di sebelah keputusan anda. Setiap makmal menetapkan julatnya sendiri, maka aplikasi ini tidak akan mengandaikannya bagi pihak anda.'
  ),

  /* --- imaging ------------------------------------------------------- */
  img_lead: L(
    'Scan reports, kept in your own words or photographed. Record the conclusion, not the whole report.',
    'Laporan imbasan, disimpan dalam kata-kata anda sendiri atau difotokan. Rekodkan kesimpulannya, bukan keseluruhan laporan.'
  ),
  col_modality: L('Type of scan', 'Jenis Imbasan'),
  col_bodypart: L('Body part', 'Bahagian Badan'),
  col_finding: L('Conclusion in the report', 'Kesimpulan dalam Laporan'),
  modality_ct: L('CT scan', 'Imbasan CT'),
  modality_mri: L('MRI', 'MRI'),
  modality_us: L('Ultrasound', 'Ultrasound'),
  modality_xray: L('X-ray', 'X-ray'),
  modality_other: L('Other', 'Lain-lain'),
  img_help: L(
    'Copy the line under "Impression" or "Kesimpulan" at the end of the report. That single line is what the next doctor needs.',
    'Salin ayat di bawah "Impression" atau "Kesimpulan" pada penghujung laporan. Ayat tunggal itulah yang diperlukan oleh doktor seterusnya.'
  ),

  /* --- entry methods / OCR ------------------------------------------- */
  entry_camera: L('Take a photograph', 'Ambil Gambar'),
  entry_upload: L('Upload an image', 'Muat Naik Gambar'),
  entry_manual: L('Enter manually', 'Masukkan Sendiri'),
  ocr_run: L('Read the text in this image', 'Baca teks dalam gambar ini'),
  ocr_working: L('Reading…', 'Sedang membaca…'),
  ocr_unavailable: L(
    'Reading text from images is unavailable in this build. The image is still saved, and you may enter the details beside it.',
    'Pembacaan teks daripada gambar tidak tersedia dalam binaan ini. Gambar tetap disimpan, dan anda boleh memasukkan butirannya di sebelah.'
  ),
  ocr_result_lead: L(
    'This is what the app believes it read. It makes mistakes, particularly with handwriting. Please check every line before saving it.',
    'Ini ialah apa yang aplikasi fikir telah dibacanya. Ia kerap tersilap, terutamanya pada tulisan tangan. Sila semak setiap baris sebelum menyimpannya.'
  ),
  ocr_accept: L('Use these details', 'Guna butiran ini'),
  ocr_discard: L('Discard and enter manually', 'Buang dan masukkan sendiri'),
  ocr_nothing: L('No readable text was found in that image.', 'Tiada teks yang boleh dibaca ditemui dalam gambar itu.'),

  /* --- measurements -------------------------------------------------- */
  meas_lead: L(
    'The readings you take yourself, followed over time. Measure the same way each time — the same scale, at a similar time of day.',
    'Bacaan yang anda ambil sendiri, dipantau dari semasa ke semasa. Ukur dengan cara yang sama setiap kali — penimbang yang sama, pada waktu yang lebih kurang serupa.'
  ),
  m_fpg: L('Fasting blood sugar', 'Gula Dalam Darah Puasa'),
  m_fpg_how: L(
    'Taken before eating in the morning. It is saved with your blood results, so it appears on the same chart as a laboratory fasting glucose.',
    'Diambil sebelum makan pada waktu pagi. Ia disimpan bersama keputusan darah anda, maka ia dipaparkan pada carta yang sama dengan glukosa puasa makmal.'
  ),
  m_weight: L('Weight', 'Berat'),
  m_height: L('Height', 'Tinggi'),
  m_waist: L('Waist circumference', 'Lilit Pinggang'),
  m_bmi: L('BMI', 'BMI'),
  m_bp: L('Blood pressure', 'Tekanan Darah'),
  m_sys: L('Upper (systolic)', 'Atas (sistolik)'),
  m_dia: L('Lower (diastolic)', 'Bawah (diastolik)'),
  m_bp_how: L(
    'Sit and rest for five minutes first, feet flat, arm supported at heart level, and do not talk while it measures.',
    'Duduk dan berehat selama lima minit dahulu, tapak kaki rata di lantai, lengan disokong pada aras jantung, dan jangan bercakap semasa pengukuran.'
  ),
  m_gender: L('Gender', 'Jantina'),
  m_male: L('Male', 'Lelaki'),
  m_female: L('Female', 'Perempuan'),
  m_gender_why: L(
    'Requested solely because the waist circumference threshold cited by this app differs between men and women. It is not transmitted anywhere.',
    'Dimohon semata-mata kerana ambang lilit pinggang yang dirujuk oleh aplikasi ini berbeza antara lelaki dan perempuan. Ia tidak dihantar ke mana-mana.'
  ),
  m_history: L('Previous entries', 'Catatan Terdahulu'),
  m_waist_how: L(
    'Stand upright, place the tape around your waist at the level of the navel, breathe out, then take the reading.',
    'Berdiri tegak, lilitkan pita di pinggang pada aras pusat, hembus nafas, kemudian ambil bacaan.'
  ),

  /* --- wayfinding ---------------------------------------------------- */
  way_lead: L(
    'HTPN occupies two sites. Please check which one your appointment letter names before setting off.',
    'HTPN terletak di dua lokasi. Sila semak lokasi yang dinyatakan dalam surat temujanji anda sebelum bertolak.'
  ),
  way_campuses: L('The two main sites', 'Dua Lokasi Utama'),
  way_departments: L('Departments & units', 'Jabatan & Unit'),
  way_directions: L('Get directions', 'Dapatkan Arah'),
  way_exact: L('Exact location', 'Lokasi tepat'),
  way_needs_net: L(
    'Opening a map requires an internet connection. The list itself works offline.',
    'Membuka peta memerlukan sambungan internet. Senarai ini berfungsi tanpa talian.'
  ),
  way_unconfirmed_banner: L(
    'HTPN has not yet confirmed names for the remaining points. Their exact-location links still open the correct place in Google Maps.',
    'HTPN masih belum mengesahkan nama bagi titik yang selebihnya. Pautan lokasi tepatnya tetap membuka tempat yang betul dalam Google Maps.'
  ),
  before_you_come: L('Before you set off', 'Sebelum Anda Bertolak'),
  emergencyHead: L('In an emergency', 'Dalam Kecemasan'),

  /* --- iqms ---------------------------------------------------------- */
  iqms_lead: L(
    'Check your queue number from anywhere, rather than waiting outside the department.',
    'Semak nombor giliran anda dari mana-mana, tanpa perlu menunggu di luar jabatan.'
  ),
  iqms_open: L('Open iQMS for HTPN', 'Buka iQMS untuk HTPN'),
  iqms_poster_alt: L('iQMS poster, HTPN', 'Poster iQMS, HTPN'),
  tapToEnlarge: L('Tap to enlarge', 'Ketik untuk besarkan'),

  /* --- myubat -------------------------------------------------------- */
  ubat_lead: L(
    'Repeat medicines delivered to your home, so that you need not travel in and queue for them.',
    'Ubat ulangan dihantar terus ke rumah anda, supaya anda tidak perlu datang dan beratur untuk mendapatkannya.'
  ),
  ubat_open: L('Get MyUbat on Google Play', 'Dapatkan MyUbat di Google Play'),
  ubat_brief: L('Read the official briefing', 'Baca taklimat rasmi'),
  ubat_howget: L('How to obtain it', 'Cara Mendapatkannya'),
  ubat_otherphone: L('Using an iPhone?', 'Menggunakan iPhone?'),
  ubat_good_for: L('Suitable for', 'Sesuai Untuk'),
  ubat_not_for: L('Not suitable for', 'Tidak Sesuai Untuk'),
  ubat_cold: L('Cold chain', 'Rantaian Sejuk'),
  ubat_posters: L('Official posters', 'Poster Rasmi'),
  ubat_preview: L('Official posters — tap to read', 'Poster rasmi — ketik untuk membaca'),
  ubat_charge: L('What it costs', 'Kosnya'),
  ubat_confirm: L('Confirm before ordering', 'Sahkan sebelum memesan'),
  ubat_reported_by: L('Reported by', 'Dilaporkan oleh'),

  /* --- rakyat / triage ----------------------------------------------- */
  rakyat_sub_posters: L('Posters', 'Poster'),
  rakyat_sub_triage: L('Emergency, or not?', 'Kecemasan, atau tidak?'),
  poster_download: L('Download', 'Muat turun'),
  poster_credit: L('Poster by', 'Poster oleh'),
  triage_original: L('View the original poster', 'Lihat poster asal'),
  triage_pick: L('Which list do you need?', 'Senarai mana yang anda perlukan?'),
  triage_lowres_note: L(
    'This copy of the poster was recovered from a screenshot and is lower in quality than the original. The two lists above are the same content, in both languages.',
    'Salinan poster ini diperoleh daripada tangkapan skrin dan kualitinya lebih rendah daripada yang asal. Kedua-dua senarai di atas mengandungi kandungan yang sama, dalam dua bahasa.'
  ),

  /* --- #gayahidupsihatHTPN -------------------------------------------- */
  gh_sub_log: L('My walking', 'Jalan Kaki Saya'),
  gh_sub_share: L('Share it', 'Kongsikan'),
  gh_week: L('This week', 'Minggu Ini'),
  gh_target: L('weekly target', 'sasaran mingguan'),
  gh_minutes: L('Minutes walked', 'Minit Berjalan'),
  gh_km: L('Distance (km)', 'Jarak (km)'),
  gh_steps: L('Steps', 'Langkah'),
  gh_kcal: L('Energy (kcal)', 'Tenaga (kcal)'),
  gh_kcal_help: L(
    'Only if your watch shows one. It is the device\u2019s estimate, not a measurement.',
    'Hanya jika jam anda memaparkannya. Ia anggaran peranti, bukan ukuran.'
  ),
  gh_log: L('Record today', 'Rekod hari ini'),
  gh_today: L('Today', 'Hari ini'),
  gh_last7: L('Last 7 days', '7 Hari Lepas'),
  gh_nolog: L('Nothing recorded this week yet.', 'Belum ada rekod minggu ini.'),
  gh_howto: L('How it works', 'Cara Penggunaan'),
  gh_open_on: L('Open the hashtag on', 'Buka hashtag di'),
  gh_copy: L('Copy the hashtag', 'Salin hashtag'),
  gh_copied: L('Copied', 'Telah disalin'),
  gh_share: L('Share from this device', 'Kongsi dari peranti ini'),
  gh_share_unavailable: L(
    'Your browser cannot open a share sheet, so the text has been copied instead. Paste it into your post.',
    'Pelayar anda tidak dapat membuka lembaran perkongsian, maka teks telah disalin. Tampalkannya ke dalam hantaran anda.'
  ),
  gh_safety: L('Before you start', 'Sebelum Anda Mula'),

  /* --- privacy / settings -------------------------------------------- */
  priv_title: L('Where your information goes', 'Ke Mana Maklumat Anda Pergi'),
  priv_ondevice: L('On this device only', 'Pada Peranti Ini Sahaja'),
  priv_collection: L('Counting how the app is used', 'Pengiraan Penggunaan Aplikasi'),
  priv_controller: L('Who is responsible', 'Pihak Bertanggungjawab'),
  priv_legal: L('The legal position', 'Kedudukan Undang-Undang'),
  priv_ethics: L('Ethics status', 'Status Etika'),
  priv_notadvice: L('What this app is not', 'Apa Aplikasi Ini Bukan'),
  priv_export: L('Export my record to a file', 'Eksport rekod saya ke fail'),
  priv_clear: L('Delete everything on this device', 'Padam segala-galanya pada peranti ini'),
  priv_clear_confirm: L(
    'This will delete every medicine, result, image and measurement you have entered. It cannot be undone. Proceed?',
    'Tindakan ini akan memadam setiap ubat, keputusan, gambar dan ukuran yang telah anda masukkan. Ia tidak boleh dibatalkan. Teruskan?'
  ),
  priv_device_code: L('This device’s random code', 'Kod Rawak Peranti Ini'),
  priv_sent_fields: L('Precisely what is transmitted', 'Apa Yang Dihantar Dengan Tepat'),

  /* --- consent ------------------------------------------------------- */
  consent_title: L('One question before you begin', 'Satu Soalan Sebelum Anda Bermula'),
  consent_body: L(
    'May the hospital record that this app was opened, and which sections were used? It helps HTPN judge whether it is worth maintaining.',
    'Bolehkah pihak hospital merekodkan bahawa aplikasi ini telah dibuka, dan bahagian mana yang digunakan? Ia membantu HTPN menilai sama ada ia wajar dikekalkan.'
  ),
  consent_yes: L('Yes, record my use', 'Ya, rekodkan penggunaan saya'),
  consent_no: L('No, thank you', 'Tidak, terima kasih'),
  consent_once: L('Asked once only. You will not be asked again.', 'Ditanya sekali sahaja. Anda tidak akan ditanya lagi.'),

  /* --- collection status line ---------------------------------------- */
  coll_off: L('Nothing is being transmitted', 'Tiada apa-apa dihantar'),
  coll_declined: L('You declined — nothing is transmitted', 'Anda telah menolak — tiada apa-apa dihantar'),
  coll_queued: L('Usage count queued', 'Kiraan penggunaan dalam giliran'),
  coll_sent: L('Usage count transmitted', 'Kiraan penggunaan telah dihantar'),
  coll_failed: L('The usage count could not be sent', 'Kiraan penggunaan tidak dapat dihantar'),
  coll_refused: L('The server declined the usage count', 'Pelayan menolak kiraan penggunaan'),

  /* --- print --------------------------------------------------------- */
  print_title: L('Summary for the clinic', 'Ringkasan untuk Klinik'),
  print_name: L('Name', 'Nama'),
  print_ic: L('Identity card number', 'Nombor Kad Pengenalan'),
  print_identifiers_note: L(
    'Your name and identity card number remain in this browser’s memory for the printout alone. They are never transmitted, and they are discarded when you close this page.',
    'Nama dan nombor kad pengenalan anda kekal dalam ingatan pelayar ini untuk cetakan sahaja. Ia tidak sekali-kali dihantar, dan akan dibuang apabila anda menutup halaman ini.'
  ),
  print_do: L('Print', 'Cetak'),
  print_generated: L('Printed from Patient Journey by HTPN on', 'Dicetak daripada Perjalanan Pesakit oleh HTPN pada'),
  print_disclaimer: L(
    'Entered by the patient. Not verified against the hospital record.',
    'Dimasukkan oleh pesakit. Tidak disahkan dengan rekod hospital.'
  )
}
