/* ===========================================================================
   i18n.js — RULE 2 of this project: every user-facing string goes through
   L(en, ms) and is read with pick(value, lang). Clinical text included, not
   just the buttons. A bare string literal in a component is a bug.
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
  back: L('Back', 'Kembali'),
  next: L('Next', 'Seterusnya'),
  close: L('Close', 'Tutup'),
  save: L('Save', 'Simpan'),
  cancel: L('Cancel', 'Batal'),
  add: L('Add', 'Tambah'),
  edit: L('Edit', 'Ubah'),
  remove: L('Remove', 'Buang'),
  done: L('Done', 'Selesai'),
  open: L('Open', 'Buka'),
  step: L('Step', 'Langkah'),
  of: L('of', 'daripada'),
  page: L('Page', 'Halaman'),
  none: L('Nothing recorded yet', 'Tiada rekod lagi'),
  none_hint: L(
    'Add it below, or photograph the document and let the app read it.',
    'Tambah di bawah, atau ambil gambar dokumen dan biarkan aplikasi membacanya.'
  ),
  offlineReady: L('Works offline', 'Berfungsi luar talian'),
  needsInternet: L('Needs internet', 'Perlu internet'),
  settings: L('Privacy & settings', 'Privasi & tetapan'),

  /* --- tabs ---------------------------------------------------------- */
  tab_dashboard: L('My Journey', 'Perjalanan Saya'),
  tab_records: L('My Records', 'Rekod Saya'),
  tab_measurements: L('Measurements', 'Ukuran'),
  tab_wayfinding: L('Finding Your Way', 'Mencari Arah'),
  tab_iqms: L('Queue Number', 'Nombor Giliran'),
  tab_myubat: L('Medicine Delivery', 'Penghantaran Ubat'),
  tab_rakyat: L("The Public's Role", 'Peranan Rakyat'),

  /* --- dashboard ----------------------------------------------------- */
  dash_lead: L(
    'What your record says, with whatever needs attention put first.',
    'Apa yang rekod anda nyatakan, dengan perkara yang perlu perhatian didahulukan.'
  ),
  dash_empty_title: L('Nothing here yet', 'Belum ada apa-apa di sini'),
  dash_empty_body: L(
    'Start with My Records. Add your medicines and your allergies, and this screen fills itself in.',
    'Mulakan dengan Rekod Saya. Tambah ubat dan alahan anda, dan skrin ini akan terisi sendiri.'
  ),
  dash_goto_records: L('Go to My Records', 'Pergi ke Rekod Saya'),
  dash_nothing_to_act: L('Nothing to act on', 'Tiada tindakan diperlukan'),
  dash_show_all: L('Also checked — nothing to act on', 'Turut disemak — tiada tindakan'),
  dash_print: L('Print a summary for the clinic', 'Cetak ringkasan untuk klinik'),
  level_warning: L('See this first', 'Lihat ini dahulu'),
  level_attention: L('Bring this up', 'Bangkitkan ini'),
  level_watch: L('Worth a mention', 'Berbaloi disebut'),
  level_none: L('Noted', 'Dicatat'),
  whatToDo: L('What to do', 'Apa yang perlu dibuat'),
  basedOn: L('Based on', 'Berdasarkan'),
  notBasedOn: L('Not based on a guideline', 'Tidak berdasarkan garis panduan'),
  emergencyHead: L('If it is an emergency', 'Jika ia kecemasan'),
  flagged: L('Caution about this number', 'Awas tentang nombor ini'),

  /* --- records ------------------------------------------------------- */
  rec_lead: L(
    'Your own record, kept on this device. Photograph a document or type it in.',
    'Rekod anda sendiri, disimpan pada peranti ini. Ambil gambar dokumen atau taipkannya.'
  ),
  sec_meds: L('Medicines', 'Ubat'),
  sec_issues: L('Active problems', 'Masalah aktif'),
  sec_allergies: L('Allergies', 'Alahan'),
  sec_surgery: L('Operations', 'Pembedahan'),
  sec_bloods: L('Blood results', 'Keputusan darah'),

  col_drug: L('Medicine', 'Ubat'),
  col_dose: L('Dose', 'Dos'),
  col_indication: L('What it is for', 'Untuk apa'),
  col_status: L('Status', 'Status'),
  status_on: L('Taking', 'Sedang ambil'),
  status_off: L('Stopped', 'Berhenti'),

  col_problem: L('Problem', 'Masalah'),
  col_since: L('Since', 'Sejak'),
  status_active: L('Active', 'Aktif'),
  status_resolved: L('Resolved', 'Selesai'),

  col_substance: L('What caused it', 'Apa yang menyebabkan'),
  col_reaction: L('What happened', 'Apa yang berlaku'),
  col_severity: L('How bad', 'Tahap'),
  sev_mild: L('Mild', 'Ringan'),
  sev_severe: L('Severe', 'Teruk'),
  sev_severe_help: L(
    'Mark it severe if you could not breathe, swelled up, fainted, or needed emergency treatment.',
    'Tandakan teruk jika anda tidak boleh bernafas, bengkak, pengsan, atau memerlukan rawatan kecemasan.'
  ),
  allergy_none_known: L('Record that I have no known allergy', 'Rekodkan bahawa saya tiada alahan diketahui'),
  allergy_none_known_label: L('No known allergy', 'Tiada alahan diketahui'),

  col_operation: L('Operation', 'Pembedahan'),
  col_date: L('Date', 'Tarikh'),
  col_where: L('Where', 'Di mana'),

  col_test: L('Test', 'Ujian'),
  col_value: L('Result', 'Keputusan'),
  col_unit: L('Unit', 'Unit'),
  col_range: L('Range on your report', 'Julat pada laporan anda'),
  range_low: L('Low', 'Rendah'),
  range_high: L('High', 'Tinggi'),
  range_help: L(
    'Copy the two numbers printed beside your result. Every laboratory sets its own, so this app will not guess them for you.',
    'Salin dua nombor yang dicetak di sebelah keputusan anda. Setiap makmal menetapkan julatnya sendiri, jadi aplikasi ini tidak akan menekanya untuk anda.'
  ),

  /* --- entry methods / OCR ------------------------------------------- */
  entry_camera: L('Take a photo', 'Ambil gambar'),
  entry_upload: L('Upload a picture', 'Muat naik gambar'),
  entry_manual: L('Type it in', 'Taipkan'),
  ocr_title: L('Read the picture', 'Baca gambar'),
  ocr_run: L('Read text from this picture', 'Baca teks daripada gambar ini'),
  ocr_working: L('Reading…', 'Sedang membaca…'),
  ocr_unavailable: L(
    'Reading text from pictures is not available in this build. The picture is still saved, and you can type the details in beside it.',
    'Pembacaan teks daripada gambar tidak tersedia dalam binaan ini. Gambar tetap disimpan, dan anda boleh menaip butirannya di sebelah.'
  ),
  ocr_result_lead: L(
    'This is what the app thinks it read. It gets things wrong, especially handwriting and Malay text. Check every line before you keep it.',
    'Ini yang aplikasi fikir ia baca. Ia sering tersalah, terutamanya tulisan tangan dan teks Melayu. Semak setiap baris sebelum menyimpannya.'
  ),
  ocr_accept: L('Use these details', 'Guna butiran ini'),
  ocr_discard: L('Discard and type instead', 'Buang dan taip sendiri'),
  ocr_nothing: L('No readable text found in that picture.', 'Tiada teks yang boleh dibaca dalam gambar itu.'),
  photo_kept: L('Picture saved on this device', 'Gambar disimpan pada peranti ini'),
  photo_remove: L('Delete picture', 'Padam gambar'),

  /* --- measurements -------------------------------------------------- */
  meas_lead: L(
    'Weigh yourself the same way each time — same scale, similar time of day.',
    'Timbang diri dengan cara yang sama setiap kali — penimbang sama, waktu lebih kurang sama.'
  ),
  m_weight: L('Weight', 'Berat'),
  m_height: L('Height', 'Tinggi'),
  m_waist: L('Waist', 'Lilit pinggang'),
  m_bmi: L('BMI', 'BMI'),
  m_sex: L('Recorded sex', 'Jantina direkodkan'),
  m_male: L('Male', 'Lelaki'),
  m_female: L('Female', 'Perempuan'),
  m_sex_why: L(
    'Asked only because the waist threshold this app cites is different for men and women. It is not sent anywhere.',
    'Ditanya hanya kerana ambang lilit pinggang yang dipetik aplikasi ini berbeza bagi lelaki dan wanita. Ia tidak dihantar ke mana-mana.'
  ),
  m_history: L('Previous entries', 'Catatan terdahulu'),
  m_waist_how: L(
    'Stand up, tape around the waist at the level of the navel, breathe out, then read it.',
    'Berdiri, lilitkan pita di pinggang pada aras pusat, hembus nafas, kemudian baca.'
  ),

  /* --- wayfinding ---------------------------------------------------- */
  way_lead: L(
    'HTPN sits on two sites. Check which one your appointment letter names before you set off.',
    'HTPN terletak di dua lokasi. Semak lokasi mana yang dinyatakan dalam surat temujanji anda sebelum bertolak.'
  ),
  way_campuses: L('The two main sites', 'Dua lokasi utama'),
  way_departments: L('Other points on the grounds', 'Titik lain di kawasan hospital'),
  way_open_maps: L('Open in Google Maps', 'Buka dalam Google Maps'),
  way_needs_net: L(
    'Opening a map needs an internet connection. The list itself works offline.',
    'Membuka peta memerlukan sambungan internet. Senarai ini berfungsi luar talian.'
  ),
  way_unconfirmed_banner: L(
    'The hospital has not yet confirmed names for these points. Each link still opens the right place in Google Maps, which will show its real name.',
    'Hospital masih belum mengesahkan nama bagi titik-titik ini. Setiap pautan tetap membuka tempat yang betul dalam Google Maps, yang akan memaparkan nama sebenarnya.'
  ),

  /* --- iqms ---------------------------------------------------------- */
  iqms_lead: L(
    'Check your queue number from anywhere, instead of waiting outside the department.',
    'Semak nombor giliran anda dari mana-mana, bukannya menunggu di luar jabatan.'
  ),
  iqms_open: L('Open iQMS for HTPN', 'Buka iQMS untuk HTPN'),
  iqms_poster_alt: L('iQMS poster, HTPN', 'Poster iQMS, HTPN'),
  tapToEnlarge: L('Tap to enlarge', 'Ketik untuk besarkan'),

  /* --- myubat -------------------------------------------------------- */
  ubat_lead: L(
    'Repeat medicines delivered to your home, so you do not have to come in and queue for them.',
    'Ubat ulangan dihantar ke rumah anda, jadi anda tidak perlu datang dan beratur untuknya.'
  ),
  ubat_open: L('Get MyUbat on Google Play', 'Dapatkan MyUbat di Google Play'),
  ubat_howget: L('How to get it', 'Cara mendapatkannya'),
  ubat_otherphone: L('Using an iPhone?', 'Menggunakan iPhone?'),
  ubat_good_for: L('Use it for', 'Gunakan untuk'),
  ubat_not_for: L('Do not use it for', 'Jangan gunakan untuk'),
  ubat_cold: L('Cold chain', 'Rantaian sejuk'),

  /* --- rakyat -------------------------------------------------------- */
  poster_download: L('Download', 'Muat turun'),
  poster_credit: L('Poster by', 'Poster oleh'),

  /* --- privacy / settings -------------------------------------------- */
  priv_title: L('Where your information goes', 'Ke mana maklumat anda pergi'),
  priv_ondevice: L('On this device only', 'Pada peranti ini sahaja'),
  priv_collection: L('Counting how the app is used', 'Mengira cara aplikasi digunakan'),
  priv_controller: L('Who is responsible', 'Siapa yang bertanggungjawab'),
  priv_legal: L('The legal position', 'Kedudukan undang-undang'),
  priv_ethics: L('Ethics status', 'Status etika'),
  priv_notadvice: L('What this app is not', 'Apa aplikasi ini bukan'),
  priv_export: L('Export my record to a file', 'Eksport rekod saya ke fail'),
  priv_clear: L('Delete everything on this device', 'Padam segalanya pada peranti ini'),
  priv_clear_confirm: L(
    'This deletes every medicine, result, picture and measurement you have entered. It cannot be undone. Delete it all?',
    'Ini memadam setiap ubat, keputusan, gambar dan ukuran yang anda masukkan. Ia tidak boleh dibatalkan. Padam semuanya?'
  ),
  priv_device_code: L('This device’s random code', 'Kod rawak peranti ini'),
  priv_sent_fields: L('Exactly what is sent', 'Apa sebenarnya yang dihantar'),

  /* --- consent ------------------------------------------------------- */
  consent_title: L('One question before you start', 'Satu soalan sebelum anda mula'),
  consent_body: L(
    'May the hospital count that this app was opened, and which parts of it were used? It helps HTPN see whether this is worth keeping.',
    'Bolehkah hospital mengira bahawa aplikasi ini dibuka, dan bahagian mana yang digunakan? Ia membantu HTPN melihat sama ada ia berbaloi dikekalkan.'
  ),
  consent_yes: L('Yes, count my use', 'Ya, kira penggunaan saya'),
  consent_no: L('No, thank you', 'Tidak, terima kasih'),
  consent_once: L('Asked once. Never again.', 'Ditanya sekali sahaja. Tidak akan ditanya lagi.'),

  /* --- collection status line ---------------------------------------- */
  coll_off: L('Nothing is being sent', 'Tiada apa-apa dihantar'),
  coll_declined: L('You said no — nothing is sent', 'Anda menolak — tiada apa-apa dihantar'),
  coll_queued: L('Usage count queued', 'Kiraan penggunaan beratur'),
  coll_sent: L('Usage count sent', 'Kiraan penggunaan dihantar'),
  coll_failed: L('Could not send the usage count — it will not be retried', 'Tidak dapat menghantar kiraan penggunaan — ia tidak akan dicuba semula'),
  coll_refused: L('The server refused the usage count', 'Pelayan menolak kiraan penggunaan'),

  /* --- print --------------------------------------------------------- */
  print_title: L('Summary for the clinic', 'Ringkasan untuk klinik'),
  print_name: L('Name', 'Nama'),
  print_ic: L('IC number', 'Nombor KP'),
  print_identifiers_note: L(
    'Your name and IC stay in this browser’s memory for the printout only. They are never sent anywhere, and they are gone when you close this page.',
    'Nama dan KP anda kekal dalam ingatan pelayar ini untuk cetakan sahaja. Ia tidak pernah dihantar ke mana-mana, dan hilang apabila anda menutup halaman ini.'
  ),
  print_do: L('Print', 'Cetak'),
  print_generated: L('Printed from Patient Journey by HTPN on', 'Dicetak daripada Perjalanan Pesakit oleh HTPN pada'),
  print_disclaimer: L(
    'Entered by the patient. Not verified against the hospital record.',
    'Dimasukkan oleh pesakit. Tidak disahkan dengan rekod hospital.'
  )
}
