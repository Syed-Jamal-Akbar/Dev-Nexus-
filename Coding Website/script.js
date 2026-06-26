const btn = document.getElementById('theme-toggle');
btn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
});



// Main section cards  
function loadModule(module) {
    const contentArea = document.getElementById('content-area');
    
    if (module === 'skills') {
        contentArea.innerHTML = `
            <section class="glass-card">
                <h2>Skills Registry</h2>
                <input type="text" id="skillInput" placeholder="Add a skill...">
                <button onclick="addSkill()">Add</button>
                <ul id="skillList"></ul>
                <button onclick="location.reload()">Back to Home</button>
            </section>
        `;
    }
    // Baqi modules (vault, etc) yahan add honge
}










function runCode() {
    const code = document.getElementById('code-editor').value;
    if (code.trim() === "") {
        alert("Please write some code first!");
    } else {
        console.log("Executing:", code);
        alert("Code Sent to Server for Execution!");
        // Future: Yahan hum 'fetch' API use karke code Flask backend ko bhejenge
    }
}