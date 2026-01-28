// DOM Elements
const form = document.getElementById('lesson-form');
const generateBtn = document.getElementById('generate-btn');
const loader = generateBtn.querySelector('.loader');
const btnText = generateBtn.querySelector('.btn-text');
const resultsSection = document.getElementById('results-section');
const teacherPlan = document.getElementById('teacher-plan');
const worksheetContent = document.getElementById('worksheet-content');
const visionInput = document.getElementById('vision-input');
const dropArea = document.getElementById('drop-area');
const filePreview = document.getElementById('file-preview');
const previewImg = document.getElementById('preview-img');
const removeImgBtn = document.getElementById('remove-img');

let base64Image = null;

// Tab Logic
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// DOM Content Loaded (Simplified)
document.addEventListener('DOMContentLoaded', () => {
    console.log("LessonAI initialized for fully free access.");
});

// Handle Image Selection
visionInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
});

// Drag & Drop
['dragenter', 'dragover'].forEach(name => {
    dropArea.addEventListener(name, (e) => {
        e.preventDefault();
        dropArea.classList.add('dragover');
    });
});
['dragleave', 'drop'].forEach(name => {
    dropArea.addEventListener(name, (e) => {
        e.preventDefault();
        dropArea.classList.remove('dragover');
    });
});
dropArea.addEventListener('drop', (e) => {
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFile(file);
    }
});

function handleFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        base64Image = e.target.result;
        previewImg.src = base64Image;
        filePreview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

removeImgBtn.addEventListener('click', () => {
    base64Image = null;
    visionInput.value = '';
    filePreview.classList.add('hidden');
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

    const grade = document.getElementById('grade').value;
    const topic = document.getElementById('topic').value;

    // UI Loading State
    setLoading(true);
    resultsSection.classList.add('hidden');

    try {
        const payload = {
            grade,
            topic,
            image_data: base64Image
        };

        const response = await fetch('/generate-lesson', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 403) {
                alert("🌟 Daily limit reached for your free account! Please upgrade to Pro for unlimited planning.");
                // Optionally redirect to checkout here
            }
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
    if (!data || !data.lesson_plan || !data.worksheet) {
        console.error("Invalid data received:", data);
        alert("The AI returned an incomplete plan. Please try again.");
        return;
    }
    const { lesson_plan, worksheet } = data;
    const topic = document.getElementById('topic').value;
    const labContent = document.getElementById('lab-content');

    // 1. Render Teacher Plan
    teacherPlan.innerHTML = `
        <div class="plan-section">
            <h3>🎯 Learning Objectives</h3>
            <ul>${(lesson_plan.objectives || []).map(o => `<li>${o}</li>`).join('')}</ul>
        </div>
        
        <div class="plan-section">
            <h3>📚 Materials Needed</h3>
            <ul>${(lesson_plan.materials || []).map(m => `<li>${m}</li>`).join('')}</ul>
        </div>
        
        <div class="plan-section">
            <h3>⏱️ Activity Timeline</h3>
            <ol>${(lesson_plan.activities || []).map(a => `<li>${a}</li>`).join('')}</ol>
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
        
        <div class="sheet-section">
            <p><strong>Instructions:</strong> ${worksheet.instructions}</p>
        </div>
        
        <div class="sheet-section">
            <h4>Part 1: Multiple Choice</h4>
            ${(worksheet.mcqs || []).map((m, i) => `
                <div class="sheet-question">
                    <p><strong>${i + 1}. ${m.q}</strong></p>
                    <div class="options-grid">
                        ${(m.o || []).map(opt => `<span>( ) ${opt}</span>`).join('')}
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="sheet-section">
            <h4>Part 2: Fill in the Blanks</h4>
            ${(worksheet.fill_blanks || []).map((fb, i) => `
                <div class="sheet-question">
                    <p><strong>${i + 1}.</strong> ${fb.q}</p>
                </div>
            `).join('')}
        </div>

        <div class="sheet-section">
            <h4>Part 3: Short Questions</h4>
            ${(worksheet.short_questions || []).map((sq, i) => `
                <div class="sheet-question">
                    <p><strong>${i + 1}.</strong> ${sq.q}</p>
                    <div class="answer-line"></div>
                </div>
            `).join('')}
        </div>
    `;

    // 3. Render Question Lab (Answer Bank)
    labContent.innerHTML = `
        <div class="lab-header">
            <h3>🧪 Question Lab: Answer Key & Analysis</h3>
            <p>Use this section to review correct answers and teaching points.</p>
        </div>

        <div class="lab-grid">
            <div class="lab-card">
                <h4>Multiple Choice Answers</h4>
                <ul>${(worksheet.mcqs || []).map(m => `<li><strong>Q:</strong> ${m.q}<br><strong>A:</strong> ${m.a}<br><small><em>Why: ${m.explanation || 'Direct answer.'}</em></small></li>`).join('')}</ul>
            </div>
            <div class="lab-card">
                <h4>Fill in the Blanks Key</h4>
                <ul>${(worksheet.fill_blanks || []).map(fb => `<li><strong>Q:</strong> ${fb.q}<br><strong>Key:</strong> ${fb.a}<br><small><em>Context: ${fb.explanation || 'Key vocabulary.'}</em></small></li>`).join('')}</ul>
            </div>
            <div class="lab-card">
                <h4>Short Question Guide</h4>
                <ul>${(worksheet.short_questions || []).map(sq => `<li><strong>Q:</strong> ${sq.q}<br><strong>Guide:</strong> ${sq.a}<br><small><em>Teaching Point: ${sq.explanation || 'Core concept check.'}</em></small></li>`).join('')}</ul>
            </div>
        </div>
    `;
}

// Print Handler
document.getElementById('print-btn').addEventListener('click', () => {
    window.print();
});
