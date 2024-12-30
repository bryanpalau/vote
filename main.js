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



// Get the "Voting Complete" sound element
const voteCompleteSound = document.getElementById('vote-complete-sound');

// Submit votes
document.getElementById('submit-vote').addEventListener('click', () => {
  if (isVotingCompleted) return; // Prevent multiple submissions

  isVotingCompleted = true;
  document.getElementById('submit-vote').disabled = true;

  // Play the "Voting Complete" sound
  playVoteCompleteSound();

  // Add transition overlay for visual feedback
  const transitionOverlay = document.createElement('div');
  transitionOverlay.id = 'transition-overlay';
  transitionOverlay.innerText = 'Voting Complete!';
  document.body.appendChild(transitionOverlay);

  // Harmonize sound and visual transition timing
  const transitionDuration = 2000; // Adjust as needed
  setTimeout(() => {
    transitionOverlay.remove(); // Remove the overlay after the transition

    // Update the dashboard with current vote counts
    updateDashboard();

    // Show the "Vote Again" button
    document.getElementById('vote-again').style.display = 'block';
  }, transitionDuration);
});

// Function to play the "Voting Complete" sound
function playVoteCompleteSound() {
  voteCompleteSound.currentTime = 0; // Reset playback to start
  voteCompleteSound.play().catch((error) => {
    console.error('Error playing sound:', error);
  });
}







const voteSound = new Audio('assets/coin-sound.mp3'); // Preload vote sound
let isVotingCompleted = false; // State to track voting completion

// Initialize or retrieve vote counts from localStorage
const voteCounts = JSON.parse(localStorage.getItem('voteCounts')) || {};
document.querySelectorAll('.student-work').forEach((work) => {
  const id = work.dataset.id;
  if (!(id in voteCounts)) {
    voteCounts[id] = 0; // Initialize vote count for new works
  }

  // Update the UI with stored votes
  document.getElementById(`vote-count-${id}`).textContent = voteCounts[id];

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
    voteCounts[id]--;
    document.getElementById(`vote-count-${id}`).textContent = voteCounts[id];
    selectedWork.classList.remove('voted');
  } else {
    // Cast vote
    voteCounts[id]++;
    document.getElementById(`vote-count-${id}`).textContent = voteCounts[id];

    // Play sound and show animation
    playVoteSound();
    showVoteAnimation();
    selectedWork.classList.add('voted');
  }

  // Persist votes to localStorage
  localStorage.setItem('voteCounts', JSON.stringify(voteCounts));

  // Enable the submit button if there's at least one vote
  updateSubmitButtonState();
}

// Play the vote sound
function playVoteSound() {
  voteSound.currentTime = 0; // Reset playback for subsequent votes
  voteSound.play().catch((error) => {
    console.error('Audio playback error:', error);
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
  const hasVotes = Object.values(voteCounts).some((count) => count > 0);
  document.getElementById('submit-vote').disabled = !hasVotes;
}

// Submit votes
document.getElementById('submit-vote').addEventListener('click', () => {
  if (isVotingCompleted) return; // Prevent multiple submissions

  isVotingCompleted = true;
  document.getElementById('submit-vote').disabled = true;

  // Update the dashboard with current vote counts
  updateDashboard();

  // Show the "Vote Again" button
  document.getElementById('vote-again').style.display = 'block';
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

// Reset the UI for a new round without clearing cumulative votes
document.getElementById('vote-again').addEventListener('click', () => {
  isVotingCompleted = false;
  document.getElementById('submit-vote').disabled = true;

  // Reset only the UI, not the vote counts
  document.querySelectorAll('.student-work').forEach((work) => {
    work.classList.remove('voted');
  });

  // Update the displayed votes in the UI to reflect cumulative counts
  Object.keys(voteCounts).forEach((id) => {
    document.getElementById(`vote-count-${id}`).textContent = voteCounts[id];
  });

  // Hide the dashboard and "Vote Again" button
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('vote-again').style.display = 'none';
});
