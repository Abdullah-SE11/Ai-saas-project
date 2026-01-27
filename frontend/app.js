// App Logic
const form = document.getElementById('lesson-form');
const generateBtn = document.getElementById('generate-btn');
const resultsSection = document.getElementById('results-section');
const planDisplay = document.getElementById('plan-display');
const sheetDisplay = document.getElementById('worksheet-display');

// Tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Add active
        btn.classList.add('active');
        const target = document.getElementById(btn.dataset.tab);
        target.classList.add('active');
    });
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // UI State -> Loading
    generateBtn.classList.add('loading');
    generateBtn.disabled = true;
    resultsSection.classList.add('hidden');

    // Config
    const apiKey = document.getElementById('apiKey').value;
    const grade = document.getElementById('grade').value;
    const topic = document.getElementById('topic').value;

    try {
        const response = await fetch('/generate-lesson', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({ grade, topic })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || 'Failed to generate lesson');
        }

        const data = await response.json();
        renderResults(data);

    } catch (error) {
        alert("Error: " + error.message);
    } finally {
        generateBtn.classList.remove('loading');
        generateBtn.disabled = false;
    }
});

function renderResults(data) {
    const { lesson_plan, worksheet } = data;

    // Render Plan
    planDisplay.innerHTML = `
        <div class="plan-section">
            <h3>🎯 Learning Objectives</h3>
            <ul>${lesson_plan.objectives.map(o => `<li>${o}</li>`).join('')}</ul>
        </div>
        
        <div class="plan-section">
            <h3>📚 Materials Needed</h3>
            <ul>${lesson_plan.materials.map(m => `<li>${m}</li>`).join('')}</ul>
        </div>
        
        <div class="plan-section">
            <h3>⏱️ Activities</h3>
            <ol style="margin-left:20px; color:#e2e8f0;">
                ${lesson_plan.activities.map(a => `<li style="margin-bottom:8px;">${a}</li>`).join('')}
            </ol>
        </div>
        
        <div class="plan-section">
            <h3>📝 Assessment</h3>
            <p style="color:#cbd5e1;">${lesson_plan.assessment}</p>
        </div>
    `;

    // Render Worksheet
    sheetDisplay.innerHTML = `
        <div class="sheet-header">
            <h2>${document.getElementById('topic').value} Worksheet</h2>
            <div style="display:flex; justify-content:space-between; margin-top:20px;">
                <span>Name: _______________________</span>
                <span>Date: ____________</span>
            </div>
        </div>
        
        <div style="margin-bottom:30px; font-style:italic;">
            <strong>Instructions:</strong> ${worksheet.instructions}
        </div>
        
        ${worksheet.questions.map((q, i) => `
            <div class="sheet-question">
                <span class="question-num">${i + 1}.</span>
                <span>${q}</span>
                <div style="margin-top:40px; border-bottom:1px solid #ddd; width:100%;"></div>
            </div>
        `).join('')}
        
        <div style="margin-top:50px; border-top: 2px dashed #999; padding-top:20px; font-size:0.9em; color:#666;">
            <strong>Answer Key (Teacher Only):</strong><br>
            ${worksheet.answer_key.map((a, i) => `${i + 1}) ${a}`).join('; ')}
        </div>
    `;

    resultsSection.classList.remove('hidden');
}
