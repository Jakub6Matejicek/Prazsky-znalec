from pathlib import Path
from datetime import timedelta

from flask import Flask, request, jsonify, session, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from email_validator import validate_email, EmailNotValidError

# --- importy z lokálních souborů -------------------------------------------------
from models import db, User, GameResult  # <- models.py musí obsahovat db = SQLAlchemy()

# --- Flask & statická React aplikace --------------------------------------------
REPO_ROOT = Path(__file__).resolve().parent.parent   # prague-geoguessr/
app = Flask(
    __name__,
    static_folder= REPO_ROOT / "python-backend" / "frontend" / "dist",  # absolutní cesta na build
    static_url_path="/"                             # vše ze stejného kořene
)

# --- absolutní cesta k SQLite DB ------------------------------------------------
DB_DIR = Path(app.root_path) / "instance"
DB_DIR.mkdir(parents=True, exist_ok=True)
db_path = DB_DIR / "database.db"

# --- základní konfigurace -------------------------------------------------------
app.config.update(
    SECRET_KEY="nejake-tajne-heslo",            # TODO: nahraď v produkci
    SQLALCHEMY_DATABASE_URI=f"sqlite:///{db_path}",
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
    SESSION_PERMANENT=True,
    PERMANENT_SESSION_LIFETIME=timedelta(hours=1),
    SESSION_COOKIE_SAMESITE="None",              # kvůli cross‑site cookies (HTTPS)
    SESSION_COOKIE_SECURE=True                    # HTTPS only
)

# --- rozšíření ------------------------------------------------------------------
db.init_app(app)
bcrypt = Bcrypt(app)

# ▸▸▸  CORS: povolíme vývojový dev‑server a současně stejný origin  ◂◂◂
CORS(
    app,
    supports_credentials=True,
    resources={r"/api/*": {
        "origins": [
            "http://localhost:5173",           # Vite dev (http)
            "https://localhost:5173",          # Vite dev (https)
            "http://127.0.0.1:5173",
            "https://127.0.0.1:5173",
            "http://127.0.0.1:5000",          # Same‑site (prod)
            "https://127.0.0.1:5000",
        ]
    }}
)

# --------------------------------------------------------------------------------
#                                     API
# --------------------------------------------------------------------------------

@app.route("/api/me", methods=["GET"])
def get_current_user():
    if "user_id" not in session:
        return jsonify({"logged_in": False}), 200

    user = User.query.get(session["user_id"])
    if not user:
        return jsonify({"logged_in": False}), 200

    return jsonify({
        "logged_in": True,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        },
    }), 200


# -------------------------- uživatelé -------------------------------------------

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Missing username, email, or password"}), 400

    try:
        email = validate_email(email).email
    except EmailNotValidError as e:
        return jsonify({"error": str(e)}), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"error": "User with this username or email already exists"}), 400

    pw_hash = bcrypt.generate_password_hash(password).decode("utf-8")
    db.session.add(User(username=username, email=email, password_hash=pw_hash))
    db.session.commit()
    return jsonify({"message": "Registration successful"}), 200


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid username or password"}), 401

    session["user_id"] = user.id
    session.permanent = True
    return jsonify({"message": "Login successful"}), 200


@app.route("/api/logout", methods=["POST"])
def logout():
    session.pop("user_id", None)
    return jsonify({"message": "Logout successful"}), 200


@app.route("/api/forgot_password", methods=["POST"])
def forgot_password():
    data = request.get_json() or {}
    email = data.get("email")
    if not email:
        return jsonify({"error": "Please provide an email"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "No such user"}), 404

    reset_link = f"http://example.com/reset_password?user={user.id}&token=xxx123"
    print(f"[DEBUG] Reset link: {reset_link}")
    return jsonify({"message": "Reset link sent (check console log)"}), 200


# -------------------------- leaderboard -----------------------------------------

@app.route("/api/leaderboard/highest_score", methods=["GET"])
def leaderboard_highest_score():
    results = GameResult.query.order_by(GameResult.total_score.desc()).limit(10).all()
    return jsonify([
        {
            "username": r.user.username,
            "total_score": r.total_score,
            "created_at": r.created_at.strftime("%Y-%m-%d %H:%M"),
        }
        for r in results
    ]), 200


@app.route("/api/leaderboard/average_score", methods=["GET"])
def leaderboard_average_score():
    stats = []
    for u in User.query.all():
        games = GameResult.query.filter_by(user_id=u.id).all()
        avg = sum(g.total_score for g in games) / len(games) if games else 0
        stats.append((u.username, round(avg, 2)))
    stats.sort(key=lambda t: t[1], reverse=True)
    return jsonify([{"username": u, "avg_score": a} for u, a in stats[:10]]), 200


# -------------------------- ukládání hry ----------------------------------------

@app.route("/api/submit_official_game", methods=["POST"])
def submit_official_game():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    total_score = (request.get_json() or {}).get("totalScore", 0)
    db.session.add(GameResult(user_id=session["user_id"], total_score=total_score))
    db.session.commit()
    return jsonify({"message": "Official game score saved"}), 200


# --------------------------------------------------------------------------------
#                       statické soubory + React Router fallback
# --------------------------------------------------------------------------------

@app.route("/api/hello")
def hello():
    return {"msg": "Ahoj z Flasku"}


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path.startswith("api/"):
        return {"error": "Not found"}, 404
    return send_from_directory(app.static_folder, "index.html")


# --------------------------------------------------------------------------------
#                                   runserver
# --------------------------------------------------------------------------------

if __name__ == "__main__":
    print(app.static_folder)
    with app.app_context():
        db.create_all()

    app.run(debug=True, host="127.0.0.1", port=5000)
