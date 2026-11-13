# Ish jadvali API shartnomasi

Frontend: `/admin/settings`. API bazasi mavjud `NEXT_PUBLIC_API_URL` orqali olinadi.

- `GET /settings/work-schedule`: ochiq endpoint, javob quyidagi JSON obyektining o‘zi.
- `PUT /settings/work-schedule`: admin token bilan (Authorization: Bearer), shu formatdagi to‘liq obyektni saqlaydi. Muvaffaqiyat: 200 yoki 204. Serverda yozish huquqini tekshirish zarur.

```json
{
  "weekly": [
    { "day": 0, "closed": false, "opensAt": "08:00", "closesAt": "17:00" },
    { "day": 1, "closed": false, "opensAt": "08:00", "closesAt": "17:00" },
    { "day": 2, "closed": false, "opensAt": "08:00", "closesAt": "17:00" },
    { "day": 3, "closed": false, "opensAt": "08:00", "closesAt": "17:00" },
    { "day": 4, "closed": false, "opensAt": "08:00", "closesAt": "17:00" },
    { "day": 5, "closed": false, "opensAt": "08:00", "closesAt": "17:00" },
    { "day": 6, "closed": true, "opensAt": "08:00", "closesAt": "17:00" }
  ],
  "exceptions": [
    { "date": "2026-12-31", "closed": false, "opensAt": "09:00", "closesAt": "13:00", "note": "Qisqartirilgan ish kuni" },
    { "date": "2027-01-01", "closed": true, "opensAt": "08:00", "closesAt": "17:00", "note": "Yangi yil" }
  ]
}
```

`weekly`: dushanba 0 dan yakshanba 6 gacha, shu tartibda 7 kun. Vaqtlar O‘zbekiston mahalliy vaqtida, HH:mm. Ochiq kun uchun opensAt < closesAt; tun bo‘yi ishlash qo‘llanmaydi. `closed` kunlarda vaqtlar hisobga olinmaydi. `exceptions` sanalari haqiqiy YYYY-MM-DD va takrorlanmas bo‘lishi kerak; ushbu sanalardagi jadval haftalikdan ustun turadi. Server ham validatsiya qilishi kerak.

Ochiq saytda jadval har sahifa yuklanganda olinadi. Server mavjud bo‘lmasa, eski 08:00–17:00 / dushanba–shanba jadvali ko‘rsatiladi. Admin serverga yozish muvaffaqiyatli bo‘lgandagina saqlanganini bildiradi; brauzer xotirasiga soxta saqlash yo‘q.
