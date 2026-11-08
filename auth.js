import { supabase } from './supabase-config.js';

const form = document.getElementById('authForm');

const loginTab = document.getElementById('loginTab');

const registerTab = document.getElementById('registerTab');

const nameGroup = document.getElementById('nameGroup');

const fullName = document.getElementById('fullName');

const email = document.getElementById('email');

const password = document.getElementById('password');

const message = document.getElementById('message');

const submitButton = document.getElementById('submitButton');

const forgot = document.getElementById('forgot');

let mode = 'login';


function showMessage(text, type) {

    message.textContent = text;

    message.className = type;

}


function setMode(newMode) {

    mode = newMode;

    loginTab.classList.toggle(
        'active',
        mode === 'login'
    );

    registerTab.classList.toggle(
        'active',
        mode === 'register'
    );

    nameGroup.hidden = mode !== 'register';

    fullName.required = mode === 'register';

    forgot.hidden = mode !== 'login';

    submitButton.textContent =
        mode === 'login'
        ? 'تسجيل الدخول'
        : 'إنشاء حساب جديد';

    showMessage('', '');

}


loginTab.onclick = () => setMode('login');

registerTab.onclick = () => setMode('register');


form.addEventListener('submit', async (event) => {

    event.preventDefault();

    submitButton.disabled = true;

    showMessage('جارٍ معالجة طلبك...', '');

    try {

        const userEmail = email.value.trim();

        const userPassword = password.value;

        if (mode === 'register') {

            const { data, error } =
                await supabase.auth.signUp({

                    email: userEmail,

                    password: userPassword,

                    options: {

                        data: {
                            full_name: fullName.value.trim()
                        },

                        emailRedirectTo:
                            window.location.origin +
                            window.location.pathname.replace(
                                /[^/]*$/,
                                'dashboard.html'
                            )

                    }

                });

            if (error) throw error;

            if (data.session) {

                window.location.href = 'dashboard.html';

            } else {

                showMessage(
                    'تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتأكيد التسجيل.',
                    'success'
                );

            }

        } else {

            const { data, error } =
                await supabase.auth.signInWithPassword({

                    email: userEmail,

                    password: userPassword

                });

            if (error) throw error;

            window.location.href = 'dashboard.html';

        }

    } catch (error) {

        showMessage(
            error.message,
            'error'
        );

    } finally {

        submitButton.disabled = false;

    }

});


forgot.addEventListener('click', async () => {

    const userEmail = email.value.trim();

    if (!userEmail) {

        showMessage(
            'أدخل بريدك الإلكتروني أولاً.',
            'error'
        );

        return;

    }

    try {

        const { error } =
            await supabase.auth.resetPasswordForEmail(
                userEmail,
                {
                    redirectTo: window.location.origin +
                    window.location.pathname.replace(
                        /[^/]*$/,
                        'auth.html'
                    ) + '?reset=1'
                }
            );

        if (error) throw error;

        showMessage(
            'تم إرسال رابط استعادة كلمة المرور إلى بريدك.',
            'success'
        );

    } catch (error) {

        showMessage(error.message, 'error');

    }

});


// Check existing session

const { data } = await supabase.auth.getSession();

if (data.session) {

    window.location.href = 'dashboard.html';

}