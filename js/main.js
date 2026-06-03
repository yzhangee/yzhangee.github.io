document.addEventListener("DOMContentLoaded", function () {
    const header = document.getElementById("page_header");
    const backToTop = document.querySelector(".nav-wrap");
    let scrollTicking = false;

    function animateDocumentScroll(scrollTop) {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({
            top: scrollTop,
            left: 0,
            behavior: reducedMotion ? "auto" : "smooth"
        });
    }

    // Scroll state -------------------------------------------------------
    function syncHeaderState() {
        if (!header) return;
        header.classList.toggle("scrolled", window.scrollY > 10);
    }

    function syncBackToTopState() {
        if (!backToTop) return;
        backToTop.classList.toggle("is-visible", window.scrollY > 100);
    }

    function refreshScrollState() {
        syncHeaderState();
        syncBackToTopState();
    }

    function onScroll() {
        if (scrollTicking) return;
        scrollTicking = true;

        window.requestAnimationFrame(function () {
            refreshScrollState();
            scrollTicking = false;
        });
    }

    function bindBackToTop() {
        document.querySelectorAll(".cd-top").forEach(function (button) {
            button.addEventListener("click", function (event) {
                event.preventDefault();
                animateDocumentScroll(0);
            });
        });
    }

    function initScrollState() {
        refreshScrollState();
        window.addEventListener("scroll", onScroll, { passive: true });
        bindBackToTop();
    }

    // Publication collapsibles -----------------------------------------
    function updatePublicationToggleState(button, collapsed) {
        const label = collapsed ? "Expand section" : "Collapse section";
        button.setAttribute("aria-expanded", collapsed ? "false" : "true");
        button.setAttribute("aria-label", label);
        button.setAttribute("title", label);
    }

    function setPublicationCollapsed(button, body, collapsed) {
        const heading = button.closest("h2, h3");
        const yearBlock = heading ? heading.closest(".pub-year-block") : null;

        updatePublicationToggleState(button, collapsed);
        if (heading) heading.classList.toggle("is-collapsed", collapsed);
        if (yearBlock) yearBlock.classList.toggle("is-collapsed", collapsed);
        body.hidden = collapsed;
    }

    function bindPublicationCollapsibles() {
        document.addEventListener("click", function (event) {
            if (!(event.target instanceof Element)) return;
            const button = event.target.closest(".page-publications .pub-toggle");
            if (!button) return;

            const controlsId = button.getAttribute("aria-controls");
            const body = controlsId ? document.getElementById(controlsId) : null;
            const expanded = button.getAttribute("aria-expanded") !== "false";

            if (!body) return;
            setPublicationCollapsed(button, body, expanded);
        });
    }

    function initPublicationCollapsibles() {
        bindPublicationCollapsibles();
    }

    // Hash smooth scroll ------------------------------------------------
    function normalizePath(pathname) {
        return pathname.replace(/^\/|\/$/g, "");
    }

    function findHashTarget(hash) {
        if (!hash || hash === "#") return null;
        let id = "";

        try {
            id = decodeURIComponent(hash.slice(1));
        } catch (error) {
            return null;
        }

        return document.getElementById(id) || document.getElementsByName(id)[0] || null;
    }

    function bindHashSmoothScroll() {
        document.addEventListener("click", function (event) {
            if (!(event.target instanceof Element)) return;
            const link = event.target.closest('a[href*="#"]:not([href="#"])');
            if (!link) return;

            const url = new URL(link.href, window.location.href);
            const samePage = normalizePath(url.pathname) === normalizePath(window.location.pathname) &&
                url.hostname === window.location.hostname;
            const target = samePage ? findHashTarget(url.hash) : null;

            if (!target) return;
            event.preventDefault();
            animateDocumentScroll(target.getBoundingClientRect().top + window.scrollY);
        });
    }

    initScrollState();
    initPublicationCollapsibles();
    bindHashSmoothScroll();
});
