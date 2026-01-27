// DOM Elements
const form = document.getElementById('lesson-form');
const generateBtn = document.getElementById('generate-btn');
const loader = generateBtn.querySelector('.loader');
const btnText = generateBtn.querySelector('.btn-text');
const resultsSection = document.getElementById('results-section');
const teacherPlan = document.getElementById('teacher-plan');
const worksheetContent = document.getElementById('worksheet-content');
const apiKeyInput = document.getElementById('apiKey');

// Tab Logic
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Load API Key from LocalStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedKey = localStorage.getItem('lesson_ai_key');
    if (savedKey) {
        apiKeyInput.value = savedKey;
    }
});

// Save API Key on input
apiKeyInput.addEventListener('input', (e) => {
    localStorage.setItem('lesson_ai_key', e.target.value);
});

// Handle Tab Switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const target = document.getElementById(btn.dataset.tab);
        target.classList.add('active');
    });
});

// Form Submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
        alert("Please enter your API Key (Bearer Token) in the top settings bar.");
        apiKeyInput.focus();
        return;
    }

    const grade = document.getElementById('grade').value;
    const topic = document.getElementById('topic').value;

    // UI Loading State
    setLoading(true);
    resultsSection.classList.add('hidden');

    try {
        const response = await fetch('http://localhost:8000/generate-lesson', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({ grade, topic })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to generate lesson.');
        }

        const data = await response.json();
        renderResults(data);
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
        alert(`Error: ${err.message}`);
    } finally {
        setLoading(false);
    }
});

const loadingMessages = [
    "Drafting educational objectives...",
    "Building student worksheet...",
    "Adapting to grade level...",
    "Finalizing lesson activities...",
    "Formatting for print..."
];

let loadingInterval;

function setLoading(isLoading) {
    if (isLoading) {
        generateBtn.disabled = true;
        loader.classList.remove('hidden');

        let i = 0;
        btnText.textContent = loadingMessages[0];
        loadingInterval = setInterval(() => {
            i = (i + 1) % loadingMessages.length;
            btnText.textContent = loadingMessages[i];
        }, 2000);
    } else {
        generateBtn.disabled = false;
        loader.classList.add('hidden');
        btnText.textContent = 'Generate Lesson';
        clearInterval(loadingInterval);
    }
}

function renderResults(data) {
    const { lesson_plan, worksheet } = data;
    const topic = document.getElementById('topic').value;

    // 1. Render Teacher Plan
    teacherPlan.innerHTML = `
        <div class="plan-section">
            <h3>🎯 Learning Objectives</h3>
            <ul>${lesson_plan.objectives.map(o => `<li>${o}</li>`).join('')}</ul>
        </div>
        
        <div class="plan-section">
            <h3>📚 Materials Needed</h3>
            <ul>${lesson_plan.materials.map(m => `<li>${m}</li>`).join('')}</ul>
        </div>
        
        <div class="plan-section">
            <h3>⏱️ Activity Timeline</h3>
            <ol>${lesson_plan.activities.map(a => `<li>${a}</li>`).join('')}</ol>
        </div>
        
        <div class="plan-section">
            <h3>📝 Assessment Strategy</h3>
            <p>${lesson_plan.assessment}</p>
        </div>
    `;

    // 2. Render Student Worksheet
    worksheetContent.innerHTML = `
        <div class="sheet-header">
            <h2>${topic}</h2>
            <div class="sheet-meta">
                <span>Name: _______________________</span>
                <span>Date: ____________</span>
            </div>
        </div>
        
        <div style="margin-bottom: 40px;">
            <p><strong>Instructions:</strong> ${worksheet.instructions}</p>
        </div>
        
        <div class="questions-list">
            ${worksheet.questions.map((q, i) => `
                <div class="sheet-question">
                    <p><span class="question-num">${i + 1}.</span> ${q}</p>
                    <div class="answer-line"></div>
                    <div class="answer-line"></div>
                </div>
            `).join('')}
        </div>
        
        <div class="teacher-notes">
            <p><strong>Answer Key (Teacher Use Only):</strong></p>
            <p style="font-style: italic;">${worksheet.answer_key.map((a, i) => `${i + 1}. ${a}`).join(' | ')}</p>
        </div>
    `;
}

// Print Handler
document.getElementById('print-btn').addEventListener('click', () => {
    window.print();
});
