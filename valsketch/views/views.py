from flask import (Blueprint, render_template, redirect, flash, request, url_for, current_app)
from valsketch.forms import SigninForm, SignupForm
from valsketch.models import User, db
from  valsketch.helper import file_list, part_list
import numpy.random as random
import os
import json
from jinja2 import Markup
import randomcolor

views = Blueprint('views', __name__, url_prefix='')
rand_color = randomcolor.RandomColor();


@views.route('/')
def index():
    return render_template('index.html', active='index');

@views.route('/signin')
def signin():
    form=SigninForm()
    return render_template('signin.html', form=form, active='signin');

@views.route('/signup', methods=['GET', 'POST'])
def signup():
    form = SignupForm(request.form)
    if request.method == 'POST' and form.validate():
        db.add(form.user)
        flash('Thanks for registering')
        return redirect(url_for('views.signin'))
    return render_template('signup.html', active='signup', form=form);

@views.route('/tool')
def tool():
    sketch_file = random.choice(file_list)
    sketch_meta, colors = get_sketch_meta(sketch_file)
    return render_template('tool.html', sketch_meta=sketch_meta, colors=colors)
    return 'tool'


def get_sketch_meta(fname):
    cat_name = os.path.dirname(fname)
    with open(os.path.join(current_app.root_path, 'static/sketches_svg', fname)) as sketch_file:
        svg = sketch_file.read();
        colors = rand_color.generate(count = len(part_list[cat_name]))

    return ({'parts' : part_list[cat_name],
            'svg'   : Markup(svg),
            'category': cat_name.capitalize()}, colors)


# fb client id: 853753161392782
# fb client secret: 72d8b0c67dacfe2f2fc415c3137758e1


#@app.route('/')
#def index():
#    return render_template('index.html', active='index');
    #if not google.authorized:
    #    return redirect(url_for("google.login"))
    #resp = google.get("plus/v1/people/me")
    #assert resp.ok, resp.text
    #return "You are {email} on Google".format(email=resp.json()["emails"][0]["value"])

#app.secret_key = "supersekrit"
#blueprint = make_google_blueprint(
#    client_id="1096611460311-1fv15mis6p6sl6utj4pc5tcgl120hhup.apps.googleusercontent.com",
#    client_secret="sRixDroNfhH9RWPNk4gYjhMu",
#    scope=["profile", "email"]
#)
#app.register_blueprint(blueprint, url_prefix="/login")
