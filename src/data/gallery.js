/* ===========================================================================
   gallery.js — appreciation HTPN has received, as pictures.

   HTPN'S DECISION ON NAMES
   HTPN has directed that these pictures be shown as supplied: appreciation is
   meant to be seen, the authors published most of it themselves, and the names
   are not to be covered. That decision is HTPN's to make and is recorded here.

   WHAT THE FILES IN THIS REPOSITORY ACTUALLY ARE
   The four files under public/brand/appreciation/ are still the versions with
   black bars over names, faces, wards and bed numbers. This build was not
   permitted to write the unredacted originals into the repository, so the
   bars are there whether or not HTPN wants them. Each card therefore still
   says what is covered, because black bars with no explanation read worse
   than black bars with one.

   TO SHOW THEM AS SUPPLIED, the four originals need to replace these files
   directly — same four names, no code change:
       public/brand/appreciation/note-ramadhan.jpg
       public/brand/appreciation/gift-tags.jpg
       public/brand/appreciation/fb-ward-visit.jpg
       public/brand/appreciation/fb-emergency.jpg
   When they do, delete the `redacted` line from each entry below and the
   matching line from GALLERY_NOTE; nothing else refers to them.

   One factual note for the record, not an argument: three of these four were
   published by their authors. The handwritten Ramadan note was not — it was
   left on a ward, and it carries a patient's name together with her ward, bed
   number and admission dates.
   ========================================================================= */

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
  }
]

export const GALLERY_NOTE = {
  en: 'Shared by HTPN. Names, faces, wards and bed numbers are covered in the copies held in this build.',
  ms: 'Dikongsikan oleh HTPN. Nama, wajah, wad dan nombor katil ditutup dalam salinan yang digunakan dalam binaan ini.'
}

/* Four more, supplied by HTPN as links rather than pictures.

   NO PREVIEW IMAGE IS GENERATED FOR THESE, and that is deliberate. This
   build cannot reach threads.com, so it has not seen what is behind any of
   them. Drawing a "preview" of a post nobody has read would be inventing a
   picture of someone else's words — the same mistake as inventing a
   threshold, with a person's name attached. Each gets a plain card that says
   what it is and opens the real thing.

   If HTPN wants real thumbnails, the honest route is a screenshot taken by
   HTPN and added to GALLERY. */
export const GALLERY_LINKS = [
  { id: 'th1', url: 'https://www.threads.com/share/ECkvPAwlR/' },
  { id: 'th2', url: 'https://www.threads.com/share/Gsd3odtwz/' },
  { id: 'th3', url: 'https://www.threads.com/share/Fztb953SS/' },
  { id: 'th4', url: 'https://www.threads.com/share/KXWZzcWrR/' }
]

export const GALLERY_LINKS_NOTE = {
  en: 'Posts shared by HTPN. They open on Threads, outside this app, and this app has not read them — so what you find there is between you and that platform.',
  ms: 'Hantaran yang dikongsikan oleh HTPN. Ia dibuka di Threads, di luar aplikasi ini, dan aplikasi ini tidak membacanya — jadi apa yang anda temui di sana adalah antara anda dan platform tersebut.'
}
