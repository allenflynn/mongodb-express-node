import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { login, logout, signup } from './login';

const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');
const signUpBtn = document.querySelector('.nav__el.nav__el--cta');

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

if (signUpBtn) {
  signUpBtn.addEventListener('click', signup);
}
