# Applicazione social Pet Planet

## Progetto per corso universitario 'Ingegneria dei Sistemi Web'

### Demo artefatto : [link]([https://docs.google.com/spreadsheets/d/1G9oLz_bKWgwMbyfGtw65hdhxsh4LwvkI_dvgdrF2wcg/edit?usp=sharing](https://www.youtube.com/watch?v=vM7iD80ckWk&t=36s)

### User Stories : [link](https://docs.google.com/spreadsheets/d/1G9oLz_bKWgwMbyfGtw65hdhxsh4LwvkI_dvgdrF2wcg/edit?usp=sharing)

### Wireframe : Visisibile all'intenro della cartella *wireframe* nel progetto

### Flow Agile Task: [link](https://github.com/users/FrancescoSanti96/projects/6)



## Backend:
### Avviare il server costruito con Fastify:
1. Entrare nella cartella backend
2. npm install
3. Serve avere una istanza di mongodb community avviata o in locale oppure consigliato usare docker
4. npm run start (avvia il server)

### Avviare docker:
1. npm run start-mongodb (lanciando il comando verra istanziato e avviato il container)
2. npm run stop-mongodb (lanciare il comando prima di chiudere il progetto)
3. npm run remove-mongodb (lanciare il comando prima di chiudere il progetto)
- se occorre pulire i dati: npm run remove-data


## Frontend:
1. Entrare nella carte frontend
2. npm install
3. ng add @angular/material
4. ng serve


## Attenzione per effettuare la login occorre avere una Api cloud google dell'app ed inserire il client e il secret in app.js
### Api Google Cloud: [link](https://cloud.google.com/apis?hl=it)
### guida utile per creare Api per OAuth2: [link](https://dev.to/fozooni/google-oauth2-with-fastify-typescript-from-scratch-1a57)

### Team
- Umberto Schiavone
- Francesco Santi

