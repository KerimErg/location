# BOWLY'S — site internet

Site vitrine et carte digitale de **BOWLY'S, Manti & Lahmacun**.
Next.js 15 · TypeScript · Tailwind CSS 4 · export statique (aucun serveur à gérer).

---

## 1. Lancer le site sur votre ordinateur

1. Installez **Node.js** (version 20 ou plus, bouton « LTS ») depuis https://nodejs.org.
2. Ouvrez un terminal dans le dossier `bowlys/`, puis :

```bash
npm install      # télécharge les outils (une seule fois)
npm run dev      # lance le site en mode modification
```

3. Ouvrez http://localhost:3000. Chaque modification de fichier s'affiche aussitôt.

Pour produire la version finale : `npm run build` → le dossier `out/` contient le site complet.
Pour le prévisualiser : `npm start` puis http://localhost:3000.

---

## 2. Modifier les produits et les prix → `src/data/menu.ts`

Chaque produit ressemble à ceci :

```ts
{
  id: "manti-original", categorie: "mantis", nom: "Manti Original", prix: 8.9,
  description: "Nos raviolis turcs à la viande, ...",
  photo: "/images/manti-original.webp",
  allergenes: null,              // ← à remplir avant publication
  options: ["sauce-piquante", "pain"],
},
```

- **Prix** : un nombre avec un point (`8.9` = 8,90 €). Le panier recalcule tout seul.
- **Allergènes** : remplacez `null` par la liste, par ex. `["gluten", "lait", "œufs"]`, ou `[]` si aucun.
  ⚠️ À valider avant la mise en ligne (règlement INCO, 14 allergènes).
- **Suppléments** : la liste `OPTIONS` (en haut du fichier) et le champ `options` de chaque produit.
- **Menus** : remplissez `composition`, par ex. `["Manti Original", "Boisson 33 cl"]`.
  Tant que la liste est vide, le site affiche « Composition détaillée bientôt en ligne ».
- **Ajouter un produit** : copiez un bloc, changez l'`id` (unique, sans espace) et les textes.
- **Descriptions** : ce sont des textes de départ à relire. Ils ne décrivent pas de recette vérifiée.

## 3. Modifier l'adresse, les horaires, les réseaux → `src/config/site.ts`

- `telephone`, `email`, `reseaux.tiktok`, `avisGoogle` : remplacez `null` par la valeur entre guillemets.
  Un champ à `null` est simplement masqué sur le site.
- `horaires` : des horaires **provisoires** sont en place, à corriger. Format :

```ts
horaires: {
  lundi: [{ ouverture: "11:30", fermeture: "14:30" }, { ouverture: "18:00", fermeture: "22:30" }],
  mardi: [...], mercredi: [...], jeudi: [...], vendredi: [...], samedi: [...],
  dimanche: [],   // fermé
},
```

- `commande.uberEats` / `commande.deliveroo` : collez vos liens, ils apparaissent dans le panier.
- `url` : le domaine définitif (sert au référencement Google et au partage).

## 4. Remplacer les photos et la vidéo

| Emplacement | Fichier | Format conseillé |
|---|---|---|
| Fiches produits | `public/images/<nom>.webp` puis `photo:` dans `menu.ts` | carré 1:1, 1200 × 1200 px |
| Tuiles de catégories de la carte | `photo:` dans `CATEGORIES` (`menu.ts`) | carré 1:1, 1200 × 1200 px |
| Bloc « Les Mantis » / « Les Lahmacuns » | `src/components/Sections.tsx` (bloc `Specialites`) | 1200 × 1500 px |
| Bannière vidéo (ordinateur) | `public/videos/hero-1.mp4`, `hero-2.mp4`, `hero-3.mp4` | verticale 9:16, 720 × 1280, MP4, sans son, < 5 Mo |
| Bannière vidéo (mobile) | `public/videos/hero-mobile.mp4` | verticale 9:16 |
| Image de partage | `public/og.jpg` | 1200 × 630 px |
| Logo | `public/logo/bowlys-logo.png`, `bowlys-icone.png`, `bowlys-nom.png` | PNG transparent |

**Important :** les photos actuelles sont tirées de vidéos TikTok fournies et portent la mention
« Photo d'illustration ». Vérifiez vos droits d'utilisation. Dès que vous avez vos propres photos,
remplacez-les et supprimez `illustration: true` dans `menu.ts`.

Pour convertir une photo en WebP : https://squoosh.app (gratuit, dans le navigateur).

---

## 5. Mettre le site en ligne (gratuit)

**Recommandé : Netlify ou Cloudflare Pages** (l'offre gratuite de Vercel est réservée aux sites non commerciaux).

1. Mettez le dossier `bowlys/` sur GitHub.
2. Sur https://app.netlify.com → « Add new site » → « Import from Git » → choisissez le dépôt.
3. Réglages : **Base directory** `bowlys` · **Build command** `npm run build` · **Publish directory** `bowlys/out`.
4. Chaque modification poussée sur GitHub republie le site automatiquement (vous pouvez même modifier
   `menu.ts` directement sur github.com, sans rien installer).

**Nom de domaine `bowlys.fr`** : dans Netlify → « Domain management » → « Add domain », puis chez votre
registraire (OVH, Gandi...) créez les enregistrements DNS indiqués par Netlify. Le HTTPS est automatique.

---

## 6. Commande en ligne : état actuel et suite

**Aujourd'hui :** le panier fonctionne (ajout, suppléments, quantités, retrait/livraison, coordonnées,
récapitulatif). Il est conservé dans le navigateur du client. **Aucune commande n'est envoyée et aucun
paiement n'a lieu** : la dernière étape le dit clairement au client.

**Pour activer la vraie commande**, deux options :

1. **Le plus simple** : une solution clé en main reliée à votre caisse (Zelty, Lightspeed, SumUp Online
   Store, Uber Eats / Deliveroo « commande directe »). Il suffit alors de mettre le lien dans `site.ts`.
2. **Sur mesure** : paiement **Stripe Checkout** + une petite fonction serveur (Netlify Functions) qui
   recalcule les prix depuis `menu.ts`, crée la session de paiement, puis transmet la commande au
   restaurant (e-mail, imprimante ou tablette) après confirmation de Stripe (webhook).
   Il vous faudra : un compte Stripe vérifié (SIREN, IBAN), les clés `STRIPE_SECRET_KEY` et
   `STRIPE_WEBHOOK_SECRET` (à mettre dans les variables d'environnement de l'hébergeur, jamais dans le code),
   et le moyen de réception des commandes souhaité.
   Les données de carte bancaire restent chez Stripe : elles ne passent jamais par votre site.

Le code est prêt pour cette étape : `site.commande.envoi` (dans `site.ts`) et l'étape « Récapitulatif »
de `src/components/Panier.tsx`.

---

## 7. Avant la mise en ligne

- [ ] Allergènes renseignés pour chaque produit (`menu.ts`)
- [ ] Compositions des menus
- [ ] **Horaires provisoires à confirmer** (`site.ts`), téléphone, e-mail, TikTok
- [ ] Pages légales complétées : chercher `[À COMPLÉTER` dans `src/app/`
- [ ] Photos officielles (et droits des vidéos)

## Organisation du code

```
src/
├── config/site.ts         coordonnées, horaires, réseaux, options de commande
├── config/navigation.ts   liens du menu
├── data/menu.ts           produits, prix, options, allergènes
├── lib/panier.tsx         panier (état, calcul des prix, sauvegarde navigateur)
├── components/            Header, Hero, Carte (carte digitale plein écran), Panier, Sections, Footer...
└── app/                   pages (accueil, pages légales), sitemap, robots
```
