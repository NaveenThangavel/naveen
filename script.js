// ============================================
// NAVEEN THANGAVEL — PORTFOLIO JAVASCRIPT
// ============================================

document.addEventListener("DOMContentLoaded", () => {

  // --------------------------------------------
  // SMOOTH SCROLLING
  // --------------------------------------------

  document.querySelectorAll('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });


  // --------------------------------------------
  // VIDEO MODAL
  // --------------------------------------------

  const modal = document.createElement("div");

  modal.className = "video-modal";

  modal.innerHTML = `
    <div class="video-modal-backdrop"></div>

    <div
      class="video-modal-dialog"
      role="dialog"
      aria-modal="true"
      aria-label="Video preview"
    >

      <button
        class="video-modal-close"
        type="button"
        aria-label="Close video"
      >
        ×
      </button>

      <div class="video-modal-content"></div>

    </div>
  `;

  document.body.appendChild(modal);


  const modalContent =
    modal.querySelector(".video-modal-content");

  const closeButton =
    modal.querySelector(".video-modal-close");

  const backdrop =
    modal.querySelector(".video-modal-backdrop");


  // --------------------------------------------
  // ESCAPE HTML
  // --------------------------------------------

  function escapeHtml(value) {

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  }


  // --------------------------------------------
  // OPEN VIDEO
  // --------------------------------------------

  function openVideo(url, title = "Video Preview") {

    if (!url) return;

    let embedUrl = url.trim();


    // Convert YouTube links
    try {

      const parsedUrl = new URL(embedUrl);


      // youtube.com/watch?v=
      if (parsedUrl.hostname.includes("youtube.com")) {

        const videoId =
          parsedUrl.searchParams.get("v");


        if (videoId) {

          embedUrl =
            `https://www.youtube.com/embed/${videoId}?autoplay=1`;

        }


        // youtube.com/shorts/
        else if (
          parsedUrl.pathname.startsWith("/shorts/")
        ) {

          const id =
            parsedUrl.pathname
              .split("/shorts/")[1]
              .split("/")[0];

          embedUrl =
            `https://www.youtube.com/embed/${id}?autoplay=1`;

        }

      }


      // youtu.be/
      else if (
        parsedUrl.hostname === "youtu.be"
      ) {

        const id =
          parsedUrl.pathname
            .replace("/", "")
            .split("/")[0];

        embedUrl =
          `https://www.youtube.com/embed/${id}?autoplay=1`;

      }

    }

    catch (error) {

      // Keep original URL
      // if it is already an embed/direct video URL.

    }


    // --------------------------------------------
    // DIRECT VIDEO FILE
    // --------------------------------------------

    const isDirectVideo =
      /\.(mp4|webm|ogg)(\?.*)?$/i.test(embedUrl);


    if (isDirectVideo) {

      modalContent.innerHTML = `

        <video
          controls
          autoplay
          playsinline
          class="video-player"
        >

          <source
            src="${escapeHtml(embedUrl)}"
          >

          Your browser does not support
          video playback.

        </video>

      `;

    }


    // --------------------------------------------
    // YOUTUBE / EMBED VIDEO
    // --------------------------------------------

    else {

      modalContent.innerHTML = `

        <iframe

          class="video-player"

          src="${escapeHtml(embedUrl)}"

          title="${escapeHtml(title)}"

          frameborder="0"

          allow="
            autoplay;
            encrypted-media;
            picture-in-picture;
            fullscreen
          "

          allowfullscreen>

        </iframe>

      `;

    }


    modal.classList.add("is-open");

    document.body.classList.add("modal-open");

  }


  // --------------------------------------------
  // CLOSE VIDEO
  // --------------------------------------------

  function closeVideo() {

    modal.classList.remove("is-open");

    modalContent.innerHTML = "";

    document.body.classList.remove("modal-open");

  }


  // --------------------------------------------
  // CLOSE BUTTON
  // --------------------------------------------

  closeButton.addEventListener(
    "click",
    closeVideo
  );


  // --------------------------------------------
  // CLICK BACKGROUND TO CLOSE
  // --------------------------------------------

  backdrop.addEventListener(
    "click",
    closeVideo
  );


  // --------------------------------------------
  // ESC KEY TO CLOSE
  // --------------------------------------------

  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Escape") {

        closeVideo();

      }

    }
  );


  // --------------------------------------------
  // PORTFOLIO VIDEO CARDS
  // --------------------------------------------

  document
    .querySelectorAll("[data-video]")
    .forEach((card) => {


      card.setAttribute(
        "role",
        "button"
      );


      card.setAttribute(
        "tabindex",
        "0"
      );


      function activateVideo() {

        const videoUrl =
          card.getAttribute("data-video");


        const title =
          card.getAttribute("data-title") ||

          card.querySelector("h3")?.textContent ||

          "Portfolio Video";


        if (videoUrl) {

          openVideo(
            videoUrl,
            title
          );

        }

      }


      // Mouse click
      card.addEventListener(
        "click",
        activateVideo
      );


      // Keyboard accessibility
      card.addEventListener(
        "keydown",
        (event) => {

          if (
            event.key === "Enter" ||
            event.key === " "
          ) {

            event.preventDefault();

            activateVideo();

          }

        }
      );

    });


  // --------------------------------------------
  // SCROLL REVEAL ANIMATION
  // --------------------------------------------

  const revealItems =
    document.querySelectorAll(
      `
      .section,
      .card,
      .service-card,
      .tool,
      .project-card
      `
    );


  if (
    "IntersectionObserver" in window
  ) {

    const observer =
      new IntersectionObserver(

        (entries, obs) => {

          entries.forEach((entry) => {

            if (
              !entry.isIntersecting
            ) return;


            entry.target.classList.add(
              "is-visible"
            );


            obs.unobserve(
              entry.target
            );

          });

        },

        {
          threshold: 0.12
        }

      );


    revealItems.forEach((item) => {

      item.classList.add(
        "reveal-item"
      );

      observer.observe(item);

    });

  }


  // --------------------------------------------
  // FALLBACK
  // --------------------------------------------

  else {

    revealItems.forEach((item) => {

      item.classList.add(
        "is-visible"
      );

    });

  }


  // --------------------------------------------
  // PARALLAX ELEMENTS
  // --------------------------------------------

  const parallaxItems =
    document.querySelectorAll(
      "[data-parallax]"
    );


  if (parallaxItems.length) {

    let ticking = false;


    function updateParallax() {

      const scrollY =
        window.scrollY;


      parallaxItems.forEach((item) => {

        const speed =
          Number(
            item.dataset.parallax
          ) || 0.08;


        item.style.transform =
          `translate3d(0, ${scrollY * speed}px, 0)`;

      });


      ticking = false;

    }


    window.addEventListener(
      "scroll",
      () => {

        if (!ticking) {

          window.requestAnimationFrame(
            updateParallax
          );

          ticking = true;

        }

      },
      {
        passive: true
      }
    );

  }


  // --------------------------------------------
  // AUTO CURRENT YEAR
  // --------------------------------------------

  document
    .querySelectorAll(
      "[data-current-year]"
    )
    .forEach((element) => {

      element.textContent =
        new Date().getFullYear();

    });


});