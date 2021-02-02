var navToggled = false;
function toggleNav() {
    if (navToggled) {
        openNav();
        setButtonContent();
        navToggled = false;
    } else {
        closeNav();
        setButtonContent();
        navToggled = true;
    }
}

function setButtonContent() {
    if (navToggled) {
        document.getElementById("openbtn").textContent = "\u2715 Kapat";
    } else {
        document.getElementById("openbtn").textContent =
            "\u2630 Son Depremleri Listele";
    }
}

/* Set display) */
function openNav() {
    document.getElementById("mySidebar").style.display = "block";
}

/* Close slidebar */
function closeNav() {
    document.getElementById("mySidebar").style.display = "none";
}
