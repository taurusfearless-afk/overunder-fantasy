window.OVERUNDER_DATA = {
  meta: {
    season: "2026/27",
    leagueCode: "202882-EZWHL",
    participantCount: 18,
    entryFee: 5000,
    regularPenalty: 600,
    doublePenalty: 700,
    cupStartText: "oko 13. kola",
    partyDate: "24.04.2027.",
    currency: "RSD"
  },
  teams: [
    {id:"t01",name:"KK N'mora Batler Baba d'Izundi",owner:"Aleksandar Milić"},
    {id:"t02",name:"Taurus Fearless",owner:"Miloš Mijanović"},
    {id:"t03",name:"Baćica Wilds",owner:"Miloš Jovanović"},
    {id:"t04",name:"Тромеђа КНН",owner:"Stefan Dobrota"},
    {id:"t05",name:"MV8",owner:"Marko Vučković"},
    {id:"t06",name:"Brigidi bouns",owner:"Ivan Jovanović"},
    {id:"t07",name:"Madzori",owner:"Miroslav Bogićević"},
    {id:"t08",name:"Pick_and_pop",owner:"Dragan Jovanović"},
    {id:"t09",name:"Bench Boost",owner:"Nemanja Stokić"},
    {id:"t10",name:"Pallacanestro",owner:"Nikola Marković"},
    ...Array.from({length:8},(_,i)=>({id:`t${String(i+11).padStart(2,'0')}`,name:`TEAM ${String(i+11).padStart(2,'0')}`,owner:""}))
  ],
  league: {
    rounds:[31,32,33,34,35,36,37,38],
    participants:Array.from({length:10},(_,i)=>({teamId:`t${String(i+1).padStart(2,'0')}`,scores:{31:null,32:null,33:null,34:null,35:null,36:null,37:null,38:null}}))
  },
  cup: {
    winsNeeded:3,
    prelim:[{id:"p1",teamA:"t17",teamB:"t18",winsA:0,winsB:0},{id:"p2",teamA:"t15",teamB:"t16",winsA:0,winsB:0}],
    r16:[{id:"r1",teamA:"t01",teamB:"t02",winsA:0,winsB:0},{id:"r2",teamA:"t03",teamB:"t04",winsA:0,winsB:0},{id:"r3",teamA:"t05",teamB:"t06",winsA:0,winsB:0},{id:"r4",teamA:"t07",teamB:"t08",winsA:0,winsB:0},{id:"r5",teamA:"t09",teamB:"t10",winsA:0,winsB:0},{id:"r6",teamA:"t11",teamB:"t12",winsA:0,winsB:0},{id:"r7",teamA:{winnerOf:"p1"},teamB:"t13",winsA:0,winsB:0},{id:"r8",teamA:{winnerOf:"p2"},teamB:"t14",winsA:0,winsB:0}],
    quarters:[{id:"q1",teamA:{winnerOf:"r1"},teamB:{winnerOf:"r2"},winsA:0,winsB:0},{id:"q2",teamA:{winnerOf:"r3"},teamB:{winnerOf:"r4"},winsA:0,winsB:0},{id:"q3",teamA:{winnerOf:"r5"},teamB:{winnerOf:"r6"},winsA:0,winsB:0},{id:"q4",teamA:{winnerOf:"r7"},teamB:{winnerOf:"r8"},winsA:0,winsB:0}],
    semis:[{id:"s1",teamA:{winnerOf:"q1"},teamB:{winnerOf:"q2"},winsA:0,winsB:0},{id:"s2",teamA:{winnerOf:"q3"},teamB:{winnerOf:"q4"},winsA:0,winsB:0}],
    final:[{id:"f1",teamA:{winnerOf:"s1"},teamB:{winnerOf:"s2"},winsA:0,winsB:0}]
  },
  budget:Array.from({length:18},(_,i)=>({teamId:`t${String(i+1).padStart(2,'0')}`,participation:(i===1||i===7)?0:5000,league:0,paid:0})),
  doubleRounds:[{label:"Duplo kolo 1",roundA:1,roundB:2,entries:Array.from({length:18},(_,i)=>({teamId:`t${String(i+1).padStart(2,'0')}`,scoreA:0,scoreB:0}))}],
  highScores:[],
  rules:{
    participation:["Liga ima 18 učesnika.","Kotizacija za sezonu iznosi 5.000 RSD i obavezna je do Nove godine.","Svi članovi dobijaju majicu i jedno besplatno učešće za kviz Kvizna Čaršija (Žika časti)."],
    penalties:["Četvorica sa najmanje poena u regularnom kolu uplaćuju po 600 RSD.","U duplom kolu plaća petorica sa najmanje poena, po 700 RSD.","Na kraju plasmana: poslednji plaća 3.000 RSD, pretposlednji 2.000 RSD, treći unazad 1.000 RSD."],
    leagueFinal:["Posebna završna liga počinje od 31. kola.","Učestvuje poslednjih 10 ekipa.","Računaju se kola R31–R38, ukupno 8 kola."],
    cup:["Kup počinje približno oko 13. kola.","18 učesnika; 4 ekipe igraju preliminarnu rundu, a dva pobednika ulaze u glavni žreb od 16.","Svaki duel se igra na 3 pobede (maksimalno 5 kola)."],
    special:["Rus i Mijanović imaju besplatno učešće.","Mitski, Amer i Goran imaju po tri besplatna bona koji pokrivaju neuspešno kolo.","Žurka je planirana za 24.04.2027."]
  },
  prizes:[
    {title:"1. MESTO",text:"18.000 RSD + pehar + šampionska majica + besplatno učešće sledeće sezone"},
    {title:"2. MESTO",text:"10.000 RSD + besplatno učešće sledeće sezone"},
    {title:"3. MESTO",text:"Besplatno učešće sledeće sezone"},
    {title:"POBEDNIK KUPA — Krezin kup",text:"8.000 RSD + trofej"},
    {title:"NAJVIŠE POENA U JEDNOM KOLU",text:"Broj poena × 20 RSD (ako rekord drži šampion, nagrada ide prvom sledećem)"},
    {title:"POBEDNIK REDŽI MILER LIGE",text:"6.000 EURA"}
  ],
  payment:{bank:"AIK BANKA",account:"105 0400330031588 16",holder:"ALEKSANDAR MILIĆ"},
  footerJoke:"Ko prvi nasedne na foru od 6000 EUR-a, dobija majicu Magrca koju mora da nosi na žurci i da služi rakiju 😃"
};
