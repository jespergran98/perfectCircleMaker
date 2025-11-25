Notater:

Mål: Lage en "Circle Maker" der brukeren skal tegne en perfekt sirkel.

Ting å inkludere:

1. Et senterpunkt brukeren skal tegne rundt
2. Et minimums distanse fra midten av sirkelen til der brukeren kan starte å tegne
3. En automatisk radius tilgitt sirkelen i punktet brukeren begynner å tegne
4. En tid som begynner å telle ned når brukeren starter å tegne
5. En % som sier hvor nøyaktig brukeren er på å tegne sirkelen
6. En metode for at brukeren ikke bytter retning
7. Et array med beste forsøk
8. fargen på elementene endres basert på nøyaktighet under tegningen.
9. En strategi for å detekte at brukeren har tegnet hele sirkelen, og ikke går tilbake til hitbox.

Hva som ble inkludert:

1. Et hvitt senterpunkt (dot) som brukeren tegner rundt
2. Minimumsdistanse på 100px - viser "Too close to dot" hvis brukeren starter nærmere
3. Radius beregnes automatisk fra klikk-punkt til senterpunktet
4. 7-sekunders nedtellingstimer som starter ved første klikk
5. Live nøyaktighetsprosent basert på avvik fra perfekt sirkel
6. Quadrant-tracking som krever at brukeren besøker alle fire kvadranter (venstre, høyre, over, under)
7. Top 10 leaderboard lagret i localStorage
8. Dynamisk fargeskift på prosenttekst: grønn (100%) → gul (80%) → rød (60%)
9. Hitbox-system: brukeren må forlate 30px startområde før retur for å fullføre, og må ha vært innom alle kvadranter.

---

Oppgave: Lag din egen interaktive side! 🎨✨
Hei, JavaScript-mester! 🤓 Nå er det tid for å bruke alt du har lært så langt til å lage din egen interaktive nettside. Denne oppgaven gir deg friheten til å være kreativ og bruke DOM-manipulasjon sammen med de andre konseptene vi har gjennomgått i JavaScript Basic. 🎉

Oppgavetekst
Lag en nettside som er dynamisk og interaktiv.

Du bestemmer selv hva nettsiden skal handle om! Den kan være:
Et verktøy (f.eks. en listegenerator, kalkulator eller noe annet nyttig).
Et morsomt prosjekt, som en kunstgenerator inspirert av "Circle Maker".
Eller noe helt annet – bruk fantasien! 🌟
Bruk DOM-manipulasjon for å endre innholdet på siden.

Dette kan inkludere:
Å opprette og fjerne HTML-elementer dynamisk.
Å endre tekst eller stil på eksisterende elementer.
Å vise og skjule data på siden.
Kombiner det med konseptene du har lært:

Variabler og datatyper: Lag variabler for å holde på data, som brukervalgt input eller resultater.
Funksjoner: Del opp koden i funksjoner for gjenbruk.
Løkker og betingelser: Bruk løkker for å iterere over data og betingelser for å håndtere ulike tilfeller.
Arrays og objekter: Bruk arrays eller objekter for å lagre og vise data, som lister med elementer eller brukerinformasjon.
Tips og krav:
Start smått: Begynn med én funksjon og bygg videre.
Gjør det visuelt: Bruk CSS og JavaScript for å endre utseendet på elementer, f.eks. med farger, størrelser eller plassering.
Bruk kommentarer: Legg til kommentarer i koden for å forklare hva de ulike delene gjør.
Eksempelideer:
En enkel kunstgenerator:
La brukeren velge antall sirkler eller firkanter, og vis dem dynamisk på siden.
En hobbyvelger:
Lag en funksjon som viser en tilfeldig hobby fra en liste.
En liten butikk:
Vis en liste med produkter og deres priser
Inspirasjon:
Husk "Circle Maker"-prosjektet fra undervisningen. Her brukte vi input fra brukeren til å lage sirkler med dynamiske egenskaper. Du kan hente inspirasjon fra dette, eller lage noe helt nytt!

Hva skal leveres?
Link til GitHub repo + link til GitHub Pages
En kort forklaring av hva siden din gjør (enten i en kommentar i koden eller som tekst på siden).
Et kreativt og gjennomført prosjekt! 🎉
Vi gleder oss til å se hva du finner på! Lykke til! 💪😊