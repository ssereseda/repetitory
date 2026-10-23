import { Tutor } from '../types';

// Реальные объявления репетиторов по математике из Ленинградской области
// Источник: Авито. Данные нормализованы из исходной выгрузки.

const rawTutors = [
  { t: "Репетитор по математике 6–9 класс", p: 450, c: "Всеволожск", id: "8158536872" },
  { t: "Репетитор по математике — ОГЭ, ЕГЭ, ВПР", p: 640, c: "Отрадное", id: "7503727243" },
  { t: "Репетитор по математике ОГЭ и ЕГЭ онлайн", p: 900, c: "Девяткино", id: "8235198379" },
  { t: "Репетитор по математике, физике, информатике", p: 640, c: "Рощино", id: "7503197948" },
  { t: "Репетитор по математике. Подготовка к ОГЭ", p: 650, c: "Всеволожск", id: "8359461223" },
  { t: "Репетитор по математике 5–9 класс онлайн", p: 500, c: "Коммунар", id: "8346247655" },
  { t: "Репетитор по математике 6–9 класс", p: 450, c: "Тихвин", id: "8158778232" },
  { t: "Репетитор по математике 6–9 класс", p: 450, c: "Гатчина", id: "8190033383" },
  { t: "Репетитор по математике и алгебре ОГЭ ЕГЭ онлайн", p: 1200, c: "Луга", id: "8231898969" },
  { t: "Репетитор по математике / только онлайн", p: 500, c: "Выборг", id: "8303048152" },
  { t: "Репетитор по математике 6–9 класс", p: 450, c: "Сосновый Бор", id: "8158275384" },
  { t: "Репетитор по математике", p: 590, c: "Кировск", id: "8241128160" },
  { t: "Репетитор по математике", p: 920, c: "Сертолово", id: "8399086736" },
  { t: "Репетитор по математике", p: 590, c: "Сертолово", id: "8240879433" },
  { t: "Репетитор по математике / Профильный ЕГЭ / эксперт", p: 1250, c: "Тосно", id: "8302345123" },
  { t: "Репетитор по математике ОГЭ и ЕГЭ", p: 750, c: "Девяткино", id: "8510946448" },
  { t: "Репетитор по математике онлайн. ОГЭ и ЕГЭ", p: 750, c: "Волхов", id: "8219868158" },
  { t: "Репетитор по математике 6–9 класс", p: 450, c: "Тихвин", id: "8158489037" },
  { t: "Репетитор по математике 6–9 класс", p: 450, c: "Всеволожск", id: "8158243291" },
  { t: "Репетитор по математике. Подготовка к ЕГЭ", p: 650, c: "Сосновый Бор", id: "8390785674" },
  { t: "Репетитор по математике", p: 590, c: "Янино-1", id: "8374804301" },
  { t: "Репетитор по математике 1–11 класс ОГЭ ЕГЭ онлайн", p: 1500, c: "Колтуши", id: "8296143336" },
  { t: "Репетитор по математике 8–9 класс ОГЭ ВПР", p: 590, c: "Всеволожск", id: "8209234831" },
  { t: "Репетитор по математике ЕГЭ / ОГЭ", p: 750, c: "Сертолово", id: "8220231526" },
  { t: "Репетитор по математике", p: 920, c: "Волхов", id: "8426041947" },
  { t: "Репетитор по математике. Улучшение успеваемости", p: 580, c: "Приозерск", id: "8556922814" },
  { t: "Подготовка к ЕГЭ по профильной математике", p: 700, c: "Кировск", id: "8425751474" },
  { t: "Репетитор по математике / ЕГЭ 80+ / индивидуально", p: 1250, c: "Кудрово", id: "8284075592" },
];

const tutorImages: Record<string, string> = {
  "8158536872": "https://90.img.avito.st/image/1/1.vZsPibaAEXIZKbNzeefwzScpE3a9PhVyvVlwdr2KENC6KhVoGSmzc7k.-8IkZpD2Wgpx1JaABmObU1JrdkxlCCpr42-sp44LKGc",
  "7503727243": "https://c70.img.avito.st/image/1/1.uTGvbLaAFdi5zLfZ0UbCVrPMF9wd2xHYHbx03B1vFHoazxHCucy32Rk.4FSFiXYuUeRog0KGHssiH1MXoT_01rtuJE9S_VK2UcU",
  "8235198379": "https://c70.img.avito.st/image/1/1.hvjFcbaAKhHT0YgQxWvx4cHRKBV3xi4Rd6FLFXdyK7Nw0i4L09GIEHM.2s5B4vLkfEzUIyjKaiaABJ4k-FItZ8bNV1leaiHTx2Y",
  "7503197948": "https://90.img.avito.st/image/1/1.-cw2Y7aAVSUgw_ckSAic8HzCVyGE1ElhLM0IYRgVIeDwFE_IMP3JIA.3uyVESGdMuVcxNP7wMS55N2mkD2qmp_fn-fhmxiCoM0",
  "8359461223": "https://c60.img.avito.st/image/1/1.sacW7LaAHU4ATL9PeLqc6g9MH0qkWxlOpDx8SqTvHOyjTxlUAEy_T6A.2FByGjH9BMdv8kYkUuNCjiUN6YiBic34VbDPeCOZJ98",
  "8346247655": "https://30.img.avito.st/image/1/1.nlwT7LaAMrUFTJC0I4bTAg9MMLGhWza1oTxTsaHvMxemTzavBUyQtKU.N09f8VNa0rlXGNyDOA1hz01kVAiqD545D_L9qbivMNA?cqp=2.2LhnDdKx1gU5sZ7QAbwhSdJoeYt5K_KL9JwGcCXpGrDVbBxJ1yJf9Jn7hY3rGWaiHtSha9zz1w==",
  "8158778232": "https://10.img.avito.st/image/1/1.82lWSbaAX4BA6f2BPE6uPX7pXYTk_luA5Jk-hORKXiLj6luaQOn9geA.K34MbOAnz2E2VDaNWaRJVwAS2l5UO2PXJUYWmSB5S9A?cqp=2.2LhnDdKx1gU5sZ7QAbwhSdJoeYt5K_KL9JwGcCXpGrDVbBxJ1yJf9Jn7hY3rGWaiHtSha9zz1w==",
  "8190033383": "https://00.img.avito.st/image/1/1.IJBkV7aAjHly9y54KEcZwHP3jn3W4Ih51oftfdZUjdvR9IhjcvcueNI.4TMm9bd93wJca0ssR3SKHul2UUjbkhz6kTMCrcuR_9Y?cqp=2.2LhnDdKx1gU5sZ7QAbwhSdJoeYt5K_KL9JwGcCXpGrDVbBxJ1yJf9Jn7hY3rGWaiHtSha9zz1w==",
  "8231898969": "https://b00.img.avito.st/image/1/1.1GwQLraAeIUGjtqENHX-VhaOeoGimXyFov4ZgaIteSeljXyfBo7ahKY.Pd3kRQt_MOhgIVrBd0Gdcp0dEMneacJ-VU3_1l9B30M?cqp=2.2LhnDdKx1gU5sZ7QAbwhSdJoeYt5K_KL9JwGcCXpGrDVbBxJ1yJf9Jn7hY3rGWaiHtSha9zz1w==",
  "8303048152": "https://b00.img.avito.st/image/1/1.9ogZx7aAWmEPZ_hgeZyy2gZnWGWrcF5hqxc7ZavEW8OsZF57D2f4YK8.TPJeGq4IPQCGRKhB_Sv83mIcY4kl3oh6eJbmYXzC-Os?cqp=2.2LhnDdKx1gU5sZ7QAbwhSdJoeYt5K_KL9JwGcCXpGrDVbBxJ1yJf9Jn7hY3rGWaiHtSha9zz1w==",
  "8158275384": "https://b20.img.avito.st/image/1/1.dVNHA7aA2bpRo3u7IQZjBm-j2771tN269dO4vvUA2BjyoN2gUaN7u_E.KVwepAmtMOzQPdVUCD1Odt90mGPa4IW0nE5-NO0lBso?cqp=2.2LhnDdKx1gU5sZ7QAbwhSdJoeYt5K_KL9JwGcCXpGrDVbBxJ1yJf9Jn7hY3rGWaiHtSha9zz1w==",
  "8241128160": "https://c90.img.avito.st/image/1/1.MgHSSraAnujE6jzpugYgTNHqnOxg_ZroYJr_7GBJn0pn6ZryxOo86WQ.5RT68j4Ny7VmZC0zx0UyM-QCmric7dppIJuVkkGYz3M",
  "8399086736": "https://c60.img.avito.st/image/1/1.nKJ7obaAMEttAZJKT_fhoWMBMk_JFjRLyXFRT8miMenOAjRRbQGSSs0.qvEFEO442WVGQtXIWi01xC-VqZEw-0pMdtcrU9FZ88E",
  "8240879433": "https://30.img.avito.st/image/1/1.ggkLPbaALuAdnYzhA1OqEEScLOS5iirgue1P5Lk-L0K-nir6HZ2M4b0.lojIfH8vIl2yUsweIslBr0yWgMMZTEg65d2Ko6oWOA4?cqp=2.2LhnDdKx1gU5sZ7QAbwhSdJoeYt5K_KL9JwGcCXpGrDVbBxJ1yJf9Jn7hY3rGWaiHtSha9zz1w==",
  "8302345123": "https://10.img.avito.st/image/1/1.c7xxsraA31VnEn1UG4dls2oS3VHDBdtVw2K-UcOx3vfEEdtPZxJ9VMc.CMs74GzusR2RIwfbkLkbbtJ_q5kSSO0ORgB4DqP1nQo?cqp=2.2LhnDdKx1gU5sZ7QAbwhSdJoeYt5K_KL9JwGcCXpGrDVbBxJ1yJf9Jn7hY3rGWaiHtSha9zz1w==",
  "8510946448": "https://80.img.avito.st/image/1/1.SfKDmbaA5RuVOUcanYQP8YQ55x8xLuEbMUmEHzGa5Lk2OuEBlTlHGjU.-prTsX8Sr1zN5tb6LH7bdrD-E6joYTbFTWa7rsNYmXQ",
  "8219868158": "https://00.img.avito.st/image/1/1.XpgejraA8nEILBwLu94hhou8HWsOfZxrF6TdayN89OrLfZrCC5QcKg.z6KY6ZNL7EuL-2IwonM83B3lqOuhCnIlgOsCbTAr9nw?cqp=2.2LhnDdKx1gU5sZ7QAbwhSdJoeYt5K_KL9JwGcCXpGrDVbBxJ1yJf9Jn7hY3rGWaiHtSha9zz1w==",
  "8158489037": "https://50.img.avito.st/image/1/1.dvLF8baA2hvTUXgapewLwexR2B93Rt4bdyG7H3fy27lwUt4B01F4GnM.vy1LweOQ07IBXmiJSaWSQdxay6ToFGZ8-1vWFt5R-30",
  "8158243291": "https://b30.img.avito.st/image/1/1.ukohl7aAFqM3N7SiWenHeQg3FKeTIBKjk0d3p5OUFwGUNBK5Nze0opc.tY0FZvU35B4eCeVechV7dFpCWMdldTAnz8o0TGMJvZw?cqp=2.2LhnDdKx1gU5sZ7QAbwhSdJoeYt5K_KL9JwGcCXpGrDVbBxJ1yJf9Jn7hY3rGWaiHtSha9zz1w==",
  "8390785674": "https://70.img.avito.st/image/1/1.bS6TMLaAwceFkGPGxS0vAJaQw8Mhh8XHIeCgwyEzwGUmk8XdhZBjxiU.NhE6kbvICkC7VdbAejqGuNcQDX3bvVQiZL_e7HL4FPk",
  "8374804301": "https://00.img.avito.st/image/1/1.O5X9SbaAl3zr6TV9h2FOjv3olXhP_pN8T5n2eE9Klt5I6pNm6-k1fUs.7qbNeeMYQmiA6UtEYuRiSNY_6JPy4vtFjRVjMnVi-8I?cqp=2.2LhnDdKx1gU5sZ7QAbwhSdJoeYt5K_KL9JwGcCXpGrDVbBxJ1yJf9Jn7hY3rGWaiHtSha9zz1w==",
  "8296143336": "https://c70.img.avito.st/image/1/1.UwLZI7aA_-vPg13q81oOZtyD_e9rlPvra_Oe72sg_klsgPvxz4Nd6m8._g4fS4XqlcUodcqxCEqLdnWwEuT_6x-hWVkZIhecbU0",
  "8209234831": "https://20.img.avito.st/image/1/1.45X0ybaAT3ciae19vtKUjvRoTXhGfkt8RhkueEbKTt5Baktm4mntfUI.al-Z-DJzePV5IDXR5aVSYZUj0IAK875nPBolzv4h-i0?cqp=2.2LhnDdKx1gU5sZ7QAbwhSdJoeYt5K_KL9JwGcCXpGrDVbBxJ1yJf9Jn7hY3rGWaiHtSha9zz1w==",
  "8220231526": "https://c80.img.avito.st/image/1/1._C6R1baAUMeHdfLG5aaRUYB1UsMjYlTHIwUxwyPWUWUkdlTdh3Xyxic.VYKeCKARw1QgoYdWoI22J73Un4ybYpdv9XURkiovfw8",
  "8426041947": "https://50.img.avito.st/image/1/1.nnnXBbaAMpDBpZCR50v0e8-lMJRlsjaQZdVTlGUGMzJipjaKwaWQkWE.pf02RlgencGBUxzzwDDxslsa_vhWDVt--ziPT2RUYkA",
  "8556922814": "https://20.img.avito.st/image/1/1.RIaAQLaA6G-W4EpuhHll-YPg6msy9-xvMpCJazJD6c014-x1luBKbjY.mmfIQgju04NwwH3CAX7yKx95OmMvwE1pLyHKJS1o-hY?cqp=2.2LhnDdKx1gU5sZ7QAbwhSdJoeYt5K_KL9JwGcCXpGrDVbBxJ1yJf9Jn7hY3rGWaiHtSha9zz1w==",
  "8425751474": "https://70.img.avito.st/image/1/1.Zpp577aAynNvT2hyOYYP-XpPyHfLWM5zyz-rd8vsy9HMTM5pb09ocs8.O2vwGHkxn1uPRn0Hr7Ev7Drcu-LAUEABsAkxY3YZ0lM",
  "8284075592": "https://c90.img.avito.st/image/1/1.GX_6kLaAtZbsMBeXxORHXeMwt5JIJ7GWSEDUkkiTtDRPM7GM7DAXl0w.ZfCgcnOlfwQF4064NF1eiOMC96_WP31FF5H3PZk5u7U",
};

// Нормализация данных
export const tutors: Tutor[] = rawTutors.map((item) => ({
  id: item.id,
  title: item.t,
  city: item.c,
  price: item.p,
  priceLabel: `от ${item.p.toLocaleString('ru-RU')} ₽`,
  image: tutorImages[item.id] ?? null,
  avitoUrl: `https://www.avito.ru/all/propozyal?q=${encodeURIComponent(item.t)}&s=${item.id}`,
}));

export function getRandomTutors(count: number): Tutor[] {
  const shuffled = [...tutors].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
