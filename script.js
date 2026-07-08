(function () {
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var mainNav = document.querySelector("[data-main-nav]");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      menuToggle.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 820) {
          mainNav.classList.remove("is-open");
          menuToggle.classList.remove("is-open");
          menuToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  var currentFile = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === currentFile) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  var aboutCvFrame = document.querySelector(".about-cv-frame[data-src]");
  if (aboutCvFrame && !window.matchMedia("(max-width: 980px)").matches) {
    aboutCvFrame.src = aboutCvFrame.getAttribute("data-src") || "";
  }

  document.querySelectorAll("[data-cv-toggle]").forEach(function (toggle) {
    var panel = document.getElementById(toggle.getAttribute("aria-controls"));
    if (!panel) return;

    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      panel.hidden = isOpen;

      if (!isOpen) {
        var frame = panel.querySelector(".cv-frame[data-src]");
        if (frame && !frame.getAttribute("src")) {
          frame.src = frame.getAttribute("data-src") || "";
        }
      }
    });
  });

  document.querySelectorAll("[data-video-facade]").forEach(function (facade) {
    facade.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      iframe.src = facade.getAttribute("data-video-src") || "";
      iframe.title = facade.getAttribute("data-video-title") || "";
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
      iframe.setAttribute("allowfullscreen", "");
      iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      facade.replaceWith(iframe);
    });
  });

  var localBgVideo = document.querySelector(".hero-video-local");
  var youtubeBgVideo = document.querySelector(".hero-video-youtube");

  if (localBgVideo && youtubeBgVideo) {
    var localVideoSrc = (localBgVideo.getAttribute("data-video-src") || "").trim();

    if (!localVideoSrc) {
      localBgVideo.style.display = "none";
    } else {
      localBgVideo.src = localVideoSrc;
      localBgVideo.load();

      var useYoutubeFallback = function () {
        if (!youtubeBgVideo.getAttribute("src")) {
          youtubeBgVideo.src = youtubeBgVideo.getAttribute("data-video-src") || "";
        }
        localBgVideo.style.display = "none";
        youtubeBgVideo.style.display = "block";
      };

      var fallbackTimer = window.setTimeout(function () {
        if (localBgVideo.readyState < 2) {
          useYoutubeFallback();
        }
      }, 1800);

      localBgVideo.addEventListener("loadeddata", function () {
        window.clearTimeout(fallbackTimer);
        youtubeBgVideo.style.display = "none";
      });

      localBgVideo.addEventListener("error", function () {
        window.clearTimeout(fallbackTimer);
        useYoutubeFallback();
      });
    }
  }

  var instagramCard = document.querySelector("[data-instagram-card]");
  var closeInstagramCardBtn = document.querySelector("[data-close-instagram-card]");

  if (instagramCard && !window.matchMedia("(max-width: 980px)").matches) {
    window.setTimeout(function () {
      instagramCard.classList.remove("is-hidden");
      instagramCard.classList.add("is-visible");
    }, 2000);
  }

  if (closeInstagramCardBtn && instagramCard) {
    closeInstagramCardBtn.addEventListener("click", function () {
      instagramCard.classList.remove("is-visible");
      instagramCard.classList.add("is-hidden");
    });
  }

  var metricValues = document.querySelectorAll(".metric-value[data-target]");
  if (metricValues.length) {
    var hasAnimatedMetrics = false;

    var animateValue = function (element) {
      var target = Number(element.getAttribute("data-target") || 0);
      var suffix = element.getAttribute("data-suffix") || "";
      var duration = 2900;
      var startTime = null;

      var tick = function (timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var value = Math.round(target * progress);
        element.textContent = String(value) + suffix;

        if (progress < 1) {
          window.requestAnimationFrame(tick);
        }
      };

      window.requestAnimationFrame(tick);
    };

    var animateAllMetrics = function () {
      if (hasAnimatedMetrics) return;
      hasAnimatedMetrics = true;
      metricValues.forEach(animateValue);
    };

    if ("IntersectionObserver" in window) {
      var metricsSection = document.querySelector(".metrics");
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateAllMetrics();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.25 }
      );

      if (metricsSection) {
        observer.observe(metricsSection);
      } else {
        animateAllMetrics();
      }
    } else {
      animateAllMetrics();
    }
  }

})();
