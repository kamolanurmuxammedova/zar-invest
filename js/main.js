document.addEventListener('DOMContentLoaded', () => {

    const phoneInput = document.getElementById('phone');
    const phoneForm = document.getElementById('phone-form');

    if (phoneInput) {
        const savedPhone = localStorage.getItem('user_phone');
        if (savedPhone) {
            phoneInput.value = savedPhone;
        }

        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (!value.startsWith('998')) value = '998' + value;
            value = value.substring(0, 12);

            let formatted = '+';
            if (value.length > 0) formatted += value.substring(0, 3);
            if (value.length > 3) formatted += ' ' + value.substring(3, 5);
            if (value.length > 5) formatted += ' ' + value.substring(5, 8);
            if (value.length > 8) formatted += ' ' + value.substring(8, 10);
            if (value.length > 10) formatted += ' ' + value.substring(10, 12);

            e.target.value = formatted;
            localStorage.setItem('user_phone', formatted);
        });
    }

    if (phoneForm) {
        phoneForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const rawPhone = phoneInput ? phoneInput.value.replace(/\s+/g, '') : '';

            if (rawPhone.length < 13) {
                alert("Iltimos, telefon raqamingizni to'liq kiriting!");
                return;
            }
            localStorage.setItem('user_phone', phoneInput.value);
            window.location.href = './hisob2.html';
        });
    }

    const uploadBox = document.getElementById('upload-box');
    const fileInput = document.getElementById('file-input');
    const uploadText = document.getElementById('upload-text');
    const nextBtnStep2 = document.getElementById('next-btn');
    const reselectBtn = document.getElementById('reselect-btn');
    const statusBadge = document.getElementById('status-badge');

    if (uploadText && statusBadge) {
        const savedDocName = localStorage.getItem('user_document_name');
        if (savedDocName) {
            uploadText.textContent = `Yuklandi: ${savedDocName}`;
            statusBadge.textContent = "YUKLANDI";
            statusBadge.className = "inline-block bg-[#1a2e22] text-[#26d07c] text-xs font-mono px-3 py-1 rounded border border-[#26d07c]/30 tracking-widest transition-colors";
        }
    }

    if (uploadBox && fileInput) {
        uploadBox.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (uploadText) uploadText.textContent = `Yuklandi: ${file.name}`;
                if (statusBadge) {
                    statusBadge.textContent = "YUKLANDI";
                    statusBadge.className = "inline-block bg-[#1a2e22] text-[#26d07c] text-xs font-mono px-3 py-1 rounded border border-[#26d07c]/30 tracking-widest transition-colors";
                }

                const reader = new FileReader();
                reader.onload = function (evt) {
                    localStorage.setItem('user_avatar', evt.target.result);
                    localStorage.setItem('user_document_name', file.name);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (reselectBtn) {
        reselectBtn.addEventListener('click', () => {
            if (fileInput) fileInput.value = '';
            localStorage.removeItem('user_avatar');
            localStorage.removeItem('user_document_name');
            if (uploadText) uploadText.textContent = 'Hujjatning old tomonini ramka ichiga joylashtiring';
            if (statusBadge) {
                statusBadge.textContent = 'KUTILMOQDA...';
                statusBadge.className = "inline-block bg-[#242118] text-[#dfb954] text-xs font-mono px-3 py-1 rounded border border-[#dfb954]/30 tracking-widest transition-colors";
            }
        });
    }

    if (nextBtnStep2) {
        nextBtnStep2.addEventListener('click', () => {
            if (!localStorage.getItem('user_avatar') && (!fileInput || !fileInput.files || fileInput.files.length === 0)) {
                alert("Iltimos, avval hujjat rasmini yuklang!");
                return;
            }
            window.location.href = './hisob3.html';
        });
    }

    const profileForm = document.getElementById('investor-profile-form');
    const savedGoal = localStorage.getItem('user_goal') || localStorage.getItem('goal') || localStorage.getItem('investor_goal');
    const savedTerm = localStorage.getItem('user_term') || localStorage.getItem('term') || localStorage.getItem('investor_term');
    const savedRisk = localStorage.getItem('user_risk') || localStorage.getItem('risk') || localStorage.getItem('investor_risk');

    const goalOptions = document.querySelectorAll('.goal-option');
    goalOptions.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        if (savedGoal && radio && radio.value === savedGoal) {
            radio.checked = true;
            option.classList.remove('border-[#1f242d]', 'bg-[#12141a]');
            option.classList.add('border-[#dfb954]', 'bg-[#14171f]');
        }

        option.addEventListener('click', () => {
            goalOptions.forEach(opt => {
                opt.classList.remove('border-[#dfb954]', 'bg-[#14171f]');
                opt.classList.add('border-[#1f242d]', 'bg-[#12141a]');
            });
            option.classList.remove('border-[#1f242d]', 'bg-[#12141a]');
            option.classList.add('border-[#dfb954]', 'bg-[#14171f]');

            if (radio) {
                radio.checked = true;
                localStorage.setItem('user_goal', radio.value);
            }
        });
    });

    const termOptions = document.querySelectorAll('.term-option');
    termOptions.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        if (savedTerm && radio && radio.value === savedTerm) {
            radio.checked = true;
            option.classList.remove('border-[#1f242d]', 'bg-[#12141a]');
            option.classList.add('border-[#dfb954]', 'bg-[#14171f]');
        }

        option.addEventListener('click', () => {
            termOptions.forEach(opt => {
                opt.classList.remove('border-[#dfb954]', 'bg-[#14171f]');
                opt.classList.add('border-[#1f242d]', 'bg-[#12141a]');
            });
            option.classList.remove('border-[#1f242d]', 'bg-[#12141a]');
            option.classList.add('border-[#dfb954]', 'bg-[#14171f]');

            if (radio) {
                radio.checked = true;
                localStorage.setItem('user_term', radio.value);
            }
        });
    });

    const riskOptions = document.querySelectorAll('.risk-option');
    riskOptions.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        if (savedRisk && radio && radio.value === savedRisk) {
            radio.checked = true;
            option.classList.remove('border-[#1f242d]', 'bg-[#12141a]');
            option.classList.add('border-[#dfb954]', 'bg-[#14171f]');
            const span = option.querySelector('span');
            if (span) {
                span.classList.remove('text-[#8b93a0]');
                span.classList.add('text-white');
            }
        }

        option.addEventListener('click', () => {
            riskOptions.forEach(opt => {
                opt.classList.remove('border-[#dfb954]', 'bg-[#14171f]');
                opt.classList.add('border-[#1f242d]', 'bg-[#12141a]');
                const span = opt.querySelector('span');
                if (span) {
                    span.classList.remove('text-white');
                    span.classList.add('text-[#8b93a0]');
                }
            });
            option.classList.remove('border-[#1f242d]', 'bg-[#12141a]');
            option.classList.add('border-[#dfb954]', 'bg-[#14171f]');

            if (radio) {
                radio.checked = true;
                localStorage.setItem('user_risk', radio.value);
            }

            const activeSpan = option.querySelector('span');
            if (activeSpan) {
                activeSpan.classList.remove('text-[#8b93a0]');
                activeSpan.classList.add('text-white');
            }
        });
    });

    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.href = './hisob4.html';
        });
    }

    const paymentForm = document.getElementById('payment-form');
    const paymentOptions = document.querySelectorAll('.payment-option');
    const savedPayment = localStorage.getItem('user_payment_method') || localStorage.getItem('payment_method');

    paymentOptions.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        if (savedPayment && radio && radio.value === savedPayment) {
            radio.checked = true;
            option.classList.remove('border-[#1f242d]', 'bg-[#12141a]');
            option.classList.add('border-[#dfb954]', 'bg-[#14171f]');
        }

        option.addEventListener('click', () => {
            if (radio && radio.disabled) return;

            paymentOptions.forEach(opt => {
                opt.classList.remove('border-[#dfb954]', 'bg-[#14171f]');
                opt.classList.add('border-[#1f242d]', 'bg-[#12141a]');
            });

            option.classList.remove('border-[#1f242d]', 'bg-[#12141a]');
            option.classList.add('border-[#dfb954]', 'bg-[#14171f]');

            if (radio) {
                radio.checked = true;
                localStorage.setItem('user_payment_method', radio.value);
            }
        });
    });

    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.href = './hisob5.html';
        });
    }

    const step5Form = document.getElementById('step5-form');
    const firstnameInput = document.getElementById('firstname');
    const lastnameInput = document.getElementById('lastname');
    const ageInput = document.getElementById('age');

    if (firstnameInput) firstnameInput.value = localStorage.getItem('user_firstname') || '';
    if (lastnameInput) lastnameInput.value = localStorage.getItem('user_lastname') || '';
    if (ageInput) ageInput.value = localStorage.getItem('user_age') || '';

    const savedGender = localStorage.getItem('user_gender');
    if (savedGender) {
        const genderRadio = document.querySelector(`input[name="gender"][value="${savedGender}"]`);
        if (genderRadio) genderRadio.checked = true;
    }

    if (step5Form) {
        step5Form.addEventListener('submit', (e) => {
            e.preventDefault();

            const firstname = firstnameInput?.value || '';
            const lastname = lastnameInput?.value || '';
            const age = ageInput?.value || '';
            const gender = document.querySelector('input[name="gender"]:checked')?.value || '';

            localStorage.setItem('user_firstname', firstname);
            localStorage.setItem('user_lastname', lastname);
            localStorage.setItem('user_age', age);
            localStorage.setItem('user_gender', gender);

            window.location.href = '../../index.html';
        });
    }

    const authContainer = document.getElementById('auth-container');
    const savedAvatar = localStorage.getItem('user_avatar');
    const savedName = localStorage.getItem('user_firstname');

    if (authContainer && (savedAvatar || savedName)) {
        const isInsideHisobPages = window.location.pathname.includes('/pages/hisob-pages/');

        const profilePath = isInsideHisobPages 
            ? '../../profile.html' 
            : './profile.html';

        const defaultImage = isInsideHisobPages 
            ? '../../images/default-avatar.png' 
            : './images/default-avatar.png';

        const userImg = savedAvatar || defaultImage;

        authContainer.innerHTML = `
            <a href="${profilePath}" class="flex items-center gap-3 group">
                <div class="w-10 h-10 rounded-full border-2 border-[#ECC246] overflow-hidden group-hover:border-white transition-colors cursor-pointer">
                    <img src="${userImg}" alt="User Avatar" class="w-full h-full object-cover" />
                </div>
            </a>
        `;
    }

    const profileAvatar = document.getElementById('profile-page-avatar');
    const profileName = document.getElementById('profile-page-name');
    const sidebarUserName = document.getElementById('sidebar-user-name');
    const profilePhone = document.getElementById('profile-phone');
    const profileAge = document.getElementById('profile-age');
    const profileGender = document.getElementById('profile-gender');
    const profileGoal = document.getElementById('profile-goal');
    const profileTerm = document.getElementById('profile-term');
    const profileRisk = document.getElementById('profile-risk');
    const profilePayment = document.getElementById('profile-payment');
    const profileDoc = document.getElementById('profile-doc');

    if (profileAvatar || profileName || profilePhone) {
        const avatar = localStorage.getItem('user_avatar');
        const firstname = localStorage.getItem('user_firstname') || '';
        const lastname = localStorage.getItem('user_lastname') || '';
        const phone = localStorage.getItem('user_phone') || '+998 -- --- -- --';
        const age = localStorage.getItem('user_age');
        const gender = localStorage.getItem('user_gender');
        
        const goal = localStorage.getItem('user_goal') || localStorage.getItem('goal') || localStorage.getItem('investor_goal');
        const term = localStorage.getItem('user_term') || localStorage.getItem('term') || localStorage.getItem('investor_term');
        const risk = localStorage.getItem('user_risk') || localStorage.getItem('risk') || localStorage.getItem('investor_risk');
        const payment = localStorage.getItem('user_payment_method') || localStorage.getItem('payment_method');
        
        const docName = localStorage.getItem('user_document_name');

        const fullName = (firstname || lastname) ? `${firstname} ${lastname}`.trim() : 'Foydalanuvchi';

        if (profileAvatar && avatar) profileAvatar.src = avatar;
        if (profileName) profileName.textContent = fullName;
        if (sidebarUserName) sidebarUserName.textContent = fullName.toLowerCase();
        if (profilePhone) profilePhone.textContent = phone;
        if (profileAge) profileAge.textContent = age ? `${age} yosh` : 'Kiritilmagan';
        if (profileGender) profileGender.textContent = gender ? (gender === 'male' ? 'Erkak' : 'Ayol') : 'Kiritilmagan';
        if (profileGoal) profileGoal.textContent = goal || 'Kiritilmagan';
        if (profileTerm) profileTerm.textContent = term || 'Kiritilmagan';
        if (profileRisk) profileRisk.textContent = risk || 'Kiritilmagan';
        if (profilePayment) profilePayment.textContent = payment || 'Kiritilmagan';
        if (profileDoc) profileDoc.textContent = docName ? `Yuklangan (${docName})` : 'Yuklanmagan';
    }

    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = './index.html';
            }
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = './index.html';
        });
    }

    const deleteAccountBtn = document.getElementById('delete-account-btn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = './index.html';
        });
    }

    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (navButtons.length > 0 && tabContents.length > 0) {
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = btn.getAttribute('data-target');

                navButtons.forEach(b => {
                    b.classList.remove('bg-[#221E14]', 'text-[#ECC246]', 'border-[#ECC246]/20');
                    b.classList.add('text-[#99A0AC]', 'border-transparent');
                });

                btn.classList.remove('text-[#99A0AC]', 'border-transparent');
                btn.classList.add('bg-[#221E14]', 'text-[#ECC246]', 'border-[#ECC246]/20');

                tabContents.forEach(tab => {
                    tab.classList.add('hidden');
                    tab.classList.remove('block');
                });

                const targetTab = document.getElementById(`tab-${targetId}`);
                if (targetTab) {
                    targetTab.classList.remove('hidden');
                    targetTab.classList.add('block');
                }
            });
        });
    }

});