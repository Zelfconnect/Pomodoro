let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isPaused = false;
let completedPomodoros = 0;
let currentTask = '';
let taskHistory = [];

const focusTips = [
    "Taking short breaks every 90 minutes can help maintain focus",
    "Morning sunlight exposure can improve evening focus",
    "Regular exercise has been shown to enhance attention span",
    "Proper hydration is essential for maintaining concentration",
    "Deep breathing exercises can help reset focus",
    "A consistent sleep schedule improves daytime alertness",
    "Room temperature around 70°F (21°C) is optimal for focus",
    "Brief meditation sessions can improve concentration",
    "Natural daylight can enhance cognitive performance",
    "Regular breaks reduce mental fatigue",
    "Standing or walking can boost alertness",
    "Background nature sounds can aid concentration",
    "Proper posture influences attention span",
    "Regular meal times help maintain focus",
    "Brief exposure to cold can increase alertness",
    "Reducing screen glare helps prevent mental fatigue",
    "Task batching can improve productivity",
    "Clear workspace = clear mindspace",
    "Adequate protein intake supports sustained focus",
    "Regular eye breaks prevent mental strain"
];

const focusFacts = [
    "Your brain works best in 90-minute deep work sessions, followed by short breaks.",
    "Work for 25-50 minutes, then take a 5-minute break. Repeat this for 3-4 cycles before a longer break.",
    "Turn off notifications, use Do Not Disturb mode, and keep your phone out of sight while working.",
    "Avoid excessive social media scrolling before deep work, as it can reduce your ability to stay focused.",
    "Low to moderate doses of caffeine (50-200mg) can enhance focus, but avoid overuse to prevent tolerance buildup.",
    "Daily 10-minute meditation can increase concentration by strengthening the prefrontal cortex.",
    "Your brain naturally shifts between high-focus and low-focus states every 90 minutes. Take a 5-15 minute break after intense focus.",
    "White noise, binaural beats (40Hz), or instrumental music can help maintain focus, but lyrics can be distracting.",
    "Your brain is not wired for multitasking—it takes up to 23 minutes to refocus after switching tasks.",
    "When a distracting thought arises, write it down on a separate list and return to it later.",
    "Dopamine, the motivation neurotransmitter, is essential for sustained attention and effort.",
    "Losing just 1-2 hours of sleep reduces focus and problem-solving ability by 30% or more.",
    "30 minutes of aerobic exercise (walking, running, cycling) improves focus for hours afterward.",
    "Found in fish, walnuts, and flaxseeds, omega-3s enhance brain function and reduce distractions.",
    "Brief exposure to cold water increases norepinephrine, improving focus and mental energy.",
    "Even 2% dehydration can significantly reduce concentration and cognitive performance.",
    "Natural light exposure in the morning regulates circadian rhythms and boosts dopamine.",
    "Studies show that chewing gum increases blood flow to the brain and improves focus.",
    "Eating a balanced meal with protein and healthy fats prevents energy crashes that kill focus.",
    "Taking notes by hand, rather than typing, improves memory and comprehension."
];

let currentFactIndex = 0;

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const timer = document.getElementById('timer');
    
    if (timer) {
        timer.textContent = display;
        document.title = `${display} - Pomodoro Timer`;
        
        // Update progress bar
        const progressBar = document.getElementById('progress-bar');
        const totalTime = parseInt(document.getElementById('timerType').value) * 60;
        const progress = ((totalTime - timeLeft) / totalTime) * 100;
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }
}

function validateCustomTime(minutes) {
    return !isNaN(minutes) && minutes > 0 && minutes <= 60;
}

function setTimerDuration() {
    const timerType = document.getElementById('timerType');
    const selectedValue = timerType.value;
    
    if (selectedValue === 'custom') {
        const customMinutes = parseInt(document.getElementById('customMinutes').value);
        if (validateCustomTime(customMinutes)) {
            timeLeft = customMinutes * 60;
        } else {
            document.getElementById('timer').textContent = 'Invalid Time';
            timeLeft = 25 * 60; // Reset to default
            document.getElementById('customMinutes').value = '25';
        }
    } else {
        timeLeft = parseInt(selectedValue) * 60;
    }
    updateDisplay();
}

// Add sound functionality
const tickSound = new Audio('tick.mp3');
const completeSound = new Audio('complete.mp3');
let soundEnabled = false;

function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundButton = document.getElementById('soundToggle');
    soundButton.textContent = soundEnabled ? '🔊' : '🔇';
}

function startTimer() {
    // If timer is paused, resume it
    if (isPaused) {
        isPaused = false;
        const pauseButton = document.querySelector('button[onclick="pauseTimer"]');
        if (pauseButton) {
            pauseButton.textContent = 'Pause';
            pauseButton.classList.remove('active');
        }
        
        // Restart the interval if it was cleared
        if (timerId === null) {
            timerId = setInterval(() => {
                if (!isPaused && timeLeft > 0) {
                    timeLeft--;
                    updateDisplay();
                    
                    if (soundEnabled && timeLeft > 0) {
                        tickSound.play().catch(() => {});
                    }
                    
                    if (timeLeft === 0) {
                        clearInterval(timerId);
                        timerId = null;
                        completePomodoro();
                        if (soundEnabled) {
                            completeSound.play().catch(() => {});
                        }
                        
                        const timer = document.getElementById('timer');
                        timer.classList.add('shake');
                        setTimeout(() => timer.classList.remove('shake'), 500);
                        
                        alert('Pomodoro session completed!');
                    }
                }
            }, 1000);
        }
        return;
    }

    // Only create new timer if one isn't already running
    if (timerId === null) {
        if (timeLeft <= 0 || isNaN(timeLeft)) {
            document.getElementById('timer').textContent = 'Invalid Time';
            return;
        }
        
        isPaused = false;
        const pauseButton = document.querySelector('button[onclick="pauseTimer"]');
        if (pauseButton) {
            pauseButton.textContent = 'Pause';
            pauseButton.classList.remove('active');
        }
        
        timerId = setInterval(() => {
            if (!isPaused && timeLeft > 0) {
                timeLeft--;
                updateDisplay();
                
                if (soundEnabled && timeLeft > 0) {
                    tickSound.play().catch(() => {});
                }
                
                if (timeLeft === 0) {
                    clearInterval(timerId);
                    timerId = null;
                    completePomodoro();
                    if (soundEnabled) {
                        completeSound.play().catch(() => {});
                    }
                    
                    const timer = document.getElementById('timer');
                    timer.classList.add('shake');
                    setTimeout(() => timer.classList.remove('shake'), 500);
                    
                    alert('Pomodoro session completed!');
                }
            }
        }, 1000);
    }
}

function pauseTimer() {
    isPaused = !isPaused;
    const pauseButton = document.querySelector('button[onclick="pauseTimer"]');
    if (pauseButton) {
        pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
        pauseButton.classList.toggle('active', isPaused);
    }
    
    // Clear the interval when pausing
    if (isPaused && timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isPaused = false;
    const pauseButton = document.querySelector('button[onclick="pauseTimer"]');
    if (pauseButton) {
        pauseButton.textContent = 'Pause';
        pauseButton.classList.remove('active');
    }
    setTimerDuration();
}

function completePomodoro() {
    completedPomodoros++;
    // Calculate actual minutes from the timer type selected
    const timerType = document.getElementById('timerType');
    const focusMinutes = parseInt(timerType.value);
    const totalTime = completedPomodoros * focusMinutes; // Changed from fixed 25 to actual timer duration
    
    document.getElementById('completedCount').textContent = completedPomodoros;
    document.getElementById('totalTime').textContent = totalTime;
    
    if (currentTask) {
        taskHistory.push({
            task: currentTask,
            completedAt: new Date(),
            duration: focusMinutes // Changed from fixed 25 to actual timer duration
        });
    }
}

// Add event listeners
document.getElementById('timerType').addEventListener('change', function(e) {
    const selectedValue = e.target.value;
    const customTimeDiv = document.querySelector('.custom-time');
    
    if (selectedValue === 'custom') {
        customTimeDiv.style.display = 'block';
    } else {
        customTimeDiv.style.display = 'none';
        timeLeft = parseInt(selectedValue) * 60;
        updateDisplay();
    }
});

document.getElementById('customMinutes').addEventListener('change', function(e) {
    const minutes = parseInt(e.target.value);
    if (validateCustomTime(minutes)) {
        timeLeft = minutes * 60;
        updateDisplay();
    } else {
        e.target.value = '25'; // Reset to default
        document.getElementById('timer').textContent = 'Invalid Time';
        setTimeout(() => {
            timeLeft = 25 * 60;
            updateDisplay();
        }, 1500);
    }
});

document.getElementById('taskInput').addEventListener('input', function(e) {
    currentTask = e.target.value;
});

// Initialize display
updateDisplay();

function displayPreviousFact() {
    const factText = document.getElementById('factText');
    factText.classList.remove('fade-in');
    factText.style.opacity = '0';
    
    setTimeout(() => {
        currentFactIndex = (currentFactIndex - 1 + focusFacts.length) % focusFacts.length;
        factText.textContent = focusFacts[currentFactIndex];
        factText.classList.add('fade-in');
    }, 300);
}

function displayNextFact() {
    const factText = document.getElementById('factText');
    factText.classList.remove('fade-in');
    factText.style.opacity = '0';
    
    setTimeout(() => {
        currentFactIndex = (currentFactIndex + 1) % focusFacts.length;
        factText.textContent = focusFacts[currentFactIndex];
        factText.classList.add('fade-in');
    }, 300);
}

// Dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const darkModeButton = document.getElementById('darkModeToggle');
    
    if (document.body.classList.contains('dark-mode')) {
        darkModeButton.textContent = '☀️';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        darkModeButton.textContent = '🌙';
        localStorage.setItem('darkMode', 'disabled');
    }
}

// Check for saved dark mode preference
window.addEventListener('load', () => {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').textContent = '☀️';
    }
});

// Add event listener to dark mode toggle button
document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);

// When the page loads
window.addEventListener('load', () => {
    const factText = document.getElementById('factText');
    factText.textContent = focusFacts[0];
    factText.classList.add('fade-in');
    
    // Initialize progress bar
    updateDisplay();
    
    // Add event listeners for new buttons
    document.getElementById('soundToggle')?.addEventListener('click', toggleSound);
    document.getElementById('darkModeToggle')?.addEventListener('click', toggleDarkMode);
});

// Add this to your existing JavaScript
document.getElementById('settingsToggle')?.addEventListener('click', function() {
    const dropdown = document.querySelector('.settings-dropdown');
    dropdown?.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('#settingsToggle') && !e.target.closest('.settings-dropdown')) {
        document.querySelector('.settings-dropdown')?.classList.remove('active');
    }
});

function addFiveMinutes() {
    timeLeft += 5 * 60; // Add 5 minutes in seconds
    updateDisplay();
} 