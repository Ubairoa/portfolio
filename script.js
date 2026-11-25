(() => {
  const root = document.documentElement;
  const header = document.getElementById("site-header");
  const themeToggle = document.getElementById("theme-toggle");
  const metaThemeColor = document.getElementById("meta-theme-color");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const navLinks = document.querySelectorAll(".nav-link");
  const yearEl = document.getElementById("current-year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ========================================================================
     Theme Toggle (Light / Carbon Dark)
     ======================================================================== */
  function syncThemeUI(theme) {
    root.setAttribute("data-theme", theme);
    const isDark = theme === "dark";
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
      );
    }
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", isDark ? "#0B0E13" : "#F8F9FB");
    }
  }

  syncThemeUI(root.getAttribute("data-theme") === "dark" ? "dark" : "light");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      syncThemeUI(next);
      try {
        localStorage.setItem("ur-theme", next);
      } catch (_) {}
    });
  }

  /* ========================================================================
     Mobile Navigation Drawer (accessible, Escape & outside click)
     ======================================================================== */
  function setDrawerOpen(open) {
    if (!menuToggle || !mobileDrawer) return;
    mobileDrawer.hidden = !open;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute(
      "aria-label",
      open ? "Cerrar menú de navegación" : "Abrir menú de navegación"
    );
  }

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener("click", () => {
      setDrawerOpen(mobileDrawer.hidden);
    });

    mobileDrawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setDrawerOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !mobileDrawer.hidden) {
        setDrawerOpen(false);
        menuToggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        !mobileDrawer.hidden &&
        !mobileDrawer.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        setDrawerOpen(false);
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768 && !mobileDrawer.hidden) {
        setDrawerOpen(false);
      }
    });
  }

  /* ========================================================================
     Header Scroll State & Active Section Observer
     ======================================================================== */
  function syncHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }

  syncHeaderState();
  window.addEventListener("scroll", syncHeaderState, { passive: true });

  const trackedSections = document.querySelectorAll("main section[id], footer[id]");
  if ("IntersectionObserver" in window && trackedSections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
          });
        });
      },
      { rootMargin: "-32% 0px -56% 0px" }
    );

    trackedSections.forEach((section) => observer.observe(section));
  }

  /* ========================================================================
     Interactive Badminton Biomechanics Pose Preview
     ======================================================================== */
  const phases = {
    prep: {
      elbow: "96°",
      shoulder: "112°",
      delta: "+4°",
      callout: { x: 204, y: 112 },
      arc: "M 188 104 A 24 24 0 0 1 206 80",
      head: [164, 74],
      shoulderPt: [166, 100],
      hip: [164, 168],
      lArm: [122, 92],
      lForearm: [104, 68],
      rElbow: [208, 108],
      rWrist: [226, 76],
      rRacket: [248, 56],
      racketHead: { cx: 256, cy: 50, rot: -42 },
      lKnee: [134, 208],
      lFoot: [118, 246],
      rKnee: [198, 206],
      rFoot: [216, 246],
      pro: { s: [170, 98], e: [212, 102], w: [232, 72], r: [254, 52] }
    },
    impact: {
      elbow: "164°",
      shoulder: "148°",
      delta: "-3°",
      callout: { x: 226, y: 74 },
      arc: "M 197 77 A 28 28 0 0 1 232 45",
      head: [174, 70],
      shoulderPt: [172, 96],
      hip: [166, 166],
      lArm: [132, 122],
      lForearm: [112, 146],
      rElbow: [214, 66],
      rWrist: [250, 34],
      rRacket: [278, 14],
      racketHead: { cx: 286, cy: 10, rot: -34 },
      lKnee: [134, 206],
      lFoot: [120, 246],
      rKnee: [202, 204],
      rFoot: [218, 246],
      pro: { s: [176, 92], e: [218, 62], w: [256, 28], r: [282, 10] }
    },
    follow: {
      elbow: "138°",
      shoulder: "78°",
      delta: "+1°",
      callout: { x: 112, y: 158 },
      arc: "M 152 118 A 26 26 0 0 0 132 142",
      head: [182, 76],
      shoulderPt: [178, 102],
      hip: [168, 168],
      lArm: [214, 122],
      lForearm: [234, 146],
      rElbow: [142, 130],
      rWrist: [114, 168],
      rRacket: [92, 194],
      racketHead: { cx: 85, cy: 202, rot: 132 },
      lKnee: [146, 208],
      lFoot: [134, 246],
      rKnee: [204, 206],
      rFoot: [222, 246],
      pro: { s: [182, 100], e: [146, 128], w: [118, 164], r: [96, 190] }
    }
  };

  function setLine(id, x1, y1, x2, y2) {
    const el = document.getElementById(id);
    if (!el) return;
    el.setAttribute("x1", String(x1));
    el.setAttribute("y1", String(y1));
    el.setAttribute("x2", String(x2));
    el.setAttribute("y2", String(y2));
  }

  function setCircle(id, cx, cy) {
    const el = document.getElementById(id);
    if (!el) return;
    el.setAttribute("cx", String(cx));
    el.setAttribute("cy", String(cy));
  }

  const phaseButtons = document.querySelectorAll(".phase-btn");
  function applyPhase(key) {
    const p = phases[key];
    if (!p) return;

    phaseButtons.forEach((btn) => {
      const active = btn.dataset.phase === key;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    setLine("bone-torso", p.shoulderPt[0], p.shoulderPt[1], p.hip[0], p.hip[1]);
    setLine("bone-l-arm", p.shoulderPt[0], p.shoulderPt[1], p.lArm[0], p.lArm[1]);
    setLine("bone-l-forearm", p.lArm[0], p.lArm[1], p.lForearm[0], p.lForearm[1]);
    setLine("bone-r-arm", p.shoulderPt[0], p.shoulderPt[1], p.rElbow[0], p.rElbow[1]);
    setLine("bone-r-forearm", p.rElbow[0], p.rElbow[1], p.rWrist[0], p.rWrist[1]);
    setLine("bone-r-racket", p.rWrist[0], p.rWrist[1], p.rRacket[0], p.rRacket[1]);
    setLine("bone-l-thigh", p.hip[0], p.hip[1], p.lKnee[0], p.lKnee[1]);
    setLine("bone-l-shin", p.lKnee[0], p.lKnee[1], p.lFoot[0], p.lFoot[1]);
    setLine("bone-r-thigh", p.hip[0], p.hip[1], p.rKnee[0], p.rKnee[1]);
    setLine("bone-r-shin", p.rKnee[0], p.rKnee[1], p.rFoot[0], p.rFoot[1]);

    setLine("pro-torso", p.pro.s[0], p.pro.s[1], p.hip[0] + 2, p.hip[1] - 2);
    setLine("pro-upper-arm", p.pro.s[0], p.pro.s[1], p.pro.e[0], p.pro.e[1]);
    setLine("pro-forearm", p.pro.e[0], p.pro.e[1], p.pro.w[0], p.pro.w[1]);
    setLine("pro-racket", p.pro.w[0], p.pro.w[1], p.pro.r[0], p.pro.r[1]);

    setCircle("node-head", p.head[0], p.head[1]);
    setCircle("node-shoulder", p.shoulderPt[0], p.shoulderPt[1]);
    setCircle("node-elbow", p.rElbow[0], p.rElbow[1]);
    setCircle("node-wrist", p.rWrist[0], p.rWrist[1]);
    setCircle("node-hip", p.hip[0], p.hip[1]);
    setCircle("node-l-knee", p.lKnee[0], p.lKnee[1]);
    setCircle("node-r-knee", p.rKnee[0], p.rKnee[1]);

    const racketHead = document.getElementById("racket-head");
    if (racketHead) {
      racketHead.setAttribute("cx", String(p.racketHead.cx));
      racketHead.setAttribute("cy", String(p.racketHead.cy));
      racketHead.setAttribute(
        "transform",
        `rotate(${p.racketHead.rot} ${p.racketHead.cx} ${p.racketHead.cy})`
      );
    }

    const arc = document.getElementById("pose-angle-arc");
    if (arc) arc.setAttribute("d", p.arc);

    const callout = document.getElementById("angle-callout");
    if (callout) {
      callout.setAttribute("transform", `translate(${p.callout.x}, ${p.callout.y})`);
    }

    const svgAngle = document.getElementById("svg-angle-text");
    const metricElbow = document.getElementById("metric-elbow");
    const metricShoulder = document.getElementById("metric-shoulder");
    const metricDelta = document.getElementById("metric-delta");

    if (svgAngle) svgAngle.textContent = p.elbow;
    if (metricElbow) metricElbow.textContent = p.elbow;
    if (metricShoulder) metricShoulder.textContent = p.shoulder;
    if (metricDelta) metricDelta.textContent = p.delta;
  }

  phaseButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      applyPhase(btn.dataset.phase || "impact");
    });
  });

  /* ========================================================================
     Segmented Project Filter with Smooth Sliding Indicator
     ======================================================================== */
  const filterContainer = document.getElementById("project-filters");
  const filterIndicator = document.getElementById("filter-indicator");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectsGrid = document.getElementById("projects-grid");
  const projectCards = document.querySelectorAll(".project-card");
  const filterStatus = document.getElementById("filter-status");

  function positionIndicator(activeBtn) {
    if (!filterContainer || !filterIndicator || !activeBtn) return;
    if (window.innerWidth <= 768) return;

    const containerRect = filterContainer.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    const offsetX = btnRect.left - containerRect.left;

    filterIndicator.style.width = `${btnRect.width}px`;
    filterIndicator.style.transform = `translateX(${offsetX}px)`;
    filterContainer.classList.add("is-ready");
  }

  function applyFilter(category) {
    let activeBtn = null;
    let visibleCount = 0;

    filterButtons.forEach((btn) => {
      const isActive = btn.dataset.filter === category;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
      if (isActive) activeBtn = btn;
    });

    projectCards.forEach((card) => {
      const categories = (card.dataset.categories || "").split(/\s+/).filter(Boolean);
      const visible = category === "all" || categories.includes(category);

      card.classList.remove("is-entering");
      card.classList.toggle("is-hidden", !visible);

      if (visible) {
        visibleCount += 1;
        void card.offsetWidth;
        card.classList.add("is-entering");
      }
    });

    if (projectsGrid) {
      projectsGrid.setAttribute("data-visible-count", String(visibleCount));
    }

    if (filterStatus) {
      filterStatus.textContent =
        visibleCount === 1
          ? "Mostrando 1 proyecto."
          : `Mostrando ${visibleCount} proyectos.`;
    }

    positionIndicator(activeBtn);
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      applyFilter(btn.dataset.filter || "all");
    });
  });

  const initialActive = document.querySelector(".filter-btn.is-active");
  if (initialActive) {
    requestAnimationFrame(() => positionIndicator(initialActive));
    window.addEventListener("resize", () => {
      const current = document.querySelector(".filter-btn.is-active");
      positionIndicator(current);
    });
  }
})();
