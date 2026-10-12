# TestLocation

Site de location de voitures premium : Next.js 15 (App Router), TypeScript, Tailwind CSS v4, composants shadcn/ui (Radix), Framer Motion, Prisma (SQLite en dev, PostgreSQL en prod), NextAuth (identifiants), React Hook Form + Zod, react-day-picker, Leaflet + OpenStreetMap.

## Démarrage

```bash
npm install
cp .env.example .env          # puis renseignez NEXTAUTH_SECRET (openssl rand -base64 32)
npm run db:push && npm run db:seed
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

## Production (PostgreSQL)

Dans `prisma/schema.prisma`, remplacez `provider = "sqlite"` par `"postgresql"`, renseignez `DATABASE_URL`, puis `npx prisma db push && npm run db:seed && npm run build`. Branchez un vrai prestataire de paiement (ex. Stripe) à la place du paiement simulé.
