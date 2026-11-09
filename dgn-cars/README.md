# DGN Cars — site du garage (voitures d'occasion, Rocourt · Liège)

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 + composants shadcn/ui · Prisma + PostgreSQL (Neon) · NextAuth (admin) · Zod + React Hook Form · Leaflet/OpenStreetMap.

## À compléter avant la mise en ligne
Tout est centralisé dans **`src/config/site.ts`** :
- téléphone (`phone.display` + `phone.href`, ex. `+3243XXXXXX`), WhatsApp, e-mail ;
- horaires (actuellement « sur rendez-vous ») ;
- coordonnées GPS exactes du garage (actuellement approximatives pour Rocourt).

Le stock fourni est une **démo** (14 véhicules, photos Unsplash libres de droits correspondant aux modèles). Remplacez-le par le vrai stock depuis `/admin/vehicules`, avec les photos réelles.

## Démarrage local
```bash
npm install
cp .env.example .env     # DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET
npm run db:deploy        # crée les tables
npm run db:seed          # stock de démo + compte admin
npm run dev              # http://localhost:3000
```
Admin : `/admin` — `admin@dgncars.be` / `Admin123!` (à changer).

## Fonctionnalités
- Accueil : recherche rapide, engagements, arrivages, déroulé d'achat, reprise/financement, avis (lien AutoScout24), plan d'accès, FAQ.
- Stock : filtres (marque, budget, km, année, carburant, boîte, carrosserie, vendus), tri, pagination.
- Fiche véhicule : fiche technique, équipements, prix TVAC, estimation de mensualité, demande d'essai, favoris, véhicules similaires, données structurées `Car`.
- Reprise (plaque belge), simulateur de financement (avec la mention légale belge), contact, favoris, pages légales.
- Admin : tableau de bord, gestion du stock (ajout, édition, statut disponible/réservé/vendu), suivi des demandes.

## Déploiement Vercel + Neon
1. Neon : créer un projet, copier l'URL **poolée** (`-pooler`) et l'URL **directe**.
2. Vercel : importer le dépôt, **Root Directory = `dgn-cars`**.
3. Variables : `DATABASE_URL` (poolée), `DIRECT_URL` (directe), `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (URL du site, Production).
4. Deploy (le script `vercel-build` applique les migrations).
5. Une fois : `DATABASE_URL="<directe>" DIRECT_URL="<directe>" npm run db:seed` (⚠️ efface les données existantes).
