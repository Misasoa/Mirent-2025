- **Date**: dimanche 8 décembre 2025
- **Description**: Améliorations de la page "Mes Réservations" (Client).
  - **Problème identifié**: Les clients n'avaient pas de vue d'ensemble rapide de leurs réservations et ne pouvaient pas télécharger leurs documents.
  - **Solution**: 
    - **Section Statistiques**: Ajout de 3 cartes visuelles en haut de la page
      - Carte 1 (Violet): Devis en attente - Affiche le nombre de devis non confirmés
      - Carte 2 (Rose): Réservations en cours - Véhicules actuellement loués
      - Carte 3 (Bleu): Réservations à venir - Réservations confirmées futures
      - Calcul intelligent basé sur les dates et statuts
    - **Téléchargement PDF**: Ajout du bouton "Télécharger Facture Proforma"
      - Fichier modifié: `Mirent-FO/src/clients/pages/reservationList.tsx`
      - Fonction `handleDownloadProformaPDF` pour télécharger le PDF via `GET /proforma/:id/pdf`
      - Bouton visible sur toutes les réservations
      - Gestion d'erreurs avec messages utilisateur
  - **Résultat**: Les clients ont maintenant une vue claire de leurs réservations et peuvent télécharger leurs documents.


- **Description**: Ajout de l'affichage des bons de commande en attente de paiement.
  - **Problème identifié**: Les admins ne voyaient pas facilement quels BDC avaient un reste à payer dans la page de gestion de paiement.
  - **Solution**: 
    - **Backend**: Création de l'endpoint `GET /commande/pending-payments` qui retourne tous les BDC avec un reste à payer > 0.
      - Fichier modifié: `mirentt-bo/src/commande/commande.service.ts` (ajout de `getPendingPayments()`)
      - Fichier modifié: `mirentt-bo/src/commande/commande.controller.ts` (ajout de l'endpoint)
    - **Frontend**: Ajout d'une section visuelle avant le tableau des paiements.
      - Fichier modifié: `Mirent-FO/src/admin/Components/paiement/paiement.tsx`
      - Ajout du state `pendingBDC`
      - Ajout d'un `useEffect` pour récupérer les BDC en attente
      - Création d'une section avec des cartes affichant: référence, client, véhicule, montant total, montant payé, reste à payer
      - Bouton "Ajouter Paiement" qui pré-remplit le formulaire avec la référence BDC
      - Rafraîchissement automatique après ajout de paiement
      - **Ajout d'une carte de statistique "Total BDC en attente"** affichant la somme des restes à payer et le nombre de BDC
  - **Résultat**: Les admins voient immédiatement tous les BDC nécessitant un paiement, le montant total à récupérer, et peuvent ajouter un paiement en un clic.


- **Description**: Implémentation de l'affichage dynamique du taux d'occupation.
  - **Problème identifié**: Le taux d'occupation dans le tableau de bord admin était affiché en dur ("75%").
  - **Solution**: 
    - **Backend**: Création de l'endpoint `GET /vehicles/occupancy-rate` qui calcule le taux d'occupation comme (véhicules non disponibles / total véhicules) × 100.
      - Fichier modifié: `mirentt-bo/src/vehicles/vehicles.service.ts` (ajout de `getOccupancyRate()`)
      - Fichier modifié: `mirentt-bo/src/vehicles/vehicles.controller.ts` (ajout de l'endpoint)
    - **Frontend**: Intégration dans le tableau de bord admin.
      - Fichier modifié: `Mirent-FO/src/admin/Components/acceuil/Accueil.tsx`
      - Ajout du state `occupancyRate`
      - Ajout d'un `useEffect` pour récupérer les données depuis l'API
      - Remplacement de "75%" par la valeur dynamique avec gestion du chargement
  - **Résultat**: Le taux d'occupation s'affiche maintenant dynamiquement en fonction du nombre de véhicules disponibles vs total.


- **Description**: Implémentation de l'affichage dynamique du revenu total.
  - **Problème identifié**: Le revenu total dans le tableau de bord admin était affiché en dur ("2 000 000 Ar").
  - **Solution**: 
    - **Backend**: Création de l'endpoint `GET /paiements/total-revenue` qui calcule la somme de tous les paiements.
      - Fichier modifié: `mirentt-bo/src/paiement/paiement.service.ts` (ajout de `getTotalRevenue()`)
      - Fichier modifié: `mirentt-bo/src/paiement/paiement.controller.ts` (ajout de l'endpoint)
    - **Frontend**: Intégration dans le tableau de bord admin.
      - Fichier modifié: `Mirent-FO/src/admin/Components/acceuil/Accueil.tsx`
      - Ajout du state `totalRevenue`
      - Ajout d'un `useEffect` pour récupérer les données depuis l'API
      - Remplacement de la valeur statique par la valeur dynamique avec gestion du chargement
  - **Résultat**: Le revenu total s'affiche maintenant dynamiquement en fonction des paiements réels dans la base de données.

- **Date**: dimanche 8 décembre 2025
- **Description**: Correction du bug de rafraîchissement de la liste des réservations après changement de statut.
  - **Problème identifié**: 
    - Lorsque l'admin clique pour confirmer une réservation (devis → confirmé) ou la terminer (confirmé → terminé), une erreur s'affiche
    - Après actualisation manuelle de la page, le statut est bien modifié
    - Cela indiquait que le backend fonctionnait correctement mais que le frontend ne rafraîchissait pas l'état Redux
  - **Fichier modifié**: `Mirent-FO/src/admin/Components/Reservation/ReservationList.tsx`
    - **Ligne 417** (fonction `handleConfirm`) : Ajout de `await dispatch(fetchReservations())` après la confirmation réussie
    - **Ligne 443** (fonction `handleComplete`) : Ajout de `await dispatch(fetchReservations())` après la complétion réussie
  - **Résultat**: La liste des réservations se rafraîchit automatiquement après confirmation ou terminaison, affichant immédiatement le nouveau statut sans nécessiter d'actualisation manuelle de la page.

- **Date**: dimanche 8 décembre 2025
- **Description**: Implémentation complète du système de notifications admin pour les changements de statut de réservation.
  - **Problème identifié**: 
    - L'admin ne recevait pas de notifications lorsqu'un client créait, confirmait ou terminait une réservation
    - Seule une notification basique existait pour la création de devis, sans payload pour la navigation
  - **Fichier modifié**: `mirentt-bo/src/reservation/reservation.service.ts`
    - **Ligne 251-262** (méthode `createDevis()`) : Amélioration de la notification existante
      - Changement du type de `'reservation'` vers `'new_reservation'`
      - Message amélioré incluant le nom du client, le véhicule et la référence du devis
      - Ajout d'un payload structuré avec `reservationId`, `clientName`, `vehicleName`, `status`
    - **Ligne 321-334** (méthode `confirmReservation()`) : Nouvelle notification lors de la confirmation
      - Type: `'reservation_confirmed'`
      - Message: "Devis {référence} confirmé par {client} - Bon de commande {référence BDC} créé"
      - Payload avec `reservationId`, `bonDeCommandeId`, `bonDeCommandeRef`, `clientName`, `vehicleName`, `status`
    - **Ligne 421-434** (méthode `completeReservation()`) : Nouvelle notification lors de la terminaison
      - Type: `'reservation_completed'`
      - Message: "Réservation {référence} terminée - Facture générée pour {client} (Total: {montant} Ar)"
      - Payload avec `reservationId`, `factureId`, `clientName`, `vehicleName`, `totalPrice`, `status`
  - **Résultat**: Les administrateurs reçoivent maintenant des notifications détaillées pour tous les changements de statut de réservation (devis, confirmé, terminé), avec des données structurées permettant la navigation et l'affichage contextuel.

- **Date**: mardi 3 décembre 2025
- **Description**: Correction de la redirection après déconnexion qui menait vers une page vide.
  - **Problème identifié**: Faute de frappe dans `Navbar.tsx` - naviguait vers `/accueil` au lieu de `/acceuil` (la vraie route).
  - **Fichier modifié**:
    - `Mirent-FO/src/clients/Components/Navbar.tsx` : 
      - Ligne 99 : `navigate("/accueil")` → `navigate("/acceuil")` dans `handleLogout`
      - Ligne 161 : Correction du clic sur le logo
  - **Résultat**: La déconnexion redirige maintenant correctement vers la page d'accueil client.

- **Date**: mardi 3 décembre 2025
- **Description**: Correction du crash dans la page "Mes réservations" causé par un accès non sécurisé à `res.vehicle`.
  - **Problème identifié**: Le backend renvoie les réservations sans charger la relation `vehicle` (eager loading manquant), causant `TypeError: can't access property "modele", res.vehicle is undefined`.
  - **Fichier modifié**:
    - `Mirent-FO/src/clients/pages/reservationList.tsx` : 
      - Ajout de vérifications `res.vehicle?` avec l'opérateur optional chaining (`?.`) pour éviter les crashs
      - Ajout de valeurs par défaut ("Inconnu", "N/A") quand vehicle est undefined
      - Protection des accès dans la recherche et l'affichage
  - **Résultat**: La page ne plante plus même si le backend ne charge pas les véhicules. Affichage de valeurs par défaut au lieu d'un crash.
  - **Note**: Le problème backend (eager loading manquant) persiste, mais le frontend est maintenant résilient.

- **Date**: mardi 3 décembre 2025
- **Description**: Correction du bug où le Navbar client n'affichait pas les options connectées (Mon profil, Mes réservations, Déconnexion).
  - **Problème identifié**: Le composant `Navbar.tsx` vérifiait `localStorage.getItem("isLoggedIn")` pour déterminer si l'utilisateur est connecté, mais `Login.tsx` ne stockait jamais cette valeur.
  - **Fichiers modifiés**:
    - `Mirent-FO/src/Component/login/Login.tsx` : Ajout de `localStorage.setItem("isLoggedIn", "true")` après une connexion client réussie
    - `Mirent-FO/src/redux/features/auth/authSlice.ts` : Ajout de `localStorage.removeItem("isLoggedIn")` dans l'action `logout` pour nettoyer correctement
  - **Résultat**: Le Navbar détecte maintenant correctement la connexion et affiche le bouton "Mon compte" avec les options "Mes réservations", "Mon profil" et "Me déconnecter".

- **Date**: mardi 3 décembre 2025
- **Description**: Implémentation complète de la sécurisation de l'authentification admin avec page de connexion séparée et protection des routes.
  - **Fichiers créés**:
    - `Mirent-FO/src/admin/Components/Authentification/LoginAdmin.tsx` : Page de connexion dédiée pour les administrateurs avec vérification du rôle et intégration Redux
    - `Mirent-FO/src/Components/ProtectedAdminRoute.tsx` : Composant de protection des routes vérifiant l'authentification et le rôle admin
  - **Fichiers modifiés**:
    - `Mirent-FO/src/redux/features/auth/authSlice.ts` : 
      - Ajout des champs `role`, `token`, `firstName`, `lastName`, `id` dans l'état d'authentification
      - Création de l'action `initializeAuth` pour charger l'état depuis localStorage au démarrage
      - Modification de `loginSuccess` et `logout` pour gérer le localStorage automatiquement
    - `Mirent-FO/src/routes/adminRoutes.tsx` : 
      - Ajout de la route `/admin/login` (non protégée)
      - Protection de toutes les routes admin avec le composant `ProtectedAdminRoute`
      - Redirection de la racine `/admin` vers `/admin/login` au lieu de `/admin/home`
    - `Mirent-FO/src/Component/login/Login.tsx` : 
      - Blocage de la connexion des administrateurs via la page client
      - Affichage d'un message d'erreur et redirection vers `/admin/login` si un admin tente de se connecter
  - **Résultat**: Sécurisation complète de l'espace admin - impossible d'accéder aux routes admin sans authentification avec rôle admin. Séparation claire entre connexion client et admin.

- **Date**: mardi 3 décembre 2025
- **Description**: Correction critique du problème CORS bloquant l'authentification des clients et administrateurs.
  - **Fichier modifié**: `mirentt-bo/src/main.ts`
    - **Problème identifié**: 
      - Configuration CORS conflictuelle : `app.use(cors())` était appelé au début, puis `app.enableCors()` à la fin, écrasant la configuration initiale.
      - Duplication du `ValidationPipe` (configuré deux fois aux lignes 24-31 et 48-54).
      - Import inutile de `* as cors from 'cors'`.
    - **Solutions appliquées**:
      - Supprimé l'import `import * as cors from 'cors'` qui n'est plus nécessaire.
      - Déplacé `app.enableCors()` au tout début (après la création de l'app) avec une configuration complète incluant :
        - `origin`: `http://localhost:5173` (frontend Vite)
        - `methods`: Tous les verbes HTTP nécessaires incluant `OPTIONS` pour les requêtes preflight
        - `allowedHeaders`: `Content-Type`, `Authorization`, `Accept`
        - `credentials: true` pour permettre l'envoi de cookies
        - `preflightContinue: false` et `optionsSuccessStatus: 204` pour gérer correctement les requêtes OPTIONS
      - Supprimé le `ValidationPipe` dupliqué, gardé une seule configuration avec `transform: true` et `disableErrorMessages: false`
      - Réorganisé l'ordre des middlewares pour que CORS soit configuré en premier
  - **Résultat**: L'authentification fonctionne maintenant correctement pour les endpoints `/utilisateur/register/client`, `/utilisateur/register/admin` et `/utilisateur/login`

- **Date**: mercredi 3 décembre 2025
- **Description**: Correction de l'affichage du prix en Ariary (Ar) dans le composant `LocationList` (situé dans `Mirent-FO/src/admin/Components/lieux/locationList.tsx`). Le problème était qu'un champ vide s'affichait lorsque `region.prix.prix` était `undefined`, car `formatCurrencyAr(undefined)` provoquait une `RangeError`. La solution implémentée vérifie désormais explicitement que `region.prix.prix` est un nombre valide avant de le formater. Si ce n'est pas le cas, un tiret ("-") est affiché, garantissant un comportement cohérent et évitant le "champ vide".

- **Date**: mercredi 3 décembre 2025
- **Description**: Correction en profondeur du back-end (NestJS) pour résoudre le problème de `prixId` étant `null` dans la base de données.
  - **Fichiers modifiés**: `mirentt-bo/src/entities/region.entity.ts` et `mirentt-bo/src/entities/prix.entity.ts`
    - Correction de la relation `OneToOne` qui était mal configurée avec `@JoinColumn` des deux côtés. Le `@JoinColumn` a été retiré de `prix.entity.ts`, faisant de `Region` le propriétaire unique de la relation.
    - La propriété `prix` dans `region.entity.ts` a été rendue nullable (`Prix | null`) pour correspondre à la réalité de la base de données.
  - **Fichier modifié**: `mirentt-bo/src/regions/create-region.dto.ts`
    - Ajout de `@IsOptional()` à la propriété `prix` pour permettre la validation de la création de régions sans prix.
  - **Fichier modifié**: `mirentt-bo/src/regions/regions.service.ts`
    - La méthode `create` a été corrigée pour utiliser correctement la fonctionnalité de cascade de TypeORM. Elle ne crée une nouvelle entité `Prix` que si les données de prix sont fournies et s'appuie sur `regionRepository.save()` pour enregistrer les deux entités de manière atomique, garantissant que `prixId` est correctement défini.

- **Date**: mercredi 3 décembre 2025
- **Description**: Correction de l'erreur `Property "region" was not found in "Reservation"` et de l'affichage "N/A" dans le composant `BonDeCommandeManagement`.
  - **Fichiers modifiés**: `mirentt-bo/src/commande/commande.service.ts`
    - Correction des relations chargées dans `findAll` et `findOne`. Le nom de la relation a été corrigé de `reservation.region` à `reservation.location` pour correspondre à la définition de l'entité `Reservation`.
  - **Fichier modifié**: `Mirent-FO/src/redux/features/reservation/reservationSlice.ts`
    - Renommage de la propriété `region` en `location` dans l'interface `Reservation` pour correspondre au nom de la propriété dans l'entité back-end.
  - **Fichier modifié**: `Mirent-FO/src/admin/Components/Commandes/BonDeCommandeManagement.tsx`
    - Remplacement de toutes les occurrences de `reservation.region` par `reservation.location` pour accéder correctement aux données de destination et de prix.

- **Date**: mercredi 3 décembre 2025
- **Description**: Implémentation de la logique d'inscription et de connexion pour les rôles `client` et `admin`.
  - **Back-end (`mirentt-bo`)**:
    - **Fichier modifié**: `utilisateur.service.ts`
      - Ajout d'une méthode `registerAdmin` pour créer des utilisateurs avec le rôle `ADMIN`.
      - Modification de la méthode `login` pour inclure le `role` de l'utilisateur dans l'objet `user` de la réponse.
    - **Fichier modifié**: `utilisateur.controller.ts`
      - Renommage de l'endpoint `POST /register` en `POST /register/client` pour la clarté.
      - Ajout d'un nouvel endpoint `POST /register/admin` pour l'inscription des administrateurs.
  - **Front-end (`Mirent-FO`)**:
    - **Fichier modifié**: `Components/register/Register.tsx`
      - Mise à jour de l'appel API pour pointer vers le nouvel endpoint `/utilisateur/register/client`.
    - **Fichier créé**: `admin/Components/Authentification/RegisterAdmin.tsx`
      - Création d'un nouveau composant pour l'inscription des administrateurs, appelant l'endpoint `/utilisateur/register/admin`.
    - **Fichier modifié**: `routes/adminRoutes.tsx`
      - Ajout d'une nouvelle route `/admin/register-admin` pour rendre le composant `RegisterAdmin`.
    - **Fichier modifié**: `Component/login/Login.tsx`
      - Modification de la fonction `handleLogin` pour effectuer une redirection basée sur le rôle de l'utilisateur (`/admin/home` pour les admins, `/acceuil` pour les clients).

- **Date**: mardi 3 décembre 2025
- **Description**: Correction d'une erreur de type TypeScript dans la méthode `update` du service véhicules.
  - **Problème identifié**: "Type 'Vehicule | null' is not assignable to type 'Vehicule'" à la ligne 89 de `vehicles.controller.ts`.
    - Le controller s'attendait à recevoir `Promise<Vehicule>` mais le service retournait `Promise<Vehicule | null>`.
    - Cette incohérence était due au fait que le service lance une `NotFoundException` quand le véhicule n'existe pas, donc ne retourne jamais réellement `null`.
  - **Fichier modifié**: `mirentt-bo/src/vehicles/vehicles.service.ts`
    - Ligne 86: Changement du type de retour de `Promise<Vehicule | null>` à `Promise<Vehicule>` pour refléter le comportement réel de la méthode.
  - **Résultat**: L'erreur TypeScript est maintenant résolue et les types sont cohérents entre le controller et le service.

- **Date**: mardi 3 décembre 2025
- **Description**: Correction de l'affichage du statut "N/A" après création d'un véhicule et du problème d'affichage de l'image.
  - **Problème identifié (Statut)**: Le statut s'affichait "N/A" juste après la création car la méthode `create` retournait le véhicule avec seulement les IDs des relations (type, status) au lieu des objets complets.
  - **Problème identifié (Image)**: 
    1. Le service `vehicles.service.ts` ignorait l'argument `imageUrl`.
    2. Incohérence de chemin entre l'upload et la lecture statique selon le contexte d'exécution (dossier racine vs dossier compilé).
    3. Conflit potentiel d'en-têtes CORS (doublons).
  - **Fichiers modifiés**:
    - `mirentt-bo/src/vehicles/vehicles.service.ts` : Correction de l'assignation de l'image.
    - `mirentt-bo/src/vehicles/vehicles.controller.ts` : Utilisation de `join(__dirname, '..', '..', 'uploads')` pour un chemin relatif au code compilé.
    - `mirentt-bo/src/app.module.ts` : 
      - Utilisation de `join(__dirname, '..', 'uploads')` pour correspondre au controller.
      - Suppression des en-têtes CORS manuels pour laisser `app.enableCors` gérer globalement.
    - `mirentt-bo/src/main.ts` : Suppression de la configuration manuelle conflictuelle.
  - **Résultat**: Le statut s'affiche correctement, et l'image est maintenant correctement enregistrée et servie de manière robuste quel que soit le mode de lancement.

- **Date**: mercredi 4 décembre 2025
- **Description**: Correction des erreurs TypeScript dans le composant d'accueil administrateur (`Accueil.tsx`).
  - **Problèmes identifiés**:
    - Imports manquants: `PersonIcon`, `CalendarIcon` de `@mui/icons-material` et `Chip` de `@mui/material`
    - Fonctions utilitaires manquantes: `getVehicleName()`, `getVehicleLicensePlate()`, `formatCurrencyAr()`
    - Référence à un état `bookings`/`setBookings` inexistant dans `handleDeleteBooking`
  - **Fichier modifié**: `Mirent-FO/src/admin/Components/acceuil/Accueil.tsx`
    - Ajout des imports manquants pour les icônes `PersonIcon` et `CalendarIcon`
    - Ajout de l'import `Chip` pour afficher les statuts de réservation
    - Import de l'action `deleteReservation` depuis `reservationSlice`
    - Création de `getVehicleName()`: retourne le nom du véhicule ou "N/A"
    - Création de `getVehicleLicensePlate()`: retourne l'immatriculation ou "N/A"
    - Création de `formatCurrencyAr()`: formate les montants en Ariary avec séparateur de milliers
    - Correction de `handleDeleteBooking()`: suppression de la référence au state `bookings` inexistant avec un commentaire explicatif
  - **Résultat**: Le tableau de bord admin ne contient plus d'erreurs TypeScript et peut afficher correctement les réservations en attente avec toutes leurs informations (client, véhicule, dates, prix).

- **Date**: mercredi 4 décembre 2025
- **Description**: Correction du bug de page blanche dans le tableau de bord administrateur causé par l'affichage d'objets au lieu de nombres.
  - **Problème identifié**: 
    - Erreur React: "Objects are not valid as a React child (found: object with keys {count})"
    - Les API `/vehicles/available-count` et `/clients/client-count` retournent des objets `{count: number}` au lieu de nombres simples
    - React ne peut pas afficher directement des objets, ce qui causait un crash complet de la page
  - **Fichier modifié**: `Mirent-FO/src/admin/Components/acceuil/Accueil.tsx`
    - Ligne 233 : Ajout de logique pour extraire `data.count` si `data` est un objet, sinon utiliser `data` directement
    - Ligne 253 : Même logique appliquée pour le compteur de clients
    - Utilisation de `typeof data === 'number' ? data : data.count` pour gérer les deux formats possibles
  - **Résultat**: Le tableau de bord administrateur s'affiche maintenant correctement avec les compteurs de véhicules disponibles et de clients totaux.

- **Date**: mercredi 4 décembre 2025
- **Description**: Implémentation complète du workflow de réservation protégé côté client avec système de devis.
  - **Fonctionnalités ajoutées**:
    - Protection des routes de réservation - seuls les clients authentifiés peuvent réserver
    - Création de devis au lieu de réservations directes
    - Confirmation de devis par le client (transformation en bon de commande)
  - **Fichiers créés**:
    - `Mirent-FO/src/Components/ProtectedClientRoute.tsx` : Composant de protection des routes clients (similaire à ProtectedAdminRoute mais pour le rôle "client")
  - **Fichiers modifiés**:
    - `Mirent-FO/src/routes/clientRoute.tsx` : 
      - Protection des routes `/voitures/:id/reserver`, `/reservations-list`, `/reservations/:id/details`, `/reservations/:id/edit`
      - Les routes publiques (acceuil, list-vehicule, détails) restent accessibles sans connexion
    - `Mirent-FO/src/clients/pages/reservationPage.tsx` :
      - Récupération des informations du client connecté depuis Redux (`state.auth.user`)
      - Suppression des champs email, téléphone, nom complet du formulaire (données prises du compte)
      - Utilisation du vrai `clientId` au lieu de l'email
      - Appel de l'endpoint `/reservations/devis` au lieu de `/reservations`
      - Ajout du token d'authentification dans les headers
      - Payload conforme au DTO backend : `clientId`, `vehiculeId`, `pickup_date`, `return_date`, `region_id`, `carburant_policy`
      - Redirection vers `/reservations-list` après succès
    - `Mirent-FO/src/clients/pages/reservationList.tsx` :
      - Ajout de l'action Redux `confirmReservation` pour confirmer les devis
      - Ajout d'un bouton "Confirmer le devis" visible uniquement pour les réservations avec statut "devis"
      - Fonction `handleConfirmQuote` qui appelle l'API `/reservations/:id/confirm` et recharge la liste
      - Type `Reservation.status` étendu pour accepter les statuts du backend ("devis", "confirmee", etc.)
  - **Workflow implémenté**:
    1. Le client doit se connecter pour accéder à la page de réservation
    2. Le formulaire utilise automatiquement les infos du compte client
    3. La soumission crée un **devis** (statut: "devis") au lieu d'une réservation confirmée
    4. Le client peut voir ses devis dans "Mes Réservations"
    5. Le client peut confirmer un devis via le bouton "Confirmer le devis"
    6. La confirmation transforme le devis en **bon de commande** (statut: "confirmee")
    7. L'admin reçoit les devis et les commandes confirmées dans son panneau
  - **Résultat**: Le système de réservation est maintenant sécurisé et suit un workflow de devis professionnel. Les clients non connectés sont redirigés vers la page de connexion.

- **Date**: mercredi 4 décembre 2025
- **Description**: Correction du problème "Client with ID X not found" lors de la création de devis.
  - **Problème identifié**: 
    - L'entité `Reservation` fait référence à la table `Client`, mais l'inscription d'utilisateur ne créait qu'une entrée dans `Utilisateur`
    - Le frontend envoyait `utilisateur.id` (ex: 9) mais le backend cherchait dans la table `Client`
    - Erreur: "Client with ID 9 not found" car aucun Client correspondant
  - **Solution backend** - `mirentt-bo/src/utilisateur/`:
    - **`utilisateur.service.ts`** :
      - Ajout de l'injection du repository `Client`
      - Modification de `register()` pour créer automatiquement un `Client` après création d'`Utilisateur`
      - Le Client est créé avec : `lastName`, `email`, `phone` (vide par défaut)
      - Log de succ\u00e8s : "\u2705 Client cr\u00e9\u00e9 automatiquement pour {email}"
    - **`utilisateur.module.ts`** :
      - Ajout de `Client` dans `TypeOrmModule.forFeature([Utilisateur, Client, InvalidatedToken])`
  - **Solution frontend** - `Mirent-FO/src/clients/pages/reservationPage.tsx` :
    - Modification pour utiliser depuis la table à la place de `visiteur.id`
    - Ajout d'un appel GET `/clients?email=${email}` pour récupérer le `clientId`
    - Utilisation du vrai `clientId` de la table `Client` dans le payload devis
  - **Résultat**: Les nouveaux utilisateurs qui s'inscrivent ont automatiquement un client créé. Pour les utilisateurs existants, le frontend récupère le clientId par email.

- **Date**: mercredi 4 décembre 2025  
- **Description**: Correction du problème "Vous devez être connecté" alors que le client est authentifié.
  - **Problème identifié**: 
    - Le client passait `ProtectedClientRoute` avec succès (log: "✅ Accès autorisé")
    - Mais `userInfo` depuis Redux (`state.auth.user`) retournait `null`
    - L'action `initializeAuth` du Redux authSlice n'était pas appelée au démarrage
  - **Solution rapide** - `Mirent-FO/src/clients/pages/reservationPage.tsx` :
    - Changement de `useSelector((state: RootState) => state.auth.user)` vers lecture directe de `localStorage`
    - Ajout d'un `useState` pour stocker `userInfo`
    - Ajout d'un `useEffect` pour charger `user_info` depuis `localStorage` au montage
    - Garantit que `userInfo` est toujours disponible pour la création de devis
  - **Résultat**: Le client peut maintenant créer des devis sans l'erreur "Vous devez être connecté".

- **Date**: dimanche 8 décembre 2025
- **Description**: Correction de la redirection de déconnexion admin vers le login client au lieu du login admin.
  - **Problème identifié**: 
    - Lorsqu'un admin se déconnectait, il était redirigé vers `/login` (page de login client) au lieu de `/admin/login`
    - Le fichier `user_info` n'était pas supprimé du localStorage lors de la déconnexion
    - Cela affectait la cohérence de l'authentification et pouvait causer des problèmes de sécurité
  - **Fichier modifié**: `Mirent-FO/src/admin/Components/Sidebar/sidebar.tsx`
    - Ligne 347: Changement de `navigate("/login")` vers `navigate("/admin/login")` (cas où il n'y a pas de token)
    - Ligne 361-362: Ajout de `localStorage.removeItem("user_info")` et changement de `navigate("/login")` vers `navigate("/admin/login")` (cas de déconnexion réussie)
    - Ligne 366-367: Ajout de `localStorage.removeItem("user_info")` et changement de `navigate("/login")` vers `navigate("/admin/login")` (cas d'erreur de déconnexion)
  - **Résultat**: Les administrateurs sont maintenant correctement redirigés vers `/admin/login` lors de la déconnexion, et toutes les données d'authentification sont nettoyées du localStorage.