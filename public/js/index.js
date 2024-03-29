import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { login, logout, signup } from './login';
import { update } from './update';

const loginForm = document.querySelector('.form.form--login');
const signUpFrom = document.querySelector('.form.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form.form-user-data');
const userPasswordForm = document.querySelector('.form.form-user-password');

if (signUpFrom) {
  signUpFrom.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('passwordConfirm').value;
    signup(name, email, password, confirm);
  });
}

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

if (userDataForm) {
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('photo', document.getElementById('photo').files[0]);
    update(formData, 'settings');
    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;
    // update({ name, email }, 'settings');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const current = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('password-confirm').value;

    await update({ current, password, confirm }, 'password');
    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
