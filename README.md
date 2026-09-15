# V2 izmene
Početna redizajnirana; season dashboard; ikone; AIK račun u Budžetu; pravila i nagrade dopunjeni; Redži Miler fora u footeru.

# OVERUNDER 2026/27 — mobile-first sajt

Ovo je statički HTML/CSS/JavaScript sajt. Ne zahteva bazu, server ni plaćeni hosting.

## Glavni fajlovi
- `index.html` — sajt
- `style.css` — dizajn i mobile responsive logika
- `script.js` — automatski proračuni
- `data.js` — GLAVNI fajl koji menjaš tokom sezone
- `admin.html` — pomoćni panel za editovanje i izvoz novog `data.js`
- `assets/` — logo i vizueli/pozadine

## Automatske funkcije
### Liga
- sabira R33–R38
- sortira poslednjih 10 timova po ukupnom zbiru
- na telefonu tabela postaje niz velikih kartica

### Kup
- rezultat je npr. `2:1`
- prvi do 3 pobede automatski prolazi dalje
- pobednik se automatski ubacuje u sledeću rundu
- pobednik finala se prikazuje kao CHAMPION

### Budžet
- UČEŠĆE + LIGA = UKUPNO
- oduzima uplaćeno
- automatski računa dug
- automatski daje status PLAĆENO / DELIMIČNO / DUGUJE
- sabira ukupno naplaćeno i ukupno dugovanje

### Duplo kolo
- sabira dva kola
- sortira po najnižem zbiru
- prikazuje samo pet najnižih
- penal je 700 RSD

### Najviše poena
- automatski bira najveći rezultat iz `highScores`
- prikazuje tim, kolo i rekord
- pravi istoriju rezultata

## Kako menjaš podatke
### Najlakše: admin.html
1. Otvori `admin.html`.
2. Promeni JSON.
3. Klikni **Pregledaj lokalno**.
4. Kad si zadovoljan klikni **Preuzmi data.js**.
5. Zameni stari `data.js` na hostingu/GitHub-u.

### Direktno u data.js
Primer Liga:
```js
{teamId:"t01", scores:{33:178.4,34:165.2,35:181.7,36:null,37:null,38:null}}
```

Primer Kup:
```js
{id:"r1", teamA:"t01", teamB:"t02", winsA:2, winsB:1}
```
Na sajtu se prikazuje 2:1. Kada winsA postane 3, tim automatski prolazi dalje.

Primer Budžet:
```js
{teamId:"t01", participation:5000, league:2400, paid:5000}
```
Ukupno 7.400, plaćeno 5.000, dug 2.400 → DELIMIČNO.

Primer rekord:
```js
highScores:[
  {teamId:"t01", round:7, points:228},
  {teamId:"t04", round:12, points:231.5}
]
```
Rekord postaje 231.5 automatski.

## BESPLATAN HOSTING — preporuka: GitHub Pages
Za ovaj projekat je praktičan jer možeš menjati samo `data.js` direktno iz browsera.

### Prvo objavljivanje
1. Napravi nalog na GitHub-u.
2. Klikni **New repository**.
3. Nazovi ga npr. `overunder-fantasy`.
4. Izaberi **Public**.
5. Klikni **Create repository**.
6. Raspakuj ZIP.
7. Na repozitorijumu klikni **Add file → Upload files**.
8. Ubaci sve fajlove i folder `assets`.
9. Klikni **Commit changes**.
10. Otvori **Settings → Pages**.
11. Source: **Deploy from a branch**.
12. Branch: **main**; folder: **/(root)**.
13. Klikni **Save**.
14. Posle minut-dva dobijaš link približno:
   `https://TVOJ_USERNAME.github.io/overunder-fantasy/`

## Kako menjaš rezultate kasnije preko GitHub-a
1. Otvori repository.
2. Klikni `data.js`.
3. Klikni olovku **Edit this file**.
4. Promeni rezultat/ime/uplatu.
5. Klikni **Commit changes**.
6. Posle 30–90 sekundi osveži sajt.

Ne diraš HTML i CSS.

## Mobilni prikaz
Sajt je pravljen mobile-first:
- hamburger meni na telefonu
- Liga prelazi iz široke tabele u kartice
- Kup je vertikalan po rundama
- tabele koje ostaju tabelarne imaju horizontalni scroll
- fontovi i margine se prilagođavaju telefonu

## Važna napomena o pravilima
U dostavljenom dokumentu za sezonu 2026/27 datum žurke je naveden kao 24.04.2024. Nisam ga sam menjao; u podacima stoji `PROVERITI DATUM`.

U prototipu je korišćen dogovor iz razgovora da završna Liga ima poslednjih 10 ekipa i računa R33–R38, a duplo kolo je 700 RSD.
