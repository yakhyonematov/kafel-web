export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Agar mahsulot siniq holda chiqsa, almashtirish imkoni bormi?',
    answer: "Albatta! Agar mahsulot yetkazib berishda yoki sotib olinganida siniq bo'lsa, uni almashtirib beramiz.",
  },
  {
    id: 'faq-2',
    question: 'Sotib olingan, lekin ishlatilmagan kafel va mahsulotlarni qaytarish imkoni bormi?',
    answer: 'Agar mahsulot ortib qolsa, uni 20 kun ichida qaytarishingiz mumkin.',
  },
  {
    id: 'faq-3',
    question: 'Qanday to\'lov usullari mavjud?',
    answer: 'Siz istagan to\'lov turlari mavjud: naqd pul, plastik karta va bank o\'tkazmasi (perechisleniya).',
  },
  {
    id: 'faq-4',
    question: 'Agar mahsulot yetmay qolsa, nima qilishim kerak?',
    answer: 'Xavotir olmang, biz sizga kerakli mahsulotni topib beramiz!',
  },
];
