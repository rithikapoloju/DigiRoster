document.addEventListener('DOMContentLoaded', function() {
    const markAttendanceBtn = document.getElementById('markAttendanceBtn');
    const rollNoInput = document.getElementById('rollNo');
    const rosterCodeInput = document.getElementById('rosterCode');
    const messageDisplay = document.getElementById('message');
    const countdownDisplay = document.getElementById('countdown');
    let timeLeft = 60;
    let timerInterval;

    function updateTimer() {
        countdownDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            markAttendanceBtn.disabled = true;
            messageDisplay.textContent = "Time expired. Attendance cannot be marked.";
            messageDisplay.className = "error";
        } else {
            timeLeft--;
        }
    }

    function startTimer() {
        timerInterval = setInterval(updateTimer, 1000);
    }

    startTimer(); // Start the timer when the page loads

    markAttendanceBtn.addEventListener('click', function() {
        const rollNo = rollNoInput.value.trim();
        const rosterCode = rosterCodeInput.value.trim();
        const validRosterCodes = ['1011', '0101'];
        const userEmail = localStorage.getItem('userEmail'); // Retrieve email from local storage

        if (timeLeft > 0 && rollNo !== '' && rosterCode !== '') {
            if (validRosterCodes.includes(rosterCode)) {
                messageDisplay.textContent = 'Attendance Marked Successfully!';
                messageDisplay.className = 'success';
                
                // Send data to Python backend
                fetch('/save_attendance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // Include email in the JSON payload
                    body: JSON.stringify({ rollNo: rollNo, rosterCode: rosterCode, email: userEmail }),
                })
                .then(response => response.text())
                .then(data => {
                    console.log('Server response:', data); // Log the response from the server
                    // You could display more specific messages based on server response here
                })
                .catch(error => {
                    console.error('Error sending data:', error);
                    messageDisplay.textContent = 'Failed to save attendance. Please try again.';
                    messageDisplay.className = 'error';
                });

                // Disable input fields and the mark attendance button permanently
                rollNoInput.disabled = true;
                rosterCodeInput.disabled = true;
                markAttendanceBtn.disabled = true;
                clearInterval(timerInterval); // Stop the timer after successful submission
                
            } else {
                messageDisplay.textContent = 'Invalid Roster Code.';
                messageDisplay.className = 'error';
            }
        } else if (timeLeft <= 0) {
            messageDisplay.textContent = "Time expired. Attendance cannot be marked.";
            messageDisplay.className = "error";
        } else {
            messageDisplay.textContent = 'Please enter Roll Number and Roster Code within the time limit.';
            messageDisplay.className = "error";
        }
    });

    
});



