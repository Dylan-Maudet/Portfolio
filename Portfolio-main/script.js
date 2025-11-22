document.addEventListener('DOMContentLoaded', () => {
  // Transition d’entrée de page
  setTimeout(() => {
    document.body.classList.remove('page-enter');
    // On restaure le scroll après transition
  }, 1000);

  // Transition de sortie de page
  const pageLinks = Array.from(document.querySelectorAll('a[href]')).filter(link => {
    const href = link.getAttribute('href');
    return (
      href &&
      !href.startsWith('#') &&
      !href.startsWith('mailto:') &&
      !href.startsWith('tel:') &&
      link.target !== '_blank'
    );
  });

  pageLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = link.href;
      document.body.classList.add('page-exit');
      setTimeout(() => {
        window.location.href = href;
      }, 1000);
    });
  });

  // Bouton retour en haut
  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }

  // Onglet actif dans la nav
  // Gérer les onglets actifs dans la navigation principale
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    const linkFile = href.split('#')[0];

    if (linkFile === currentFile) {
      // 1. Mettre ce lien en surbrillance
      link.classList.add('active');

      // 2. Si c'est un lien dans un sous-menu, ajouter 'active' à son parent dropdown-sub
      const dropdownSub = link.closest('.dropdown-sub');
      if (dropdownSub) {
        const parentLink = dropdownSub.querySelector('a[href]');
        if (parentLink) parentLink.classList.add('active');
      }

      // 3. Si c'est un lien dans un sous-menu quelconque, activer "Réalisations"
      const dropdown = link.closest('.dropdown-content');
      if (dropdown) {
        const parentDropdown = dropdown.closest('.dropdown');
        if (parentDropdown) {
          const parentLink = parentDropdown.querySelector('a[href]');
          if (parentLink) parentLink.classList.add('active');
        }
      }
    }

    // Mettre en surbrillance le lien actif du footer
    const footerLinks = document.querySelectorAll('.footer-nav a');

    footerLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      const linkFile = href.split('#')[0];
      if (linkFile === currentFile) {
        link.classList.add('active');
      }
    });
  });


  // --- Menu mobile & dropdowns ---

  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-links');
  const dropdowns = document.querySelectorAll('.dropdown, .dropdown-sub');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', e => {
      e.stopPropagation();
      navMenu.classList.toggle('open');

      // Accessibilité (optionnel)
      const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !expanded);
    });

    navMenu.addEventListener('click', e => e.stopPropagation());

    document.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        dropdowns.forEach(d => d.classList.remove('open'));
        mobileMenuBtn.setAttribute('aria-expanded', false);
      }
    });

    dropdowns.forEach(dropdown => {
      // On cible le lien avec la classe has-submenu ou juste le lien principal
      const trigger = dropdown.querySelector('a.has-submenu, a[href="#"], span.no-link') || dropdown.querySelector('a');

      if (trigger) {
        trigger.addEventListener('click', e => {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            dropdown.classList.toggle('open');
          }
        });
      }
    });
  }
});