const extraRekenopdrachten = [
  { nummer: 1, niveau: '2F', vraag: 'Een festivalticket kost €45,-. Bij vroegboeken krijg je 12% korting. Wat betaal je?', antwoord: 39.6, eenheid: '€', uitleg: '45 × 0,88 = €39,60.' },
  { nummer: 2, niveau: '2F', vraag: 'Je spaart voor een fiets van €250,-. Je hebt al €70,- gespaard en legt €18,- per week opzij. Hoeveel weken duurt het nog?', antwoord: 10, eenheid: 'weken', uitleg: '(250 − 70) / 18 = 10 weken.' },
  { nummer: 3, niveau: '2F', vraag: 'Een streaming-abonnement kost €9,99 per maand. Wat kost een heel jaar (12 maanden)?', antwoord: 119.88, eenheid: '€', uitleg: '9,99 × 12 = €119,88.' },
  { nummer: 4, niveau: '2F', vraag: 'Bij een sportwinkel is alles 25% afgeprijsd. Een paar schoenen kostte €80,-. Wat is de nieuwe prijs?', antwoord: 60, eenheid: '€', uitleg: '80 × 0,75 = €60,-.' },
  { nummer: 5, niveau: '2F', vraag: 'Je wisselt €50,- om tegen een wisselkoers van 1,08. Hoeveel krijg je in de andere munt?', antwoord: 54, eenheid: '', uitleg: '50 × 1,08 = 54.' },
  { nummer: 6, niveau: '2F', vraag: 'Een pizza van €14,- wordt door 4 vrienden gelijk betaald. Hoeveel betaalt ieder?', antwoord: 3.5, eenheid: '€', uitleg: '14 / 4 = €3,50 per persoon.' },
  { nummer: 7, niveau: '2F', vraag: 'Een spaarrekening geeft 2% rente per jaar over €300,-. Hoeveel rente krijg je na 1 jaar?', antwoord: 6, eenheid: '€', uitleg: '2% van 300 = €6,-.' },
  { nummer: 8, niveau: '2F', vraag: 'Je koopt een jas van €120,- met twee kortingscodes na elkaar: eerst 10%, dan nog eens 5% over het nieuwe bedrag. Wat betaal je?', antwoord: 102.6, eenheid: '€', uitleg: '120 × 0,90 = €108,-. Daarna 108 × 0,95 = €102,60.' },
  { nummer: 9, niveau: '2F', vraag: 'Een treinkaartje kost €11,20. Met een kortingskaart betaal je 60% van de prijs. Hoeveel betaal je?', antwoord: 6.72, eenheid: '€', uitleg: '11,20 × 0,60 = €6,72.' },
  { nummer: 10, niveau: '2F', vraag: 'Je verdient €7,50 per uur met een bijbaantje en werkt 6 uur per week. Hoeveel verdien je in 4 weken?', antwoord: 180, eenheid: '€', uitleg: '7,50 × 6 × 4 = €180,-.' },

  { nummer: 1, niveau: '3F', vraag: 'Je hebt een schuld van €150,-. Deze wordt 2 jaar achter elkaar verhoogd met 4% rente per jaar (rente-op-rente). Wat is de schuld na 2 jaar?', antwoord: 162.24, eenheid: '€', uitleg: '150 × 1,04² = €162,24.' },
  { nummer: 2, niveau: '3F', vraag: 'Een spaarbedrag van €800,- staat 3 jaar vast tegen 2% rente per jaar (rente-op-rente, jaarlijks bijgeschreven). Hoeveel staat er na 3 jaar op de rekening?', antwoord: 848.97, eenheid: '€', uitleg: '800 × 1,02³ ≈ €848,97.' },
  { nummer: 3, niveau: '3F', vraag: 'Drie vrienden verdelen een schuld van €180,- in de verhouding 2 : 3 : 4. Hoeveel euro betaalt de persoon met het grootste aandeel?', antwoord: 80, eenheid: '€', uitleg: 'Totaal 9 delen; grootste aandeel = 4/9 × 180 = €80,-.' },
  { nummer: 4, niveau: '3F', vraag: 'Een winkel geeft eerst 20% korting en daarna nog eens 5% extra korting over het verlaagde bedrag, op een jas van €90,-. Wat betaal je?', antwoord: 68.4, eenheid: '€', uitleg: '90 × 0,80 × 0,95 = €68,40.' },
  { nummer: 5, niveau: '3F', vraag: 'Je inkomen daalt met 15% en stijgt vervolgens weer met 15% (over het nieuwe, lagere bedrag). Je begon met €200,-. Hoeveel heb je nu?', antwoord: 195.5, eenheid: '€', uitleg: '200 × 0,85 × 1,15 = €195,50. Je zit dus onder je oorspronkelijke bedrag!' },
  { nummer: 6, niveau: '3F', vraag: 'Je staat €90,- rood (saldo −€90,-). Er wordt €35,- bijgeschreven. Wat is het nieuwe saldo? (vul een negatief getal in als je nog rood staat)', antwoord: -55, eenheid: '€', uitleg: '−90 + 35 = −€55,-.' },
  { nummer: 7, niveau: '3F', vraag: 'Spaarpot A groeit van €40,- naar €52,-. Spaarpot B groeit van €120,- naar €138,-. Vul het groeipercentage in van de pot met de hoogste procentuele groei.', antwoord: 30, eenheid: '%', uitleg: 'A groeit 30% ((52−40)/40×100%), B groeit 15%. A groeit dus het hardst.' },
  { nummer: 8, niveau: '3F', vraag: 'Een recept voor 4 personen kost €18,- aan boodschappen. Je kookt voor 10 personen, in gelijke verhouding. Hoeveel kosten de boodschappen dan?', antwoord: 45, eenheid: '€', uitleg: '18 / 4 × 10 = €45,-.' },
  { nummer: 9, niveau: '3F', vraag: 'Je leent €250,- en betaalt na een jaar in totaal €272,50 terug. Welk rentepercentage heb je betaald?', antwoord: 9, eenheid: '%', uitleg: '(272,50 − 250) / 250 × 100% = 9%.' },
  { nummer: 10, niveau: '3F', vraag: 'Een winkel verhoogt eerst de prijs van een product met 10%, en verlaagt die nieuwe prijs vervolgens weer met 10%. Het product kostte oorspronkelijk €50,-. Wat is de uiteindelijke prijs?', antwoord: 49.5, eenheid: '€', uitleg: '50 × 1,10 × 0,90 = €49,50, dus niet weer €50,-!' },
]

export default extraRekenopdrachten
