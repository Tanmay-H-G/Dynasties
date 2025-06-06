// Dynasty files mapping
const dynastyFiles = {
    'gurjara-pratihara': 'data/gurjara-pratihara.json',
    'chola': 'data/chola.json',
    'hoysala': 'data/hoysala.json',
    'delhi': 'data/delhi.json',
    'bahmani': 'data/bahmani.json',
    'vijayanagara': 'data/vijayanagara.json',
    'mughal': 'data/mughal.json',
    'maratha': 'data/maratha.json',
    'sikh': 'data/sikh.json',
    'british': 'data/british.json'
};

// Function to open the modal with dynasty information
function openModal(dynasty) {
    const modal = document.getElementById("dynastyModal");
    const modalInfo = document.getElementById("modal-info");
    const videoIframe = document.getElementById("modal-dynasty-video");

    if (!modal || !modalInfo || !videoIframe) {
        console.error("Modal elements not found.");
        return;
    }

    if (dynastyFiles[dynasty]) {
        modalInfo.innerHTML = "<p>Loading...</p>";
        videoIframe.style.display = "none";
        fetch(dynastyFiles[dynasty])
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${dynasty} data: ${response.status}`);
                return response.json();
            })
            .then(data => {
                renderAllSections(data, videoIframe);
                modal.style.display = "block";
                modalInfo.focus();
            })
            .catch(error => {
                console.error(`Error loading ${dynasty} data:`, error);
                modalInfo.innerHTML = `<p>Error loading dynasty information: ${error.message}. Please try again later.</p>`;
                modal.style.display = "block";
            });
    } else {
        modalInfo.innerHTML = "<p>Dynasty information not found.</p>";
        modal.style.display = "block";
    }
}

function renderAllSections(data, videoIframe) {
    const modalInfo = document.getElementById("modal-info");

    if (!modalInfo) {
        console.error("Modal info element not found.");
        return;
    }

    const sectionsHTML = data.sections.map(section => {
        let contentHTML = Array.isArray(section.content)
            ? section.content.map(paragraph => `<p>${paragraph}</p>`).join("")
            : `<p>${section.content}</p>`;
        return `
            <section>
                <h3>${section.title}</h3>
                <div style="text-align:center; margin-bottom: 20px;">
                    <img src="${section.image}" alt="${section.title}" 
                        style="max-width:50%; height:auto; border-radius:10px; box-shadow:0 4px 8px rgba(0,0,0,0.2);">
                </div>
                ${contentHTML}
            </section>
            <hr>
        `;
    }).join("");

    if (data.video) {
        videoIframe.src = data.video;
        videoIframe.style.display = "block";
    } else {
        videoIframe.src = "";
        videoIframe.style.display = "none";
        console.warn(`No video URL found for ${data.name}`);
    }

    let info = `
        <h2 id="modal-title">${data.name} (${data.period})</h2>
        <p><strong>Founder:</strong> ${data.founder}</p>
        <p><strong>Capital:</strong> ${data.capital}</p>
        <hr>
        <div style="text-align:center; margin-bottom: 20px;">
            <img src="${data.image}" alt="${data.name} Map" 
                style="max-width:50%; height:auto; border-radius:10px; box-shadow:0 4px 8px rgba(0,0,0,0.2);">
        </div>
        ${sectionsHTML}
    `;

    modalInfo.innerHTML = info.replace(/<hr>$/, '');
}

function closeModal() {
    const modal = document.getElementById("dynastyModal");
    const videoIframe = document.getElementById("modal-dynasty-video");

    if (modal && videoIframe) {
        modal.style.display = "none";
        videoIframe.src = "";
    } else {
        console.error("Modal or video iframe not found.");
    }
}

document.addEventListener('click', function (event) {
    const modal = document.getElementById("dynastyModal");
    if (event.target === modal) {
        closeModal();
    }
});

function openLogin() {
    window.open("login.html", "_blank");
}

// Function to toggle between login and register forms
function toggleForm(formType) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginFeedback = document.getElementById('loginFeedback');
    const registerFeedback = document.getElementById('registerFeedback');

    if (loginForm && registerForm && loginFeedback && registerFeedback) {
        if (formType === 'register') {
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
            loginFeedback.innerHTML = '';
            document.getElementById('username').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('password').value = '';
            document.getElementById('passwordStrength').innerHTML = '';
        } else {
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
            registerFeedback.innerHTML = '';
            document.getElementById('reg-username').value = '';
            document.getElementById('reg-email').value = '';
            document.getElementById('reg-phone').value = '';
            document.getElementById('reg-password').value = '';
            document.getElementById('regPasswordStrength').innerHTML = '';
        }
        document.querySelectorAll('.input-box').forEach(box => {
            box.classList.remove('error');
            box.removeAttribute('data-error');
        });
    }
}

// Function to validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to validate phone number (10 digits)
function validatePhone(phone) {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
}

// Function to validate username (alphanumeric, 3-20 characters)
function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
    return usernameRegex.test(username);
}

// Function to handle registration
function handleRegister(event) {
    event.preventDefault();

    const method = document.getElementById('register-method').value;
    const identifier = document.getElementById('register-identifier').value.trim();
    const password = document.getElementById('reg-password').value;
    const feedback = document.getElementById('registerFeedback');

    if (!identifier || !password) {
        feedback.innerHTML = "<p style='color: red;'>Please fill in all fields.</p>";
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user[method] === identifier);

    if (userExists) {
        feedback.innerHTML = `<p style='color: red;'>${method} already exists.</p>`;
        return;
    }

    users.push({ [method]: identifier, password });
    localStorage.setItem('users', JSON.stringify(users));

    feedback.innerHTML = "<p style='color: green;'>Registration successful! Please login.</p>";
    setTimeout(() => toggleForm('login'), 1000);
}

// Function to handle login
function handleLogin(event) {
    event.preventDefault();

    const method = document.getElementById('login-method').value;
    const identifier = document.getElementById('login-identifier').value.trim();
    const password = document.getElementById('password').value;
    const feedback = document.getElementById('loginFeedback');

    if (!identifier || !password) {
        feedback.innerHTML = "<p style='color: red;'>Please fill in all fields.</p>";
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user[method] === identifier && user.password === password);

    if (user) {
        feedback.innerHTML = "<p style='color: green;'>Login successful!</p>";
        setTimeout(() => (window.location.href = "index.html"), 1000);
    } else {
        feedback.innerHTML = "<p style='color: red;'>Invalid credentials.</p>";
    }
}

// Password strength indicator for login form
const passwordInput = document.getElementById('password');
if (passwordInput) {
    passwordInput.addEventListener('input', function () {
        const password = this.value;
        const strengthIndicator = document.getElementById('passwordStrength');
        if (!strengthIndicator) return;

        let strength = '';

        if (password.length < 6) {
            strength = 'Too short';
            strengthIndicator.style.color = 'red';
        } else if (password.length < 10) {
            strength = 'Weak';
            strengthIndicator.style.color = 'orange';
        } else if (password.match(/[A-Z]/) && password.match(/[0-9]/)) {
            strength = 'Strong';
            strengthIndicator.style.color = 'green';
        } else {
            strength = 'Moderate';
            strengthIndicator.style.color = 'yellow';
        }

        strengthIndicator.innerHTML = `Password Strength: ${strength}`;
    });
}

// Password strength indicator for register form
const regPasswordInput = document.getElementById('reg-password');
if (regPasswordInput) {
    regPasswordInput.addEventListener('input', function () {
        const password = this.value;
        const strengthIndicator = document.getElementById('regPasswordStrength');
        if (!strengthIndicator) return;

        let strength = '';

        if (password.length < 6) {
            strength = 'Too short';
            strengthIndicator.style.color = 'red';
        } else if (password.length < 10) {
            strength = 'Weak';
            strengthIndicator.style.color = 'orange';
        } else if (password.match(/[A-Z]/) && password.match(/[0-9]/)) {
            strength = 'Strong';
            strengthIndicator.style.color = 'green';
        } else {
            strength = 'Moderate';
            strengthIndicator.style.color = 'yellow';
        }

        strengthIndicator.innerHTML = `Password Strength: ${strength}`;
    });
}

// Quiz Functionality
const quizQuestionPool = [
    { question: "Which Chola king is credited with building the Brihadeeswarar Temple?", options: ["Rajaraja Chola I", "Rajendra Chola I", "Vijayalaya Chola", "Aditya Chola"], answer: "Rajaraja Chola I" },
    { question: "What was the capital of the Vijayanagara Empire during its peak?", options: ["Madurai", "Hampi", "Thanjavur", "Warangal"], answer: "Hampi" },
    { question: "Which Mughal emperor introduced the policy of Sulh-i-Kul?", options: ["Babur", "Akbar", "Jahangir", "Aurangzeb"], answer: "Akbar" },
    { question: "In which battle did Shivaji Maharaj defeat the Bijapur Sultanate in 1659?", options: ["Battle of Pratapgad", "Battle of Panipat", "Battle of Talikota", "Battle of Bhima Koregaon"], answer: "Battle of Pratapgad" },
    { question: "Who was the last ruler of the Delhi Sultanate before the Mughal conquest?", options: ["Alauddin Khalji", "Ibrahim Lodi", "Firuz Shah Tughlaq", "Balban"], answer: "Ibrahim Lodi" },
    { question: "Which dynasty built the Qutub Minar, initially started under Qutb-ud-din Aibak?", options: ["Khalji Dynasty", "Tughlaq Dynasty", "Slave Dynasty", "Lodi Dynasty"], answer: "Slave Dynasty" },
    { question: "What was the primary language of administration under the Bahmani Sultanate?", options: ["Sanskrit", "Persian", "Tamil", "Marathi"], answer: "Persian" },
    { question: "Which Sikh Guru established the Khalsa in 1699?", options: ["Guru Nanak", "Guru Gobind Singh", "Guru Hargobind", "Guru Tegh Bahadur"], answer: "Guru Gobind Singh" },
    { question: "Which British Governor-General introduced the Doctrine of Lapse in 1848?", options: ["Lord Dalhousie", "Lord Cornwallis", "Lord Wellesley", "Lord Hastings"], answer: "Lord Dalhousie" },
    { question: "Which Hoysala king is known for commissioning the Chennakesava Temple at Belur?", options: ["Vishnuvardhana", "Ballala II", "Vira Ballala III", "Narasimha I"], answer: "Vishnuvardhana" },
    { question: "Which Gupta emperor is known for the Nalanda University’s expansion?", options: ["Chandragupta I", "Samudragupta", "Chandragupta II", "Skandagupta"], answer: "Chandragupta II" },
    { question: "What was the capital of the Maratha Empire under Peshwa rule?", options: ["Pune", "Nagpur", "Satara", "Kolhapur"], answer: "Pune" },
    { question: "Which Delhi Sultanate ruler built the Alai Darwaza?", options: ["Qutb-ud-din Aibak", "Alauddin Khalji", "Muhammad bin Tughlaq", "Firoz Shah Tughlaq"], answer: "Alauddin Khalji" },
    { question: "Who was the first Mughal emperor to conquer Gujarat?", options: ["Babur", "Humayun", "Akbar", "Jahangir"], answer: "Akbar" },
    { question: "Which Chola king led the successful naval expedition to Southeast Asia?", options: ["Rajaraja Chola I", "Rajendra Chola I", "Kulothunga Chola I", "Vikrama Chola"], answer: "Rajendra Chola I" },
    { question: "What was the original name of Maharaja Ranjit Singh before he became a ruler?", options: ["Hari Singh", "Budh Singh", "Sher Singh", "Duleep Singh"], answer: "Budh Singh" },
    { question: "Which Vijayanagara king defeated the Bahmani Sultanate at the Battle of Talikota?", options: ["Harihara II", "Deva Raya II", "Krishnadevaraya", "Rama Raya"], answer: "Rama Raya" },
    { question: "Which British Act of 1858 transferred power from the East India Company to the Crown?", options: ["Government of India Act", "Regulating Act", "Pitt’s India Act", "Charter Act"], answer: "Government of India Act" },
    { question: "Which Hoysala temple is famous for its detailed soapstone carvings?", options: ["Chennakesava Temple", "Hoysaleswara Temple", "Lakshmi Narasimha Temple", "Keshava Temple"], answer: "Hoysaleswara Temple" },
    { question: "Which Bahmani Sultan built the Gol Gumbaz in Bijapur?", options: ["Ala-ud-Din Bahman Shah", "Muhammad Shah I", "Muhammad Adil Shah", "Ahmad Shah Bahmani"], answer: "Muhammad Adil Shah" }
];

let currentQuizQuestions = []; // Array to store the current set of 10 questions
let currentQuizQuestion = 0;
let score = 0;
let timer; // Variable to store the timer
let timeLeft = 15; // Time limit per question

// Load completed questions from localStorage or initialize an empty set
let completedQuestions = new Set(JSON.parse(localStorage.getItem('completedQuestions')) || []);

function openQuizModal() {
    const modal = document.getElementById("quizModal");
    if (modal) {
        modal.style.display = "block";
        initializeQuiz();
    }
}

function initializeQuiz() {
    // Filter out completed questions
    const availableQuestions = quizQuestionPool.filter(q => !completedQuestions.has(JSON.stringify(q)));

    if (availableQuestions.length < 10) {
        // If fewer than 10 questions remain, reset completed questions
        completedQuestions.clear();
        localStorage.setItem('completedQuestions', JSON.stringify(Array.from(completedQuestions)));
        currentQuizQuestions = quizQuestionPool.sort(() => 0.5 - Math.random()).slice(0, 10);
    } else {
        // Randomly select 10 questions from available ones
        currentQuizQuestions = availableQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
    }

    currentQuizQuestion = 0;
    score = 0;
    loadQuizQuestion();
}

function loadQuizQuestion() {
    const quizContent = document.getElementById("quiz-content");
    if (quizContent && currentQuizQuestion < currentQuizQuestions.length) {
        const question = currentQuizQuestions[currentQuizQuestion];
        timeLeft = 15; // Reset the timer for each question
        quizContent.innerHTML = `
            <p>${currentQuizQuestion + 1}. ${question.question}</p>
            ${question.options.map((option, index) => `
                <button onclick="checkAnswer('${option}', ${index})">${option}</button>
            `).join('<br>')}
            <p>Score: ${score}/${currentQuizQuestion}</p>
            <p id="timer">Time Left: ${timeLeft}s</p>
        `;
        startTimer(); // Start the timer
    } else if (currentQuizQuestion >= currentQuizQuestions.length) {
        clearInterval(timer); // Clear the timer when the quiz ends
        if (score === currentQuizQuestions.length) {
            // If all questions were answered correctly, mark them as completed
            currentQuizQuestions.forEach(q => completedQuestions.add(JSON.stringify(q)));
            localStorage.setItem('completedQuestions', JSON.stringify(Array.from(completedQuestions)));
        }
        quizContent.innerHTML = `<p>Quiz completed! Your score: ${score}/${currentQuizQuestions.length}</p><button onclick="resetQuiz()">Restart</button>`;
    }
}

function startTimer() {
    clearInterval(timer); // Clear any existing timer
    timer = setInterval(() => {
        timeLeft--;
        const timerElement = document.getElementById("timer");
        if (timerElement) {
            timerElement.textContent = `Time Left: ${timeLeft}s`;
        }
        if (timeLeft <= 0) {
            clearInterval(timer);
            currentQuizQuestion++; // Move to the next question
            loadQuizQuestion();
        }
    }, 1000); // Update every second
}

function checkAnswer(selected, index) {
    const question = currentQuizQuestions[currentQuizQuestion];
    if (selected === question.answer) {
        score++;
        document.querySelectorAll('#quiz-content button')[index].style.background = '#00FF00';
    } else {
        document.querySelectorAll('#quiz-content button')[index].style.background = '#FF0000';
    }
    setTimeout(() => {
        currentQuizQuestion++;
        loadQuizQuestion();
    }, 500);
}

function resetQuiz() {
    currentQuizQuestion = 0;
    score = 0;
    clearInterval(timer); // Clear the timer when resetting the quiz
    initializeQuiz(); // Reinitialize with new random questions
}

function closeQuizModal() {
    const modal = document.getElementById("quizModal");
    if (modal) {
        modal.style.display = "none";
        resetQuiz();
    }
}

// Add smooth scrolling for navbar and footer links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-links a, .footer-column ul li a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});