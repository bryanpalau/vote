const customCursor = document.getElementById("custom-cursor");

// Update cursor position on mousemove
document.addEventListener("mousemove", (e) => {
  customCursor.style.left = `${e.pageX}px`;
  customCursor.style.top = `${e.pageY}px`;
});

// Optional: Add a fade-out effect when the mouse stops moving
let cursorTimeout;
document.addEventListener("mousemove", () => {
  clearTimeout(cursorTimeout);
  customCursor.style.opacity = "1"; // Reset visibility
  cursorTimeout = setTimeout(() => {
    customCursor.style.opacity = "0"; // Fade out when idle
  }, 1000); // Adjust the timeout duration as needed
});

// Modal functionality
const modal = document.getElementById("image-modal");
const modalImage = document.getElementById("modal-image");
const closeModal = document.querySelector(".close");

// Add event listeners to enlarge icons
document.querySelectorAll(".enlarge-icon").forEach((icon) => {
  icon.addEventListener("click", (e) => {
    e.stopPropagation(); // Stop the click from propagating to the parent
    const imgSrc = e.target.previousElementSibling.src; // Get the source of the corresponding image
    modalImage.src = imgSrc; // Set the modal image source
    modal.style.display = "flex"; // Show the modal
  });
});

// Add event listeners to "View Design" icons
document.querySelectorAll(".view-design-icon").forEach((icon) => {
  icon.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default link behavior
    e.stopPropagation(); // Stop the click from propagating to the parent

    const designLink = e.target.dataset.link; // Get the Canva link from the data attribute
    if (designLink) {
      window.open(designLink, "_blank", "noopener,noreferrer"); // Open the Canva link in a new tab
    } else {
      console.error("No design link found for this icon.");
    }
  });
});

// Close the modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close modal when clicking outside the image
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

const voteSound = new Audio("assets/coin-sound.mp3"); // Preload vote sound
const hoverSound = new Audio("assets/hover-sound.mp3"); // Preload hover sound
const voteCounts = JSON.parse(localStorage.getItem("voteCounts")) || {}; // Initialize vote counts

// Initialize votes and UI
document.querySelectorAll(".student-work").forEach((work) => {
  const id = work.dataset.id;
  voteCounts[id] = voteCounts[id] || 0; // Initialize cumulative votes

  // Update the UI with cumulative votes
  document.getElementById(`vote-count-${id}`).textContent = voteCounts[id];

  // Add click event listener to toggle vote
  work.addEventListener("click", () => {
    handleVote(work);
  });

  // Add hover event listeners for visual feedback and sound
  work.addEventListener("mouseenter", () => {
    work.classList.add("selected");
    playHoverSound(); // Play hover sound
  });

  work.addEventListener("mouseleave", () => {
    work.classList.remove("selected");
  });
});

// Handle the vote process
function handleVote(selectedWork) {
    const id = selectedWork.dataset.id;
  
    // Increment the cumulative vote count
    voteCounts[id] += 1;
    localStorage.setItem("voteCounts", JSON.stringify(voteCounts)); // Persist the votes
  
    // Update the UI with the new vote count
    document.getElementById(`vote-count-${id}`).textContent = voteCounts[id];
  
    // Play the vote sound and animation
    playVoteSound();
    showVoteAnimation(selectedWork);
  
    // Add a delay to allow users to notice the updated vote count
    setTimeout(() => {
      shuffleStudentWorks(); // Shuffle the student works after the delay
    }, 1000); // 1-second delay before shuffling
  }
  

// Play the vote sound
function playVoteSound() {
  voteSound.currentTime = 0; // Reset playback to start
  voteSound.play().catch((error) => {
    console.error("Error playing sound:", error);
  });
}

// Play the hover sound
function playHoverSound() {
  hoverSound.currentTime = 0; // Reset playback to start
  hoverSound.play().catch((error) => {
    console.error("Error playing hover sound:", error);
  });
}

// Show vote animation on the selected image
function showVoteAnimation(selectedWork) {
  selectedWork.classList.add("highlight-voted"); // Apply highlight animation
  setTimeout(() => {
    selectedWork.classList.remove("highlight-voted");
  }, 1000); // Remove the animation class after 1 second
}

// Shuffle the student works
function shuffleStudentWorks() {
  const container = document.getElementById("student-works");
  const works = Array.from(container.children);

  // Shuffle the works array
  const shuffledWorks = works.sort(() => Math.random() - 0.5);

  // Reinsert shuffled works into the container
  shuffledWorks.forEach((work) => container.appendChild(work));
}
