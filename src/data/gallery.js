/* ===========================================================================
   gallery.js — appreciation HTPN has received, as pictures.

   SHOWN AS SUPPLIED, BY HTPN'S DECISION
   These are the five photographs HTPN supplied, unaltered. HTPN directed that
   they be shown that way: appreciation is meant to be seen, the people who
   wrote it published it themselves, and covering the names takes the thanks
   away from the staff it was written for. That call is HTPN's to make.

   The one that was not self-published is the handwritten Ramadan note, left
   on a ward. HTPN, which holds it, has decided the same for it.

   The IMAGES_ARE_REDACTED switch below is off. It stays in the file so that
   if HTPN ever supplies covered versions of these files, one word turns the
   matching "what was removed" lines back on, and the pictures and the words
   describing them can never disagree.
   ========================================================================= */

/* Off: the files under public/brand/appreciation/ are the originals. */
export const IMAGES_ARE_REDACTED = false

export const GALLERY = [
  {
    id: 'note_ramadhan',
    src: 'brand/appreciation/note-ramadhan.jpg',
    caption: {
      en: 'A handwritten thank-you left on the ward at Ramadan, for the nurses and doctors who looked after one patient.',
      ms: 'Nota terima kasih tulisan tangan yang ditinggalkan di wad sempena Ramadan, untuk jururawat dan doktor yang merawat seorang pesakit.'
    },
    redacted: { en: 'Patient name, ward, bed and dates removed', ms: 'Nama pesakit, wad, katil dan tarikh dibuang' }
  },
  {
    id: 'gift_tags',
    src: 'brand/appreciation/gift-tags.jpg',
    caption: {
      en: 'Gifts left at a counter for named members of staff, by patients who wanted to say thank you in person.',
      ms: 'Hadiah yang ditinggalkan di kaunter untuk kakitangan tertentu, daripada pesakit yang ingin mengucapkan terima kasih secara peribadi.'
    },
    redacted: { en: 'Staff names and a patient reference removed', ms: 'Nama kakitangan dan rujukan pesakit dibuang' }
  },
  {
    id: 'fb_ward',
    src: 'brand/appreciation/fb-ward-visit.jpg',
    caption: {
      en: 'A daughter writes about visiting her mother on the ward, and what she noticed about the staff looking after her.',
      ms: 'Seorang anak menulis tentang melawat ibunya di wad, dan apa yang diperhatikannya tentang kakitangan yang menjaganya.'
    },
    redacted: { en: 'Author name and the patient’s photograph removed', ms: 'Nama penulis dan gambar pesakit dibuang' }
  },
  {
    id: 'fb_ed',
    src: 'brand/appreciation/fb-emergency.jpg',
    caption: {
      en: 'A family thanks the Emergency Department and the palliative care team for the care given to a relative in his final days.',
      ms: 'Sebuah keluarga mengucapkan terima kasih kepada Jabatan Kecemasan dan pasukan rawatan paliatif atas penjagaan terhadap saudara mereka pada hari-hari terakhirnya.'
    },
    redacted: { en: 'Family names and the doctor’s name removed', ms: 'Nama keluarga dan nama doktor dibuang' }
  },
  {
    id: 'fb_pac',
    src: 'brand/appreciation/fb-pac-birth.jpg',
    caption: {
      en: 'A mother writes about the night her son was born, and the PAC staff — from the security officer at the door to the nurses in the labour room — who saw her through it.',
      ms: 'Seorang ibu menulis tentang malam kelahiran anaknya, dan kakitangan PAC — daripada pegawai keselamatan di pintu hingga jururawat di bilik bersalin — yang menemaninya sepanjang waktu itu.'
    },
    redacted: { en: 'Names and the baby’s photograph removed', ms: 'Nama dan gambar bayi dibuang' }
  }
]

export const GALLERY_NOTE = IMAGES_ARE_REDACTED ? {
  en: 'Shared by HTPN. Names, faces, wards and bed numbers are covered in the copies held in this build.',
  ms: 'Dikongsikan oleh HTPN. Nama, wajah, wad dan nombor katil ditutup dalam salinan yang digunakan dalam binaan ini.'
} : {
  en: 'Appreciation shared by HTPN, as it was given.',
  ms: 'Penghargaan yang dikongsikan oleh HTPN, sebagaimana ia diberikan.'
}

/* Five more, supplied by HTPN as links rather than pictures: one TikTok
   video and four Threads posts. The TikTok video used to sit on the
   dashboard; it belongs here with the rest of the appreciation.

   NO PREVIEW IMAGE IS GENERATED FOR THESE, and that is deliberate. This
   build cannot reach threads.com or tiktok.com, so it has not seen what is
   behind any of them. Drawing a "preview" of a post nobody has read would be inventing a
   picture of someone else's words — the same mistake as inventing a
   threshold, with a person's name attached. Each gets a plain card that says
   what it is and opens the real thing.

   If HTPN wants real thumbnails, the honest route is a screenshot taken by
   HTPN and added to GALLERY. */
export const GALLERY_LINKS = [
  { id: 'tt1', platform: 'TikTok', url: 'https://vt.tiktok.com/ZS9A68nQk/' },
  { id: 'th1', platform: 'Threads', url: 'https://www.threads.com/share/ECkvPAwlR/' },
  { id: 'th2', platform: 'Threads', url: 'https://www.threads.com/share/Gsd3odtwz/' },
  { id: 'th3', platform: 'Threads', url: 'https://www.threads.com/share/Fztb953SS/' },
  { id: 'th4', platform: 'Threads', url: 'https://www.threads.com/share/KXWZzcWrR/' }
]

export const GALLERY_LINKS_NOTE = {
  en: 'Shared by HTPN. They open on TikTok or Threads, outside this app, and this app has not read them — so what you find there is between you and that platform.',
  ms: 'Dikongsikan oleh HTPN. Ia dibuka di TikTok atau Threads, di luar aplikasi ini, dan aplikasi ini tidak membacanya — jadi apa yang anda temui di sana adalah antara anda dan platform tersebut.'
}
