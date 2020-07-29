/*
An accessible menu for WordPress

https://github.com/theme-smith/accessible-nav-wp
Kirsten Smith (kirsten@themesmith.co.uk)
Licensed GPL v.2 (http://www.gnu.org/licenses/gpl-2.0.html)

This work derived from:
https://github.com/WordPress/twentysixteen (GPL v.2)
https://github.com/wpaccessibility/a11ythemepatterns/tree/master/menu-keyboard-arrow-nav (GPL v.2)
*/

(function ($) {
  // Responsive nav width
  var responsivenav = 960;

  // Check if enter pressed
  var enterPressed = false;
  $(window)
    .keydown(function (evt) {
      if (evt.which == 13) {
        enterPressed = true;
      }
    })
    .keyup(function (evt) {
      if (evt.which == 13) {
        enterPressed = false;
      }
    });

  // More flexible subnav hovers with class helper
  $(".menu-item-has-children .sub-menu, .menu-item-has-children a").hover(
    function () {
      $(this).parent().addClass("hovered");
    },
    function () {
      $(this).parent().removeClass("hovered");
    }
  );

  var menuContainer = $(".nav-container");
  var menuToggle = menuContainer.find("#nav-toggle");
  var siteHeaderMenu = menuContainer.find("#main-navigation-wrapper");
  var siteNavigation = menuContainer.find("#nav");

  // Toggles the menu button
  (function () {
    if (!menuToggle.length) {
      return;
    }

    menuToggle.add(siteNavigation).attr("aria-expanded", "false");
    menuToggle.on("click", function () {
      $(this).add(siteHeaderMenu).toggleClass("toggled-on");

      // jscs:disable
      $(this)
        .add(siteNavigation)
        .attr(
          "aria-expanded",
          $(this).add(siteNavigation).attr("aria-expanded") === "false"
            ? "true"
            : "false"
        );
      // jscs:enable
    });
  })();

  // Close focused dropdowns when pressing esc
  $(".dropdown a, .dropdown button").on("keyup", function () {
    if ($(".dropdown").find(":focus").length !== 0) {
      // Close menu using Esc key.
      if (event.keyCode == 27) {
        // Close the dropdown menu
        thisDropdown = $(this).parent().parent().parent();

        screenReaderSpan = thisDropdown.find(".screen-reader-text");
        dropdownToggle = thisDropdown.find(".dropdown-toggle");
        thisDropdown.find(".sub-menu").removeClass("toggled-on");
        thisDropdown.find(".dropdown-toggle").removeClass("toggled-on");
        thisDropdown.find(".dropdown").removeClass("toggled-on");
        dropdownToggle.attr("aria-expanded", "false");
        // jscs:enable
        screenReaderSpan.text(air_light_screenReaderText.expand);
        // Move focus back to previous dropdown select
        thisDropdown.find(".dropdown-toggle:first").focus();
      }
    }
  });

  // Adds aria attribute
  siteHeaderMenu.find(".menu-item-has-children").attr("aria-haspopup", "true");

  // Toggles the sub-menu when dropdown toggle button accessed
  siteHeaderMenu.find(".dropdown-toggle").click(function (e) {
    if (enterPressed || window.innerWidth < responsivenav) {
      const screenReaderSpan = $(this).find(".screen-reader-text");
      const dropdownMenu = $(this).nextAll(".sub-menu");

      e.preventDefault();
      $(this).toggleClass("toggled-on");
      dropdownMenu.toggleClass("toggled-on");

      // jscs:disable
      $(this).attr(
        "aria-expanded",
        $(this).attr("aria-expanded") === "false" ? "true" : "false"
      );
      // jscs:enable
      screenReaderSpan.text(
        screenReaderSpan.text() === air_light_screenReaderText.expand
          ? air_light_screenReaderText.collapse
          : air_light_screenReaderText.expand
      );
    }
  });

  // Adds a class to sub-menus for styling
  $(".sub-menu .menu-item-has-children")
    .parent(".sub-menu")
    .addClass("has-sub-menu");

  // Keyboard navigation
  $(".menu-item a, button.dropdown-toggle").on("keydown", function (e) {
    if ([37, 38, 39, 40].indexOf(e.keyCode) == -1) {
      return;
    }

    switch (e.keyCode) {
      case 37: // left key
        e.preventDefault();
        e.stopPropagation();

        if ($(this).hasClass("dropdown-toggle")) {
          $(this).prev("a").focus();
        } else {
          if (
            $(this).parent().prev().children("button.dropdown-toggle").length
          ) {
            $(this).parent().prev().children("button.dropdown-toggle").focus();
          } else {
            $(this).parent().prev().children("a").focus();
          }
        }

        if ($(this).is("ul ul ul.sub-menu.toggled-on li:first-child a")) {
          $(this)
            .parents("ul.sub-menu.toggled-on li")
            .children("button.dropdown-toggle")
            .focus();
        }

        break;

      case 39: // right key
        e.preventDefault();
        e.stopPropagation();

        if ($(this).next("button.dropdown-toggle").length) {
          $(this).next("button.dropdown-toggle").focus();
        } else if ($(this).parent().next().find("input").length) {
          $(this).parent().next().find("input").focus();
        } else {
          $(this).parent().next().children("a").focus();
        }

        if ($(this).is("ul.sub-menu .dropdown-toggle.toggled-on")) {
          $(this).parent().find("ul.sub-menu li:first-child a").focus();
        }

        break;

      case 40: // down key
        e.preventDefault();
        e.stopPropagation();

        if ($(this).next().length) {
          $(this).next().find("li:first-child a").first().focus();
        } else if ($(this).parent().next().find("input").length) {
          $(this).parent().next().find("input").focus();
        } else {
          $(this).parent().next().children("a").focus();
        }

        if (
          $(this).is("ul.sub-menu a") &&
          $(this).next("button.dropdown-toggle").length
        ) {
          $(this).parent().next().children("a").focus();
        }

        if (
          $(this).is("ul.sub-menu .dropdown-toggle") &&
          $(this).parent().next().children(".dropdown-toggle").length
        ) {
          $(this).parent().next().children(".dropdown-toggle").focus();
        }

        break;

      case 38: // up key
        e.preventDefault();
        e.stopPropagation();

        if ($(this).parent().prev().length) {
          $(this).parent().prev().children("a").focus();
        } else {
          $(this)
            .parents("ul")
            .first()
            .prev(".dropdown-toggle.toggled-on")
            .focus();
        }

        if (
          $(this).is("ul.sub-menu .dropdown-toggle") &&
          $(this).parent().prev().children(".dropdown-toggle").length
        ) {
          $(this).parent().prev().children(".dropdown-toggle").focus();
        }

        break;
    }
  });

  var html,
    body,
    container,
    button,
    menu,
    menuWrapper,
    links,
    subMenus,
    i,
    len,
    focusableElements,
    firstFocusableElement,
    lastFocusableElement;

  container = document.getElementById("nav");
  if (!container) {
    return;
  }

  button = document.getElementById("nav-toggle");
  if ("undefined" === typeof button) {
    return;
  }

  // Set vars.
  html = document.getElementsByTagName("html")[0];
  body = document.getElementsByTagName("body")[0];
  menu = container.getElementsByTagName("ul")[0];
  menuWrapper = document.getElementById("main-navigation-wrapper");

  // Hide menu toggle button if menu is empty and return early.
  if ("undefined" === typeof menu) {
    button.style.display = "none";
    return;
  }

  menu.setAttribute("aria-expanded", "false");
  if (-1 === menu.className.indexOf("nav-menu")) {
    menu.className += " nav-menu";
  }

  // Focus trap for mobile navigation
  if (window.innerWidth < responsivenav) {
    var firstFocusableElement = null;
    var lastFocusableElement = null;

    // Select nav items
    navElements = container.querySelectorAll([
      ".nav-primary a[href]",
      ".nav-primary button",
    ]);
    for (var i = 0; i < navElements.length; i++) {
      navElements[i].addEventListener("keydown", function () {
        focusTrap();
      });
    }

    function focusTrap() {
      // Set focusable elements inside main navigation.
      focusableElements = container.querySelectorAll([
        ".sub-menu.toggled-on > li a[href]",
        'ul[aria-expanded="true"] > li > a[href]',
        "area[href]",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        ".sub-menu.toggled-on > li > button:not([disabled]):not(.toggled-on)",
        'ul[aria-expanded="true"] > li > button:not([disabled]):not(.toggled-on)',
        "iframe",
        "object",
        "embed",
        "[contenteditable]",
        '[tabindex]:not([tabindex^="-"])',
      ]);
      firstFocusableElement = focusableElements[0];
      lastFocusableElement = focusableElements[focusableElements.length - 1];

      // Tämä näyttää oikean muuttuvan arvon
      console.log(lastFocusableElement);

      // Redirect last Tab to first focusable element.
      lastFocusableElement.addEventListener("keydown", function (e) {
        if (e.keyCode === 9 && !e.shiftKey) {
          e.preventDefault();

          // Tämä näyttää saman mikä aikaisemminkin...
          console.log(this);
          button.focus(); // Set focus on first element - that's actually close menu button.
        }
      });

      // Redirect first Shift+Tab to toggle button element.
      firstFocusableElement.addEventListener("keydown", function (e) {
        if (e.keyCode === 9 && e.shiftKey) {
          e.preventDefault();
          button.focus(); // Set focus on last element.
        }
      });

      // Redirect Shift+Tab from the toggle button to last focusable element.
      button.addEventListener("keydown", function (e) {
        if (e.keyCode === 9 && e.shiftKey) {
          e.preventDefault();
          lastFocusableElement.focus(); // Set focus on last element.
        }
      });
    }
  }

  // What happens when clicking menu toggle
  button.onclick = function () {
    // Change screen reader open/close labels
    navTogglescreenReaderText = $(this).find("#nav-toggle-label");

    $(this).attr(
      "aria-expanded",
      $(this).attr("aria-expanded") === "false" ? "true" : "false"
    );

    $(this).attr(
      "aria-label",
      $(this).attr("aria-label") === air_light_screenReaderText.expand_toggle
        ? air_light_screenReaderText.collapse_toggle
        : air_light_screenReaderText.expand_toggle
    );

    navTogglescreenReaderText.text(
      navTogglescreenReaderText.text() ===
        air_light_screenReaderText.expand_toggle
        ? air_light_screenReaderText.collapse_toggle
        : air_light_screenReaderText.expand_toggle
    );

    if (-1 !== container.className.indexOf("is-active")) {
      closeMenu(); // Close menu.
    } else {
      html.className += " disable-scroll";
      body.className += " js-nav-active";
      container.className += " is-active";
      button.className += " is-active";
      button.setAttribute("aria-expanded", "true");
      menu.setAttribute("aria-expanded", "true");
    }
  };

  // Close menu using Esc key.
  document.addEventListener("keyup", function (event) {
    if (event.keyCode == 27) {
      if (-1 !== container.className.indexOf("is-active")) {
        closeMenu(); // Close menu.
      }
    }
  });

  // Close menu clicking menu wrapper area.
  menuWrapper.onclick = function (e) {
    if (
      e.target == menuWrapper &&
      -1 !== container.className.indexOf("is-active")
    ) {
      closeMenu(); // Close menu.
    }
  };

  // Close menu function.
  function closeMenu() {
    html.className = html.className.replace(" disable-scroll", "");
    body.className = body.className.replace(" js-nav-active", "");
    container.className = container.className.replace(" is-active", "");
    button.className = button.className.replace(" is-active", "");
    button.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-expanded", "false");

    // Change screen reader open/close labels
    navTogglescreenReaderText = $("#nav-toggle-label");
    navTogglescreenReaderText.text(
      navTogglescreenReaderText.text() ===
        maailma2030_screenReaderText.expand_toggle
        ? maailma2030_screenReaderText.collapse_toggle
        : maailma2030_screenReaderText.expand_toggle
    );

    // Return focus to nav-toggle
    button.focus();
  }

  // Get all the link elements within the menu.
  links = menu.getElementsByTagName("a");
  subMenus = menu.getElementsByTagName("ul");

  // Each time a menu link is focused or blurred, toggle focus.
  for (i = 0, len = links.length; i < len; i++) {
    links[i].addEventListener("focus", toggleFocus, true);
    links[i].addEventListener("blur", toggleFocus, true);
  }

  /**
   * Sets or removes .focus class on an element.
   */
  function toggleFocus() {
    var self = this;

    // Move up through the ancestors of the current link until we hit .nav-menu.
    while (-1 === self.className.indexOf("nav-menu")) {
      // On li elements toggle the class .focus.
      if ("li" === self.tagName.toLowerCase()) {
        if (-1 !== self.className.indexOf("focus")) {
          self.className = self.className.replace(" focus", "");
        } else {
          self.className += " focus";
        }
      }

      self = self.parentElement;
    }
  }
})(jQuery);
