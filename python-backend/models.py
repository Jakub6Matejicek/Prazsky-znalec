from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<User {self.username}>"

class GameResult(db.Model):
    """
    Uchovává výsledky celé jedné hry (tj. součet za 5 kol).
    Můžeš si do tabulky přidat klidně i detail kol, tady je to jen
    pro ukázku základů.
    """
    __tablename__ = 'game_results'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_score = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # vztah k userovi
    user = db.relationship('User', backref='games')

    def __repr__(self):
        return f"<GameResult user_id={self.user_id}, score={self.total_score}>"
