# MonTP – WebApp US1-12

## Installation

1. Créez un environnement virtuel et installez Flask :
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install flask
   ```

2. Initialisez la base données :
   ```bash
   cd backend/db
   sqlite3 app.db < create_tables.sql
   sqlite3 app.db < fixtures.sql
   mv app.db ../
   cd ../..
   ```

3. Lancez le serveur Flask :
   ```bash
   python3 backend/app.py
   ```

4. Ouvrez votre navigateur :
   - Menu & Footer : http://127.0.0.1:5000/
   - Page d’accueil : http://127.0.0.1:5000/home.html
   - Réservation : http://127.0.0.1:5000/reservation.html
   - Liste des films : http://127.0.0.1:5000/films.html
   - Détails film : http://127.0.0.1:5000/film-detail.html
   - Connexion : http://127.0.0.1:5000/login.html
   - Inscription : http://127.0.0.1:5000/register.html
   - Mot de passe oublié : http://127.0.0.1:5000/forgot_password.html
   - Admin : http://127.0.0.1:5000/admin.html
   - Employé : http://127.0.0.1:5000/employee.html
   - Mon Espace : http://127.0.0.1:5000/user_space.html
   - Contact : http://127.0.0.1:5000/contact.html
