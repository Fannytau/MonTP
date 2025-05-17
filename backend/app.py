from flask import Flask, jsonify, request, send_from_directory, make_response
import os, sqlite3, uuid
from datetime import datetime, timedelta

app = Flask(__name__, static_folder='static', static_url_path='/')

def get_db():
    conn = sqlite3.connect('db/app.db')
    conn.row_factory = sqlite3.Row
    return conn

def get_last_wednesday():
    today = datetime.today().date()
    days_since_wed = (today.weekday() - 2) % 7 or 7
    return today - timedelta(days=days_since_wed)

# US2
@app.route('/api/films')
def api_films():
    date = get_last_wednesday().isoformat()
    return jsonify(date=date, films=['Film A','Film B','Film C'])

# US4
cinemas = [{'id':1,'name':'Cinéphoria République'},{'id':2,'name':'Cinéphoria Champs-Élysées'}]
films_by_cinema = {1:[{'id':101,'title':'Film A'},{'id':102,'title':'Film B'}],2:[{'id':201,'title':'Film C'},{'id':202,'title':'Film D'}]}
seances = {101:[{'id':1001,'time':'18:00','price':10},{'id':1002,'time':'21:00','price':12}],102:[{'id':1003,'time':'19:00','price':11}],201:[{'id':2001,'time':'20:00','price':13}],202:[{'id':2002,'time':'17:00','price':9}]}

@app.route('/api/cinemas')
def get_cinemas(): return jsonify(cinemas)
@app.route('/api/films_by_cinema')
def get_films_by_cinema(): return jsonify(films_by_cinema.get(int(request.args.get('cinemaId',0)),[]))
@app.route('/api/seances')
def get_seances(): return jsonify(seances.get(int(request.args.get('filmId',0)),[]))

# US5
all_films = [
    {'id':101,'title':'Film A','cinemaId':1,'genre':'Action','date':'2025-05-14'},
    {'id':102,'title':'Film B','cinemaId':1,'genre':'Comédie','date':'2025-05-14'},
    {'id':201,'title':'Film C','cinemaId':2,'genre':'Drame','date':'2025-05-15'},
    {'id':202,'title':'Film D','cinemaId':2,'genre':'Animation','date':'2025-05-16'},
    {'id':103,'title':'Film E','cinemaId':1,'genre':'Action','date':'2025-05-16'}
]
@app.route('/api/films_filtered')
def get_films_filtered():
    cid,genre,date = request.args.get('cinema'), request.args.get('genre'), request.args.get('date')
    results = all_films
    if cid:   results = [f for f in results if str(f['cinemaId'])==cid]
    if genre: results = [f for f in results if f['genre']==genre]
    if date:  results = [f for f in results if f['date']==date]
    return jsonify(results)

# US6–7
@app.route('/api/auth/login', methods=['POST'])
def login():
    data=request.json or {}; email,pwd=data.get('email',''),data.get('password','')
    if not email or not pwd: return jsonify({'error':'Email et mot de passe requis'}),400
    user=get_db().execute("SELECT * FROM users WHERE email=? AND password=?", (email,pwd)).fetchone()
    if not user: return jsonify({'error':'Identifiants invalides'}),401
    token=str(uuid.uuid4()); resp=make_response(jsonify({'token':token})); resp.set_cookie('auth_token', token, httponly=True)
    return resp

@app.route('/api/auth/register', methods=['POST'])
def register():
    data=request.json or {}; email,pwd=data.get('email',''),data.get('password','')
    if not email or not pwd: return jsonify({'error':'Email et mot de passe requis'}),400
    db=get_db()
    try: db.execute("INSERT INTO users(email,password) VALUES(?,?)",(email,pwd)); db.commit()
    except sqlite3.IntegrityError: return jsonify({'error':'Email déjà utilisé'}),409
    return jsonify({'message':'Inscription réussie'}),201

@app.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    email=request.json.get('email','')
    if not email: return jsonify({'error':'Email requis'}),400
    user=get_db().execute("SELECT * FROM users WHERE email=?", (email,)).fetchone()
    if not user: return jsonify({'error':'Email inconnu'}),404
    return jsonify({'message':f'Email de réinitialisation envoyé à {email}'}),200

# US8
@app.route('/api/admin/films', methods=['GET','POST'])
def admin_films():
    db=get_db()
    if request.method=='GET':
        rows=db.execute("SELECT id,title,genre,date FROM films").fetchall()
        return jsonify([dict(r) for r in rows])
    data=request.json or {}
    db.execute("INSERT INTO films(title,genre,date) VALUES(?,?,?)",(data.get('title'),data.get('genre'),data.get('date')))
    db.commit()
    return jsonify({'message':'Film créé'}),201

@app.route('/api/admin/films/<int:fid>', methods=['PUT','DELETE'])
def admin_film_detail(fid):
    db=get_db()
    if request.method=='PUT':
        data=request.json or {}
        db.execute("UPDATE films SET title=?,genre=?,date=? WHERE id=?",(data.get('title'),data.get('genre'),data.get('date'),fid))
        db.commit(); return jsonify({'message':'Film mis à jour'})
    db.execute("DELETE FROM films WHERE id=?",(fid,)); db.commit()
    return jsonify({'message':'Film supprimé'})

# US9
@app.route('/api/employee/films', methods=['GET'])
def employee_get_films():
    rows=get_db().execute("SELECT id,title,genre,date FROM films").fetchall()
    return jsonify([dict(r) for r in rows])

@app.route('/api/employee/films/<int:fid>', methods=['PUT'])
def employee_update_film(fid):
    data=request.json or {}; db=get_db()
    db.execute("UPDATE films SET title=?,genre=?,date=? WHERE id=?",(data.get('title'),data.get('genre'),data.get('date'),fid))
    db.commit(); return jsonify({'message':'Film mis à jour par employé'})

@app.route('/api/employee/reviews', methods=['GET'])
def employee_get_reviews():
    rows=get_db().execute("SELECT id,filmId,userId,content,is_validated FROM reviews").fetchall()
    return jsonify([dict(r) for r in rows])

@app.route('/api/employee/reviews/<int:rid>', methods=['PUT'])
def employee_validate_review(rid):
    data=request.json or {}; db=get_db()
    db.execute("UPDATE reviews SET is_validated=? WHERE id=?",(bool(data.get('is_validated')),rid))
    db.commit(); return jsonify({'message':'Review mise à jour'})

# US10/11
@app.route('/api/orders')
def get_orders():
    orders=[{'id':1,'film':'Film A','date':'2025-05-14','seance':'18:00','qty':2}]
    return jsonify(orders)

@app.route('/api/ratings', methods=['GET','POST'])
def ratings():
    db=get_db()
    if request.method=='GET':
        rows=db.execute("SELECT * FROM ratings").fetchall()
        return jsonify([dict(r) for r in rows])
    data=request.json or {}
    db.execute("INSERT INTO ratings(filmId,userId,score,comment) VALUES(?,?,?,?)",
               (data.get('filmId'),data.get('userId'),data.get('score'),data.get('comment')))
    db.commit(); return jsonify({'message':'Note ajoutée'}),201

# US12 – Contact
@app.route('/api/contact', methods=['POST'])
def contact():
    data=request.json or {}
    name=data.get('name','').strip()
    subject=data.get('subject','').strip()
    message=data.get('message','').strip()
    if not subject or not message:
        return jsonify({'error':'Sujet et message requis'}),400
    db=get_db()
    db.execute("INSERT INTO contacts(name,subject,message) VALUES(?,?,?)",(name,subject,message))
    db.commit()
    return jsonify({'message':'Votre message a été envoyé !'}),201

# Static pages
for route,page in [('/', 'index.html'),
                   ('/home.html','home.html'),
                   ('/reservation.html','reservation.html'),
                   ('/films.html','films.html'),
                   ('/film-detail.html','film-detail.html'),
                   ('/login.html','login.html'),
                   ('/register.html','register.html'),
                   ('/forgot_password.html','forgot_password.html'),
                   ('/admin.html','admin.html'),
                   ('/employee.html','employee.html'),
                   ('/user_space.html','user_space.html'),
                   ('/contact.html','contact.html')]:
    app.add_url_rule(route, route, lambda p=page: send_from_directory('static', p))

if __name__=='__main__':
    if not os.path.exists('db/app.db'):
        os.makedirs('db',exist_ok=True)
        conn=sqlite3.connect('db/app.db')
        # Tables
        conn.execute("CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,email TEXT UNIQUE,password TEXT)")
        conn.execute("CREATE TABLE IF NOT EXISTS films(id INTEGER PRIMARY KEY,title TEXT,genre TEXT,date TEXT)")
        conn.execute("CREATE TABLE IF NOT EXISTS reviews(id INTEGER PRIMARY KEY,filmId INTEGER,userId INTEGER,content TEXT,is_validated BOOLEAN)")
        conn.execute("CREATE TABLE IF NOT EXISTS orders(id INTEGER PRIMARY KEY,film TEXT,date TEXT,seance TEXT,qty INTEGER)")
        conn.execute("CREATE TABLE IF NOT EXISTS ratings(id INTEGER PRIMARY KEY,filmId INTEGER,userId INTEGER,score INTEGER,comment TEXT)")
        conn.execute("CREATE TABLE IF NOT EXISTS contacts(id INTEGER PRIMARY KEY,name TEXT,subject TEXT,message TEXT)")
        # Inserts initiaux
        conn.execute("INSERT OR IGNORE INTO users(email,password) VALUES('user@example.com','password123')")
        conn.execute("INSERT OR IGNORE INTO films(id,title,genre,date) VALUES(101,'Film A','Action','2025-05-14')")
        conn.execute("INSERT OR IGNORE INTO reviews(id,filmId,userId,content,is_validated) VALUES(1,101,1,'Super film !',0)")
        conn.execute("INSERT OR IGNORE INTO orders(id,film,date,seance,qty) VALUES(1,'Film A','2025-05-14','18:00',2)")
        conn.commit(); conn.close()
    app.run(debug=True)
