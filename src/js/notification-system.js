// ========================================
// NOTIFICATION SYSTEM
// Handles daily reminders for intention setting
// ========================================

let notificationPermission = 'default';
let scheduledTime = null;

// Request notification permission
async function requestNotificationPermission() {
    if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        notificationPermission = permission;
        return permission === 'granted';
    }
    return false;
}

// Show browser notification
function showNotification(title, body) {
    if (notificationPermission === 'granted') {
        new Notification(title, {
            body: body,
            icon: '/radish-icon.png',
            badge: '/radish-badge.png',
            requireInteraction: false,
            silent: false
        });
    }
}

// Set reminder
export async function setReminder(time) {
    const hasPermission = await requestNotificationPermission();

    if (!hasPermission) {
        updateReminderStatus('Please enable notifications to use reminders.');
        return false;
    }

    scheduledTime = time;
    localStorage.setItem('radish_reminder_time', time);

    updateReminderStatus(`Reminder set for ${formatTime(time)} daily.`);

    // Schedule check
    scheduleReminderCheck();

    return true;
}

// Format time for display
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Update reminder status text
function updateReminderStatus(message) {
    const statusEl = document.getElementById('reminder-status');
    if (statusEl) {
        statusEl.textContent = message;
    }
}

// Check if it's time for reminder
function checkReminderTime() {
    if (!scheduledTime) return;

    const now = new Date();
    const [hours, minutes] = scheduledTime.split(':');
    const scheduledHour = parseInt(hours);
    const scheduledMinute = parseInt(minutes);

    // Check if current time matches (with 1-minute tolerance)
    if (now.getHours() === scheduledHour && now.getMinutes() === scheduledMinute) {
        const lastShown = localStorage.getItem('radish_last_notification');
        const today = new Date().toDateString();

        // Only show once per day
        if (lastShown !== today) {
            showNotification(
                'Radish: Time for Reflection',
                'Take a moment to set your mindful intentions for today.'
            );
            localStorage.setItem('radish_last_notification', today);
        }
    }
}

// Schedule periodic reminder checks
function scheduleReminderCheck() {
    // Check every minute
    setInterval(checkReminderTime, 60000);

    // Check immediately
    checkReminderTime();
}

// Load saved reminder
function loadSavedReminder() {
    const saved = localStorage.getItem('radish_reminder_time');
    if (saved) {
        scheduledTime = saved;
        const timeInput = document.getElementById('notification-time');
        if (timeInput) {
            timeInput.value = saved;
        }
        updateReminderStatus(`Reminder set for ${formatTime(saved)} daily.`);
        scheduleReminderCheck();
    }
}

// Initialize notification system
export function initNotificationSystem() {
    // Load saved reminder
    loadSavedReminder();

    // Set up reminder button
    const setReminderBtn = document.getElementById('set-reminder-btn');
    const timeInput = document.getElementById('notification-time');

    if (setReminderBtn && timeInput) {
        setReminderBtn.addEventListener('click', async () => {
            const time = timeInput.value;
            if (time) {
                const success = await setReminder(time);

                // Visual feedback
                if (success) {
                    setReminderBtn.textContent = '✓ Reminder Set';
                    setTimeout(() => {
                        setReminderBtn.textContent = 'Set Reminder';
                    }, 2000);
                }
            }
        });
    }
}
