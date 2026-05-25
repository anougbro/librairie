# 📚 Library Management System

Application React de gestion de bibliothèque avec principes OOD.

## Structure du projet

```
library-app/
├── public/
│   └── index.html
├── src/
│   ├── core/                    # Logique métier (OOD)
│   │   ├── UserFactory.js       # Factory Pattern
│   │   ├── reducer.js           # Singleton Pattern (état central)
│   │   └── data.js              # Données initiales & constantes
│   ├── components/              # Composants UI réutilisables
│   │   ├── Badge.jsx
│   │   ├── Btn.jsx
│   │   ├── Empty.jsx
│   │   ├── Field.jsx
│   │   ├── Modal.jsx
│   │   ├── Sidebar.jsx
│   │   └── Toast.jsx
│   ├── sections/                # Pages de l'application
│   │   ├── Dashboard.jsx
│   │   ├── Users.jsx
│   │   ├── Books.jsx
│   │   └── Transactions.jsx
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   └── index.js
└── package.json
```

## Design Patterns utilisés

| Pattern     | Fichier          | Description                                       |
|-------------|------------------|---------------------------------------------------|
| Singleton   | `reducer.js`     | Un seul état central via `useReducer`             |
| Factory     | `UserFactory.js` | Création découplée des objets `Student`/`Teacher` |
| Observer    | `reducer.js`     | Notifications pushées dans l'inbox de chaque user |

## Lancer le projet

```bash
npm install
npm start
```

L'application s'ouvre sur `http://localhost:3000`.

## Fonctionnalités

- **Dashboard** — statistiques, alertes de retard, distribution des genres
- **Utilisateurs** — ajouter/supprimer, boîte de notifications
- **Catalogue** — ajouter/supprimer, emprunter, filtrer par genre/disponibilité
- **Transactions** — historique complet, retourner, marquer en retard
