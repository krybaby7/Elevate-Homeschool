import { createBubbleMotion } from './bubble-motion.mjs';

const topicColours = {
  interests: '#2f68df',
  curriculum: '#ff8d72',
  guidance: '#42bfd1',
  future: '#d7ad42',
};

let topicContent = {
  interests: {
    title: 'Start with the student',
    text: 'We begin with your child’s strengths, interests and future goals.',
  },
  curriculum: {
    title: 'Shape the right programme',
    text: 'A flexible American curriculum becomes a clear, personal learning plan.',
  },
  guidance: {
    title: 'Never just a number',
    text: 'Small groups and close mentoring keep every student seen and supported.',
  },
  future: {
    title: 'Move forward with confidence',
    text: 'Diploma credits, SAT focus and university planning stay connected. We help every student work toward a strong GPA.',
  },
};

function initMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');

  if (!toggle || !links) {
    return;
  }

  const setOpen = (open) => {
    links.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-nav')) {
      setOpen(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) {
      setOpen(false);
    }
  });
}

function initTopicDisclosures() {
  const buttons = [...document.querySelectorAll('.topic-bubble')];
  const popover = document.querySelector('#topic-popover');
  const title = document.querySelector('#popover-title');
  const text = document.querySelector('#popover-text');
  const accent = popover?.querySelector('.popover-accent');
  const closeButton = popover?.querySelector('.popover-close');
  let activeKey = null;
  let activeButton = null;

  if (!popover || !title || !text || !accent) {
    return;
  }

  const close = ({ returnFocus = false } = {}) => {
    const previousButton = activeButton;
    activeKey = null;
    activeButton = null;
    buttons.forEach((button) => {
      button.classList.remove('active');
      button.style.opacity = '1';
      button.setAttribute('aria-expanded', 'false');
    });
    popover.classList.remove('open');
    popover.setAttribute('aria-hidden', 'true');
    if (returnFocus) {
      previousButton?.focus();
    }
  };

  buttons.forEach((button) => {
    const key = button.dataset.topic;
    if (key && button.dataset.title && button.dataset.text) {
      topicContent[key] = { title: button.dataset.title, text: button.dataset.text };
    }

    button.addEventListener('click', () => {
      if (!key || !topicContent[key]) {
        return;
      }
      if (activeKey === key) {
        close();
        return;
      }

      activeKey = key;
      activeButton = button;
      buttons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle('active', selected);
        item.style.opacity = selected ? '1' : '.62';
        item.setAttribute('aria-expanded', String(selected));
      });
      title.textContent = topicContent[key].title;
      text.textContent = topicContent[key].text;
      accent.style.background = topicColours[key];
      popover.classList.add('open');
      popover.setAttribute('aria-hidden', 'false');
    });
  });

  closeButton?.addEventListener('click', () => close({ returnFocus: true }));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activeKey) {
      close({ returnFocus: true });
    }
  });
}

function initProcessDisclosures() {
  const steps = [...document.querySelectorAll('.process-step')];
  const detail = document.querySelector('#process-detail');

  if (!detail) {
    return;
  }

  steps.forEach((step) => {
    step.addEventListener('click', () => {
      const opening = step.getAttribute('aria-expanded') !== 'true';
      steps.forEach((item) => item.setAttribute('aria-expanded', 'false'));
      step.setAttribute('aria-expanded', String(opening));
      detail.textContent = opening ? step.dataset.detail : '';
    });
  });
}

function initMotion() {
  const cleanup = createBubbleMotion(
    document.querySelector('.hero'),
    [...document.querySelectorAll('.topic-bubble, .bubble-core')],
    {
      reducedMotion:
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        !window.matchMedia('(pointer: fine)').matches,
    },
  );
  window.addEventListener('pagehide', cleanup, { once: true });
}

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element && value) {
    element.textContent = value;
  }
};

async function hydrateContent() {
  try {
    const response = await fetch('data/homepage.yml', { cache: 'no-cache' });
    if (!response.ok || !window.jsyaml) {
      throw new Error(`Homepage content unavailable (${response.status})`);
    }

    const data = window.jsyaml.load(await response.text());
    document.title = data.seo?.title || document.title;
    if (data.seo?.description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', data.seo.description);
    }

    setText('#hero-kicker', data.hero?.kicker);
    setText('#hero-support', data.hero?.supporting);
    setText('#hero-primary-label', data.hero?.primary_cta);
    setText('#hero-secondary-label', data.hero?.secondary_cta);

    const heading = document.querySelector('#hero-heading');
    if (heading && data.hero?.heading) {
      const emphasis = 'your child.';
      const start = data.hero.heading.endsWith(emphasis)
        ? data.hero.heading.slice(0, -emphasis.length)
        : data.hero.heading;
      heading.replaceChildren(document.createTextNode(start));
      if (start !== data.hero.heading) {
        const span = document.createElement('span');
        span.textContent = emphasis;
        heading.append(span);
      }
    }

    document.querySelectorAll('#proof-points span').forEach((item, index) => {
      if (data.hero?.proof_points?.[index]) {
        item.textContent = data.hero.proof_points[index];
      }
    });

    data.hero?.topics?.forEach((topic) => {
      const button = document.querySelector(`[data-topic="${topic.key}"]`);
      if (button) {
        button.textContent = topic.label;
        button.dataset.title = topic.title;
        button.dataset.text = topic.text;
      }
      topicContent[topic.key] = { title: topic.title, text: topic.text };
    });

    setText('.benefits .section-eyebrow', data.benefits?.eyebrow);
    setText('.benefits h2', data.benefits?.heading);
    const benefits = document.querySelectorAll('.benefit');
    data.benefits?.items?.forEach((item, index) => {
      benefits[index]?.querySelector('h3')?.replaceChildren(item.title);
      benefits[index]?.querySelector('p')?.replaceChildren(item.text);
    });

    setText('.process .section-eyebrow', data.process?.eyebrow);
    setText('.process h2', data.process?.heading);
    const processSteps = document.querySelectorAll('.process-step');
    data.process?.steps?.forEach((item, index) => {
      processSteps[index]?.querySelector('strong')?.replaceChildren(item.title);
      if (processSteps[index]) {
        processSteps[index].dataset.detail = item.text;
      }
    });

    setText('.visit .section-eyebrow', data.visit?.eyebrow);
    setText('.visit h2', data.visit?.heading);
    setText('.visit-layout > div > p:last-child', data.visit?.text);
    setText('.visit-form h3', data.visit?.form_heading);
    setText('#visit-submit-label', data.visit?.submit_text);
    setText('#tuition-guide-label', data.visit?.tuition_guide_text);
  } catch (error) {
    console.warn('Homepage content fallback is active.', error);
  }
}

function initVisitForm() {
  const form = document.querySelector('.visit-form');
  const status = form?.querySelector('.form-status');
  const submit = form?.querySelector('button[type="submit"]');

  if (!form || !status || !submit) {
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) {
      return;
    }

    submit.disabled = true;
    status.textContent = 'Sending your request…';
    status.className = 'form-status full sending';

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      if (!response.ok) {
        throw new Error(`Form submission failed (${response.status})`);
      }
      form.reset();
      status.textContent = 'Thank you. We will contact you to arrange your private visit.';
      status.className = 'form-status full success';
    } catch (error) {
      console.error(error);
      status.textContent = 'We could not send your request. Please try again or contact us directly.';
      status.className = 'form-status full error';
    } finally {
      submit.disabled = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initTopicDisclosures();
  initProcessDisclosures();
  initMotion();
  initVisitForm();
  hydrateContent();
});
