from flask_wtf import FlaskForm, RecaptchaField
from wtforms import StringField, PasswordField, BooleanField
from wtforms.validators import DataRequired, Email, Length, EqualTo
from valsketch.models import User


class SigninForm(FlaskForm):
    email = StringField(label="Email Address", id='inputEmail', validators=[Email()])
    password = PasswordField(label="Password", id='inputPassword', validators=[DataRequired()])
    recaptcha = RecaptchaField()

class SignupForm(FlaskForm):
    username = StringField(
            label="Username",
            id='inputUsername',
            validators=[Length(min=4, max=25)])

    email = StringField(label='Email Address', id='inputEmail', validators=[Email(message='Enter a valid email address')] )

    password = PasswordField(label='New Password', id='inputPassword', validators=[
        DataRequired(),
        EqualTo('confirm', message='Passwords must match')
    ])

    confirm = PasswordField('Repeat Password')
    accept_tos = BooleanField(
            'I accept the Terms of Service',
            validators=[DataRequired('You must accept our Terms of Service')])
    recaptcha = RecaptchaField()


    def validate(self):
        rv = FlaskForm.validate(self)
        if not rv:
            return False

        # user = User(user=self.username.data, email='mist', sex='m', age=12)
        user = User.query.filter_by(email=self.email.data).first()

        if user is not None:
            error = 'Email already in use'
            self.email.errors.append(error)
            print("ERROR: %s" % error)
            return False

        user = User(
               name=self.name.data,
               email=self.email.data)
        user.password = self.password.data

        self.user = user
        return True

