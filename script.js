document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector(".modal");
  const modalTitle = document.querySelector(".modal-head strong");
  const videoBox = document.querySelector(".video-box");

  // Reveal-on-scroll animation
  const revealItems = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealItems.forEach((item) => {
    revealObserver.observe(item);
  });

  // Open video modal
  document.querySelectorAll("[data-video]").forEach((item) => {
    item.addEventListener("click", () => {
      const title = item.dataset.title || "Video Preview";
      const video = item.dataset.video || "";

      if (modalTitle) {
        modalTitle.textContent = title;
      }

      if (videoBox) {
        if (video.trim()) {
          videoBox.innerHTML = `
            <iframe
              src="${video}"
              title="${title}"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen>
            </iframe>
          `;
        } else {
          videoBox.innerHTML = `
            <p>
              Add your YouTube, Vimeo or Google Drive preview link
              in the <strong>data-video</strong> attribute for this project.
            </p>
          `;
        }
      }

      if (modal) {
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
      }
    });
  });

  // Close modal
  const closeButton = document.querySelector(".close");

  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }

  // Close when clicking outside modal box
  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  // Close with Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  function closeModal() {
    if (!modal) return;

    modal.classList.remove("open");
    document.body.style.overflow = "";

    if (videoBox) {
      videoBox.innerHTML = "";
    }
  }
});
