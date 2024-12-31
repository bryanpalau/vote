const customCursor = document.getElementById('custom-cursor');

// Update cursor position on mousemove
document.addEventListener('mousemove', (e) => {
    customCursor.style.left = `${e.pageX}px`;
    customCursor.style.top = `${e.pageY}px`;
});

// Optional: Add a fade-out effect when the mouse stops moving
let cursorTimeout;
document.addEventListener('mousemove', () => {
    clearTimeout(cursorTimeout);
    customCursor.style.opacity = '1'; // Reset visibility
    cursorTimeout = setTimeout(() => {
        customCursor.style.opacity = '0'; // Fade out when idle
    }, 1000); // Adjust the timeout duration as needed
});

// Modal functionality
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const closeModal = document.querySelector('.close');

// Add event listeners to enlarge icons
document.querySelectorAll('.enlarge-icon').forEach((icon) => {
    icon.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop the click from propagating to the parent
        const imgSrc = e.target.previousElementSibling.src; // Get the source of the corresponding image
        modalImage.src = imgSrc; // Set the modal image source
        modal.style.display = 'flex'; // Show the modal
    });
});

// Close the modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal when clicking outside the image
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

const voteSound = new Audio('assets/coin-sound.mp3'); // Preload vote sound
const voteCompleteSound = document.getElementById('vote-complete-sound'); // "Voting Complete" sound
let isVotingCompleted = false; // State to track voting completion

// Initialize or retrieve cumulative vote counts from localStorage
const voteCounts = JSON.parse(localStorage.getItem('voteCounts')) || {};
const currentSessionVotes = {}; // Track votes for the current session

// Initialize votes and UI
document.querySelectorAll('.student-work').forEach((work) => {
    const id = work.dataset.id;
    voteCounts[id] = voteCounts[id] || 0; // Initialize cumulative votes
    currentSessionVotes[id] = 0; // Initialize session votes

    // Update the UI with session votes (start with 0)
    document.getElementById(`vote-count-${id}`).textContent = currentSessionVotes[id];

    // Add click event listener to toggle vote
    work.addEventListener('click', () => {
        handleVoteToggle(work);
    });

    // Add hover event listeners for visual feedback
    work.addEventListener('mouseenter', () => {
        work.classList.add('selected');
    });

    work.addEventListener('mouseleave', () => {
        work.classList.remove('selected');
    });
});

// Handle the vote toggle process
function handleVoteToggle(selectedWork) {
    if (isVotingCompleted) return; // Prevent voting after submission

    const id = selectedWork.dataset.id;

    if (selectedWork.classList.contains('voted')) {
        // Revoke vote
        currentSessionVotes[id] = 0; // Reset session vote
        document.getElementById(`vote-count-${id}`).textContent = currentSessionVotes[id];
        selectedWork.classList.remove('voted');
    } else {
        // Cast vote
        currentSessionVotes[id] = 1; // One vote per image in the session
        document.getElementById(`vote-count-${id}`).textContent = currentSessionVotes[id];
        playVoteSound();
        showVoteAnimation();
        selectedWork.classList.add('voted');
    }

    // Enable the submit button if there's at least one vote
    updateSubmitButtonState();
}

// Play the vote sound
function playVoteSound() {
    voteSound.currentTime = 0; // Reset playback to start
    voteSound.play().catch((error) => {
        console.error('Error playing sound:', error);
    });
}

// Show vote animation
function showVoteAnimation() {
    const voteText = document.createElement('div');
    voteText.innerText = '🥰 +1';
    voteText.classList.add('vote-animation');
    document.body.appendChild(voteText);

    setTimeout(() => {
        voteText.remove();
    }, 800); // Match animation duration
}

// Update the submit button state
function updateSubmitButtonState() {
    const hasVotes = Object.values(currentSessionVotes).some((count) => count > 0);
    document.getElementById('submit-vote').disabled = !hasVotes;
}

// Submit votes
document.getElementById('submit-vote').addEventListener('click', () => {
    if (isVotingCompleted) return; // Prevent multiple submissions

    isVotingCompleted = true;
    document.getElementById('submit-vote').disabled = true;

    // Add session votes to cumulative votes
    Object.keys(currentSessionVotes).forEach((id) => {
        voteCounts[id] += currentSessionVotes[id];
    });

    // Persist cumulative votes to localStorage
    localStorage.setItem('voteCounts', JSON.stringify(voteCounts));

    // Play "Voting Complete" sound and show transition
    playVoteCompleteSound();
    const transitionOverlay = document.createElement('div');
    transitionOverlay.id = 'transition-overlay';
    transitionOverlay.innerText = 'Voting Complete!';
    document.body.appendChild(transitionOverlay);

    setTimeout(() => {
        transitionOverlay.remove(); // Remove the overlay
        updateDashboard(); // Show the dashboard
        document.getElementById('vote-again').style.display = 'block'; // Show "Vote Again"
    }, 2000); // Adjust transition duration
});

// Update the vote summary dashboard
function updateDashboard() {
    const dashboard = document.getElementById('vote-summary');
    dashboard.innerHTML = ''; // Clear previous summaries

    Object.keys(voteCounts).forEach((id) => {
        const li = document.createElement('li');
        li.textContent = `Work ${id}: ${voteCounts[id]} votes`;
        dashboard.appendChild(li);
    });

    // Show the dashboard
    document.getElementById('dashboard').style.display = 'block';
}

// Reset for a new round
document.getElementById('vote-again').addEventListener('click', () => {
    isVotingCompleted = false;
    document.getElementById('submit-vote').disabled = true;

    // Reset session votes and UI
    Object.keys(currentSessionVotes).forEach((id) => {
        currentSessionVotes[id] = 0;
        document.getElementById(`vote-count-${id}`).textContent = currentSessionVotes[id];
    });

    document.querySelectorAll('.student-work').forEach((work) => {
        work.classList.remove('voted');
    });

    // Hide the dashboard and "Vote Again" button
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('vote-again').style.display = 'none';
});

// Function to play the "Voting Complete" sound
function playVoteCompleteSound() {
    voteCompleteSound.currentTime = 0; // Reset playback to start
    voteCompleteSound.play().catch((error) => {
        console.error('Error playing sound:', error);
    });
}
