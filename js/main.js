

document.addEventListener('DOMContentLoaded', () => {
  createIcons();
  setupMobileMenu();
  setupLightbox();
  setupBeforeAfterSliders();
  setupContactForm();
});

function createIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function setupMobileMenu() {
  const menuButton = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');

  if (!menuButton || !menu) return;

  const setMenuVisibility = (isOpen) => {
    menu.classList.toggle('hidden', !isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
  };

  menuButton.addEventListener('click', () => {
    setMenuVisibility(menu.classList.contains('hidden'));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuVisibility(false));
  });
}

function setupLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (!modal) return;

  const image = document.getElementById('lightboxImg');
  const title = document.getElementById('lightboxTitle');
  const description = document.getElementById('lightboxDesc');
  const closeButton = document.getElementById('lightboxCloseBtn');
  const callToAction = document.getElementById('lightboxCta');

  const open = (imageSource, imageTitle, imageDescription) => {
    if (!image || !title || !description) return;

    image.src = imageSource;
    image.alt = imageTitle;
    title.textContent = imageTitle;
    description.textContent = imageDescription;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    createIcons();
  };

  const close = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-lightbox]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      open(
        trigger.getAttribute('data-img') || '',
        trigger.getAttribute('data-title') || 'Project photo',
        trigger.getAttribute('data-desc') || '',
      );
    });
  });

  closeButton?.addEventListener('click', close);
  callToAction?.addEventListener('click', close);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) close();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
      close();
    }
  });
}

function setupBeforeAfterSliders() {
  document.querySelectorAll('[data-ba]').forEach((slider) => {
    const beforeLayer = slider.querySelector('.ba-before');
    const beforeImage = beforeLayer?.querySelector('img');
    const handle = slider.querySelector('.ba-handle');

    if (!beforeLayer || !beforeImage || !handle) return;

    let isDragging = false;
    let currentPosition = 50;

    const setPosition = (percentage) => {
      const position = Math.max(0, Math.min(100, percentage));
      currentPosition = position;
      beforeLayer.style.width = `${position}%`;
      handle.style.left = `${position}%`;
      beforeImage.style.setProperty(
        '--bw',
        `${slider.getBoundingClientRect().width}px`,
      );
    };

    const setPositionFromPointer = (clientX) => {
      const bounds = slider.getBoundingClientRect();
      setPosition(((clientX - bounds.left) / bounds.width) * 100);
    };

    setPosition(50);

    slider.addEventListener('pointerdown', (event) => {
      isDragging = true;
      slider.setPointerCapture(event.pointerId);
      setPositionFromPointer(event.clientX);
    });

    slider.addEventListener('pointermove', (event) => {
      if (isDragging) setPositionFromPointer(event.clientX);
    });

    const stopDragging = () => {
      isDragging = false;
    };

    slider.addEventListener('pointerup', stopDragging);
    slider.addEventListener('pointercancel', stopDragging);
    slider.addEventListener('pointerleave', stopDragging);
    window.addEventListener('resize', () => setPosition(currentPosition));
  });
}

function setupContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successMessage = document.getElementById('formSuccess');
  const picker = form.querySelector('[data-service-picker]');
  const pickerButton = form.querySelector('#custServiceToggle');
  const pickerMenu = form.querySelector('#custServiceMenu');
  const pickerSummary = form.querySelector('#custServiceSummary');
  const hiddenServiceField = form.querySelector('#custService');
  const serviceError = form.querySelector('#custServiceError');
  const serviceOptions = picker
    ? Array.from(picker.querySelectorAll('.service-option'))
    : [];

  const getSelectedServices = () =>
    serviceOptions
      .filter((option) => option.checked)
      .map((option) => option.value);

  const setPickerVisibility = (isOpen) => {
    if (!pickerButton || !pickerMenu) return;

    pickerMenu.classList.toggle('hidden', !isOpen);
    pickerButton.setAttribute('aria-expanded', String(isOpen));
  };

  const updateServiceSummary = () => {
    const selectedServices = getSelectedServices();
    if (!pickerSummary || !hiddenServiceField) return;

    hiddenServiceField.value = selectedServices.join(', ');
    pickerSummary.textContent =
      selectedServices.length === 0
        ? 'Select one or more services'
        : selectedServices.length === 1
          ? selectedServices[0]
          : `${selectedServices.length} services selected`;

    pickerSummary.classList.toggle(
      'text-slate-400',
      selectedServices.length === 0,
    );
    pickerSummary.classList.toggle(
      'text-white',
      selectedServices.length > 0,
    );
    serviceError?.classList.add('hidden');
  };

  if (picker && pickerButton && pickerMenu) {
    pickerButton.addEventListener('click', () => {
      setPickerVisibility(pickerMenu.classList.contains('hidden'));
    });

    serviceOptions.forEach((option) => {
      option.addEventListener('change', updateServiceSummary);
    });

    document.addEventListener('click', (event) => {
      if (!picker.contains(event.target)) setPickerVisibility(false);
    });

    pickerButton.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setPickerVisibility(false);
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const selectedServices = getSelectedServices();
    if (selectedServices.length === 0) {
      serviceError?.classList.remove('hidden');
      setPickerVisibility(true);
      pickerButton?.focus();
      return;
    }

    const getValue = (id) => document.getElementById(id)?.value.trim() || '';
    const message = [
      'Hi Zmart Coatz,',
      '',
      `My Name: ${getValue('custName')}`,
      `Phone: ${getValue('custPhone')}`,
      `Location: ${getValue('custLocation')}`,
      `Services: ${selectedServices.join(', ')}`,
      `Details: ${getValue('custNotes')}`,
    ].join('\n');

    successMessage?.classList.remove('hidden');

    window.setTimeout(() => {
      const whatsappUrl =
        `https://wa.me/919946261343?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener');
    }, 1200);
  });
}