$(function () {
    function syncHeaderState() {
        var $header = $("#page_header");
        if (!$header.length) return;
        if ($(window).scrollTop() > 10) {
            $header.addClass("scrolled");
        } else {
            $header.removeClass("scrolled");
        }
    }

    function initGroupFlipCards() {
        var prefersTap = window.matchMedia("(hover: none), (pointer: coarse)").matches;
        var $cards = $(".group-member-flip-card");
        $cards.off(".flipcard");
        $(document).off("click.flipcardclose");

        $cards.on("keydown.flipcard", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                $(this).toggleClass("is-flipped");
            }
            if (event.key === "Escape") {
                $(this).removeClass("is-flipped").blur();
            }
        });

        if (!prefersTap) return;

        $cards.on("click.flipcard", function () {
            var $card = $(this);
            $(".group-member-flip-card").not($card).removeClass("is-flipped");
            $card.toggleClass("is-flipped");
        });

        $(document).on("click.flipcardclose", function (event) {
            if ($(event.target).closest(".group-member-flip-card").length) return;
            $(".group-member-flip-card").removeClass("is-flipped");
        });
    }

    function updatePublicationToggleState($button, collapsed) {
        var label = collapsed ? "Expand section" : "Collapse section";
        $button.attr("aria-expanded", collapsed ? "false" : "true");
        $button.attr("aria-label", label);
        $button.attr("title", label);
    }

    function createPublicationToggle(extraClass, controlsId) {
        var $button = $('<button class="pub-toggle ' + extraClass + '" type="button" aria-controls="' + controlsId + '"></button>');
        updatePublicationToggleState($button, false);
        return $button;
    }

    function setPublicationCollapsed($button, $body, collapsed) {
        var $heading = $button.closest("h2, h3");
        var $yearBlock = $heading.closest(".pub-year-block");

        updatePublicationToggleState($button, collapsed);
        $heading.toggleClass("is-collapsed", collapsed);
        $yearBlock.toggleClass("is-collapsed", collapsed);

        if (collapsed) {
            $body.hide();
        } else {
            $body.show();
        }
    }

    function bindPublicationCollapsibles() {
        $(document).off("click.pubtoggle").on("click.pubtoggle", ".page-publications .pub-toggle", function () {
            var $button = $(this);
            var controlsId = $button.attr("aria-controls");
            var $body = $("#" + controlsId);
            var expanded = $button.attr("aria-expanded") !== "false";

            if (!$body.length) return;
            setPublicationCollapsed($button, $body, expanded);
        });
    }

    function initPublicationCollapsibles() {
        var $articles = $(".page-publications article");

        if (!$articles.length) return;

        $articles.each(function (articleIndex) {
            var $article = $(this);

            if ($article.data("pubCollapsibleReady")) return;
            $article.data("pubCollapsibleReady", true);

            var sectionNodes = $article.children().not(".pub-overview").toArray();
            var $currentSectionBody = null;

            $.each(sectionNodes, function (_, node) {
                var $node = $(node);

                if ($node.is("h2")) {
                    $node.addClass("pub-section-heading");
                    $currentSectionBody = $('<div class="pub-section-body"></div>');
                    $node.after($currentSectionBody);
                    return;
                }

                if ($currentSectionBody) {
                    $currentSectionBody.append($node);
                }
            });

            $article.children(".pub-section-body").each(function () {
                var $sectionBody = $(this);
                var yearNodes = $sectionBody.children().toArray();
                var $currentYearBody = null;

                $.each(yearNodes, function (_, node) {
                    var $node = $(node);

                    if ($node.is("h3")) {
                        var $yearBlock = $('<div class="pub-year-block"></div>');
                        $currentYearBody = $('<div class="pub-year-body"></div>');

                        $node.addClass("pub-year-heading");
                        $node.before($yearBlock);
                        $yearBlock.append($node);
                        $yearBlock.append($currentYearBody);
                        return;
                    }

                    if ($currentYearBody) {
                        $currentYearBody.append($node);
                    }
                });
            });

            $article.find(".pub-section-heading").each(function (sectionIndex) {
                var $heading = $(this);
                var $body = $heading.next(".pub-section-body");
                var bodyId = "pub-section-body-" + articleIndex + "-" + sectionIndex;

                if (!$body.length || $heading.find(".pub-section-toggle").length) return;
                $body.attr("id", bodyId);
                $heading.append(createPublicationToggle("pub-section-toggle", bodyId));
            });

            $article.find(".pub-year-heading").each(function (yearIndex) {
                var $heading = $(this);
                var $body = $heading.next(".pub-year-body");
                var bodyId = "pub-year-body-" + articleIndex + "-" + yearIndex;

                if (!$body.length || $heading.find(".pub-year-toggle").length) return;
                $body.attr("id", bodyId);
                $heading.append(createPublicationToggle("pub-year-toggle", bodyId));
            });
        });
    }

    syncHeaderState();
    initGroupFlipCards();
    initPublicationCollapsibles();
    bindPublicationCollapsibles();
    $(window).on("scroll", syncHeaderState);

    // menu
    $(".menus_icon").click(function () {
        if ($(".header_wrap").hasClass("menus-open")) {
            $(".header_wrap").removeClass("menus-open").addClass("menus-close")
        } else {
            $(".header_wrap").removeClass("menus-close").addClass("menus-open")
        }
    })

    $(".m-social-links").click(function () {
        if ($(".author-links").hasClass("is-open")) {
            $(".author-links").removeClass("is-open").addClass("is-close")
        } else {
            $(".author-links").removeClass("is-close").addClass("is-open")
        }
    })

    $(".site-nav").click(function () {
        if ($(".nav").hasClass("nav-open")) {
            $(".nav").removeClass("nav-open").addClass("nav-close")
        } else {
            $(".nav").removeClass("nav-close").addClass("nav-open")
        }
    })

    $(document).click(function(e){
        var target = $(e.target);
        if(target.closest(".nav").length != 0) return;
        $(".nav").removeClass("nav-open").addClass("nav-close")
        if(target.closest(".author-links").length != 0) return;
        $(".author-links").removeClass("is-open").addClass("is-close")
        if((target.closest(".menus_icon").length != 0) || (target.closest(".menus_items").length != 0)) return;
        $(".header_wrap").removeClass("menus-open").addClass("menus-close")
    })

    // 显示 cdtop
    $(document).ready(function ($) {
        var offset = 100,
            scroll_top_duration = 700,
            $back_to_top = $('.nav-wrap');

        $(window).scroll(function () {
            ($(this).scrollTop() > offset) ? $back_to_top.addClass('is-visible') : $back_to_top.removeClass('is-visible');
        });

        $(".cd-top").on('click', function (event) {
            event.preventDefault();
            $('body,html').animate({
                scrollTop: 0,
            }, scroll_top_duration);
        });
    });

    // pjax
    $(document).pjax('a[target!=_blank]','.page', {
        fragment: '.page',
        timeout: 5000
    });
    $(document).on({
        'pjax:click': function() {
            $('body,html').animate({
                scrollTop: 0,
            }, 700);
        },
        'pjax:end': function() {
            syncHeaderState();
            initGroupFlipCards();
            initPublicationCollapsibles();
            bindPublicationCollapsibles();
            if ($(".header_wrap").hasClass("menus-open")) {
                $(".header_wrap").removeClass("menus-open").addClass("menus-close")
            }
            if ($(".author-links").hasClass("is-open")) {
                $(".author-links").removeClass("is-open").addClass("is-close")
            }
            if ($(".nav").hasClass("nav-open")) {
                $(".nav").removeClass("nav-open").addClass("nav-close")
            }
        }
    });

    // smooth scroll
    $(function () {
        $('a[href*=\\#]:not([href=\\#])').click(function () {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top
                    }, 700);
                    return false;
                }
            }
        });
    });

})
