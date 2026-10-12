# TestLocation

Site de location de voitures premium : Next.js 15 (App Router), TypeScript, Tailwind CSS v4, composants shadcn/ui (Radix), Framer Motion, Prisma (SQLite en dev, PostgreSQL en prod), NextAuth (identifiants), React Hook Form + Zod, react-day-picker, Leaflet + OpenStreetMap.

## Démarrage (local)

Il faut une base PostgreSQL : une branche Neon de dev, ou un Postgres local.

```bash
npm install
cp .env.example .env          # renseignez DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET
npm run db:deploy             # applique les migrations (prisma/migrations)
npm run db:seed               # données de démo
npm run dev                   # http://localhost:3000
```

Comptes de démo : `admin@testlocation.fr` / `Admin123!` · `client@testlocation.fr` / `Client123!`

## Fonctionnalités

- **Accueil** : hero avec panneau de réservation (agences départ/retour, dates et heures), catégories, sélection, « Pourquoi TestLocation », carte des agences, avis, FAQ, newsletter.
- **Catalogue** `/vehicules` : filtres (catégorie, prix, boîte, carburant, places, disponibilité), tri, prix total selon les dates.
- **Fiche véhicule** : caractéristiques, équipements, calcul du prix (tarif dégressif, aller simple).
- **Réservation** en 4 étapes : protection, options, conducteur, paiement simulé. Le prix et la disponibilité sont revérifiés côté serveur.
- **Espace client** `/compte` : réservations à venir et historique, annulation gratuite jusqu'à 48 h avant.
- **Admin** `/admin` : tableau de bord (CA, occupation, départs), réservations (statuts), véhicules (CRUD), agences (CRUD), clients.
- Mode clair/sombre, responsive, SEO (sitemap, robots, JSON-LD FAQ).

## Photos des véhicules

Aucune image n'est fournie : un visuel neutre s'affiche par défaut. Ajoutez vos photos depuis **Admin → Véhicules → Modifier** (un chemin `/public/...` ou une URL https par ligne).

## Déploiement (Vercel + Neon)

- `vercel-build` (exécuté automatiquement par Vercel) : `prisma generate && prisma migrate deploy && next build`.
- `postinstall` : `prisma generate`.
- Variables : `DATABASE_URL` (Neon, poolée), `DIRECT_URL` (Neon, directe), `NEXTAUTH_SECRET`, `NEXTAUTH_URL`.
- Seed de la base en ligne, depuis votre machine : `DATABASE_URL="<url directe>" DIRECT_URL="<url directe>" npm run db:seed`. Attention : le seed **efface** les données existantes.
- Modifier le schéma : `npm run db:migrate -- --name ma_modif`, puis commit du dossier `prisma/migrations`.

Le paiement est simulé : branchez Stripe avant d'encaisser de vrais paiements.
