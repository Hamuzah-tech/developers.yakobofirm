(function () {
    "use strict";

    document.documentElement.classList.add("js-ready");

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function isRealUrl(value) {
        return typeof value === "string" && /^https?:\/\//i.test(value.trim());
    }

    function categoryLabel(category) {
        return (window.CATEGORY_META && CATEGORY_META[category] && CATEGORY_META[category].label) || category;
    }

    function categoryChip(category) {
        var chips = {
            corporate: "Corporate",
            business: "Business",
            organisations: "Organisation",
            schools: "School",
            "web-applications": "Web App",
            ecommerce: "E-commerce",
            portfolio: "Portfolio",
            events: "Events",
            booking: "Booking",
            management: "Management"
        };
        return chips[category] || categoryLabel(category);
    }

    function createProjectCard(project) {
        const name = escapeHtml(project.name);
        const category = escapeHtml(categoryChip(project.category));
        const image = escapeHtml(project.image);

        var hasSite = isRealUrl(project.websiteUrl);
        var url = hasSite ? project.websiteUrl.trim() : "#";
        var openAttrs = hasSite ? ' target="_blank" rel="noopener noreferrer"' : "";
        var tag = hasSite ? "a" : "article";
        var extra = hasSite
            ? ' href="' + escapeHtml(url) + '"' + openAttrs + ' aria-label="Open ' + name + ' website"'
            : "";

        var go = hasSite ? '<span class="project-card__go">Visit website</span>' : "";

        return (
            "<" + tag + ' class="project-card"' + extra + ">" +
            '<div class="project-card__media">' +
            '<img src="' + image + '" alt="' + name + ' website screenshot" loading="lazy" width="1200" height="750">' +
            '<span class="project-card__chip">' + category + "</span>" +
            '<div class="project-card__body">' +
            '<h3 class="project-card__title">' + name + "</h3>" +
            go +
            "</div></div></" + tag + ">"
        );
    }

    function renderProjects() {
        var lists = document.querySelectorAll("[data-project-list]");
        if (!lists.length || typeof projects === "undefined") return;

        lists.forEach(function (list) {
            var filter = list.getAttribute("data-project-list");
            var items = projects.slice();

            if (filter === "featured") {
                items = items.filter(function (project) {
                    return project.featured === true;
                });
            } else if (filter && filter !== "all") {
                items = items.filter(function (project) {
                    return project.category === filter;
                });
            }

            if (!items.length) {
                list.innerHTML =
                    '<p class="empty-state">Projects for this category will appear here once they are added in js/projects.js.</p>';
                return;
            }

            list.innerHTML = items.map(createProjectCard).join("");
        });
    }

    function renderLogos() {
        var host = document.querySelector("[data-logo-list]");
        if (!host || typeof clients === "undefined") return;

        var fallbacks = {
            "c-logo1.jpg": "assets/images/logos/girls-can.svg",
            "c-logo2.jpg": "assets/images/logos/gpc.svg",
            "c-logo3.jpg": "assets/images/logos/yaisk.svg",
            "c-logo4.jpg": "assets/images/logos/shj.svg"
        };

        host.innerHTML = clients
            .map(function (client) {
                var file = String(client.logo || "").split("/").pop();
                var fallback = fallbacks[file] || "";
                var img =
                    '<img src="' +
                    escapeHtml(client.logo) +
                    '" alt="' +
                    escapeHtml(client.name) +
                    ' logo" width="280" height="96"' +
                    (fallback
                        ? ' onerror="this.onerror=null;this.src=\'' + fallback + "'\""
                        : "") +
                    ">";

                if (isRealUrl(client.websiteUrl)) {
                    return (
                        '<a class="logo-item" href="' +
                        escapeHtml(client.websiteUrl) +
                        '" target="_blank" rel="noopener noreferrer" aria-label="' +
                        escapeHtml(client.name) +
                        ' website">' +
                        img +
                        "</a>"
                    );
                }

                return '<div class="logo-item" title="' + escapeHtml(client.name) + '">' + img + "</div>";
            })
            .join("");
    }

    function applySiteIdentity() {
        if (typeof SITE === "undefined") return;

        document.querySelectorAll("[data-site-name]").forEach(function (el) {
            el.textContent = SITE.shortName || SITE.name;
        });
        document.querySelectorAll("[data-site-full-name]").forEach(function (el) {
            el.textContent = SITE.name;
        });
        document.querySelectorAll("[data-site-role]").forEach(function (el) {
            el.textContent = SITE.role;
        });

        document.querySelectorAll("[data-contact]").forEach(function (el) {
            var type = el.getAttribute("data-contact");
            if (type === "email" && SITE.email) {
                el.setAttribute("href", "mailto:" + SITE.email);
            }
            if (type === "whatsapp" && SITE.whatsapp) {
                el.setAttribute("href", SITE.whatsapp);
                el.setAttribute("target", "_blank");
                el.setAttribute("rel", "noopener noreferrer");
            }
            if (type === "github") {
                if (isRealUrl(SITE.github)) {
                    el.setAttribute("href", SITE.github);
                    el.setAttribute("target", "_blank");
                    el.setAttribute("rel", "noopener noreferrer");
                } else {
                    el.hidden = true;
                }
            }
            if (type === "linkedin") {
                if (isRealUrl(SITE.linkedin)) {
                    el.setAttribute("href", SITE.linkedin);
                    el.setAttribute("target", "_blank");
                    el.setAttribute("rel", "noopener noreferrer");
                } else {
                    el.hidden = true;
                }
            }
        });

        var year = document.querySelector("[data-year]");
        if (year) year.textContent = String(new Date().getFullYear());
    }

    function initNavigation() {
        var toggle = document.querySelector(".menu-toggle");
        var nav = document.querySelector(".nav");
        var overlay = document.querySelector(".nav-overlay");
        var dropdown = document.querySelector(".has-dropdown");
        var dropdownBtn = document.querySelector(".dropdown-toggle");

        function closeMobile() {
            if (!nav) return;
            nav.classList.remove("is-open");
            if (toggle) {
                toggle.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
            }
            if (overlay) overlay.classList.remove("is-open");
            document.body.style.overflow = "";
        }

        function openMobile() {
            nav.classList.add("is-open");
            toggle.classList.add("is-open");
            toggle.setAttribute("aria-expanded", "true");
            overlay.classList.add("is-open");
            document.body.style.overflow = "hidden";
        }

        if (toggle && nav && overlay) {
            toggle.addEventListener("click", function () {
                if (nav.classList.contains("is-open")) closeMobile();
                else openMobile();
            });
            overlay.addEventListener("click", closeMobile);
        }

        if (dropdown && dropdownBtn) {
            dropdownBtn.addEventListener("click", function (event) {
                var mobile = window.matchMedia("(max-width: 900px)").matches;
                if (!mobile) return;
                event.preventDefault();
                var open = dropdown.classList.toggle("is-open");
                dropdownBtn.setAttribute("aria-expanded", open ? "true" : "false");
            });

            dropdownBtn.addEventListener("keydown", function (event) {
                if (event.key === "Escape") {
                    dropdown.classList.remove("is-open");
                    dropdownBtn.setAttribute("aria-expanded", "false");
                    dropdownBtn.focus();
                }
                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    dropdown.classList.add("is-open");
                    dropdownBtn.setAttribute("aria-expanded", "true");
                    var first = dropdown.querySelector(".dropdown a");
                    if (first) first.focus();
                }
            });

            dropdown.addEventListener("keydown", function (event) {
                if (event.key === "Escape") {
                    dropdown.classList.remove("is-open");
                    dropdownBtn.setAttribute("aria-expanded", "false");
                    dropdownBtn.focus();
                }
            });

            document.addEventListener("click", function (event) {
                if (!dropdown.contains(event.target)) {
                    dropdown.classList.remove("is-open");
                    dropdownBtn.setAttribute("aria-expanded", "false");
                }
            });
        }

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") closeMobile();
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 900) closeMobile();
        });
    }

    function initHeroGallery() {
        var gallery = document.querySelector("[data-hero-gallery]");
        if (!gallery) return;

        var tiles = Array.prototype.slice.call(gallery.querySelectorAll(".hero-tile"));
        var coarse = window.matchMedia("(hover: none)");

        tiles.forEach(function (tile) {
            tile.addEventListener("click", function (event) {
                if (!coarse.matches) return;
                if (tile.classList.contains("is-active")) return;
                event.preventDefault();
                tiles.forEach(function (item) {
                    item.classList.remove("is-active");
                });
                tile.classList.add("is-active");
            });
        });

        document.addEventListener("click", function (event) {
            if (!gallery.contains(event.target)) {
                tiles.forEach(function (item) {
                    item.classList.remove("is-active");
                });
            }
        });
    }

    function initBackToTop() {
        document.querySelectorAll(".back-to-top").forEach(function (button) {
            button.addEventListener("click", function () {
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        });
    }

    function initMotion() {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        document.documentElement.classList.add("js-motion");

        var dirs = ["left", "up", "right", "down"];
        var dirIndex = 0;

        function nextDir() {
            var dir = dirs[dirIndex % dirs.length];
            dirIndex += 1;
            return dir;
        }

        function tag(el, dir, delayMs) {
            if (!el || el.hasAttribute("data-motion")) return;
            el.setAttribute("data-motion", dir || nextDir());
            if (delayMs) {
                el.style.transitionDelay = delayMs + "ms";
            }
        }

        function tagChildren(list, startDelay) {
            if (!list) return;
            Array.prototype.forEach.call(list, function (child, index) {
                tag(child, nextDir(), (startDelay || 0) + index * 70);
            });
        }

        document.querySelectorAll(".section-head, .section-head--center").forEach(function (el) {
            tag(el, "up");
        });

        tag(document.querySelector(".hero-intro"), "left");
        tag(document.querySelector(".hero-visual"), "right", 90);
        tag(document.querySelector(".hero .btn-row"), "up", 140);
        tag(document.querySelector(".page-hero .container"), "up");

        document.querySelectorAll(".logo-grid").forEach(function (grid) {
            tagChildren(grid.children, 40);
        });

        document.querySelectorAll(".project-grid").forEach(function (grid) {
            tagChildren(grid.children, 50);
        });

        document.querySelectorAll(".about-intro > *").forEach(function (el, index) {
            tag(el, index % 2 === 0 ? "left" : "right", index * 80);
        });

        document.querySelectorAll(".capability-band .container").forEach(function (el) {
            tag(el, "fade");
        });

        var cta = document.querySelector(".final-cta");
        if (cta) {
            tag(cta.querySelector(".cta-kicker"), "down", 0);
            tag(cta.querySelector(".cta-title"), "up", 80);
            tag(cta.querySelector(".cta-lead"), "fade", 140);
            tag(cta.querySelector(".cta-phone"), "up", 180);
        }

        document.querySelectorAll(".site-footer .footer-top, .site-footer .footer-bottom").forEach(function (el, index) {
            tag(el, "up", index * 90);
        });

        document.querySelectorAll(".reveal, .reveal-on-scroll").forEach(function (el) {
            if (el.closest(".hero, .page-hero, .logo-grid, .project-grid")) return;
            if (el.hasAttribute("data-motion")) return;
            tag(el, "up");
        });

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                    } else {
                        entry.target.classList.remove("is-visible");
                    }
                });
            },
            { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
        );

        document.querySelectorAll("[data-motion], .reveal").forEach(function (el) {
            var rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.92 && rect.bottom > 40) {
                el.classList.add("is-visible");
            }
            observer.observe(el);
        });

        var heroOrb = document.querySelector(".hero-orb");
        if (heroOrb) {
            heroOrb.classList.add("parallax-layer");
            heroOrb.setAttribute("data-parallax", "0.22");
        }

        var waves = document.querySelector(".cta-waves");
        if (waves) {
            waves.classList.add("parallax-layer");
            waves.setAttribute("data-parallax", "0.18");
        }

        var capability = document.querySelector(".capability-band");
        if (capability) {
            capability.classList.add("parallax-layer");
            capability.setAttribute("data-parallax", "0.08");
        }

        var layers = document.querySelectorAll("[data-parallax]");
        if (!layers.length) return;

        var ticking = false;

        function updateParallax() {
            var vh = window.innerHeight;
            layers.forEach(function (el) {
                var speed = parseFloat(el.getAttribute("data-parallax")) || 0.12;
                var rect = el.getBoundingClientRect();
                var offset = (rect.top + rect.height / 2 - vh / 2) * speed;
                el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
            });
            ticking = false;
        }

        function onScroll() {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(updateParallax);
        }

        window.addEventListener("scroll", onScroll, { passive: true });
        updateParallax();
    }

    function initCtaMessages() {
        var messages = document.querySelectorAll(".cta-msg");
        if (!messages.length) return;
        var coarse = window.matchMedia("(hover: none)");

        messages.forEach(function (msg) {
            msg.addEventListener("click", function () {
                if (!coarse.matches) return;
                var open = msg.classList.contains("is-open");
                messages.forEach(function (item) {
                    item.classList.remove("is-open");
                });
                if (!open) msg.classList.add("is-open");
            });
        });
    }

    renderProjects();
    renderLogos();
    applySiteIdentity();
    initNavigation();
    initHeroGallery();
    initBackToTop();
    initCtaMessages();
    initMotion();

    window.createProjectCard = createProjectCard;
})();
