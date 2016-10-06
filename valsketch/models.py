from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()



class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id            = db.Column(db.Integer, primary_key = True)
    name          = db.Column(db.String(50), unique = True, index = True)
    email         = db.Column(db.String(100), nullable = False, unique= True, index = True)
    password_hash = db.Column(db.String(128))

    annotations = db.relationship('Annotation', backref='user', lazy='dynamic')

    def __init__(self, name, email):
        self.name = name
        self.email = email

    def __repr__(self):
        return '<User %s, Email %s>' % (self.name, self.email)

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)



class Annotation(db.Model):
    __tablename__ = 'annotations'

    id = db.Column(db.Integer, primary_key = True)
    uid = db.Column(db.Integer, db.ForeignKey('users.id'))
    fileid = db.Column(db.String)
    category = db.Column(db.String)

    annotation_paths = db.relationship('AnnotationPath', backref='annotation', lazy='dynamic');

    def __init__(self, fileid, category):
        self.fileid = fileid
        self.category = category

    def __repr__(self):
        return '<Annotation File ID %s, Category %s>' % (self.fileid, self.category)

class AnnotationPath(db.Model):
    __tablename__ = 'annotation_paths'

    id = db.Column(db.Integer, primary_key = True)
    fileid = db.Column(db.String);
    part_name = db.Column(db.String);
    path = db.Column(db.String);
    annotation_id = db.Column(db.Integer, db.ForeignKey('annotations.id'));

    def __init__(self, part_name, path):
        self.part_name = part_name
        self.path = path

    def __repr__(self):
        return '<AnnotationPath Part Name %s>' % (self.part_name)




