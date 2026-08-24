/**
 * STAVPAS™ Main Application Controller
 * Handles header scroll, FAQ accordion, lead modals, and toast notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Initialize Header Scroll Shadow
  initHeaderScroll();
});

function initHeaderScroll() {
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('shadow-card', 'bg-white/95');
    } else {
      header.classList.remove('shadow-card', 'bg-white/95');
    }
  });
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

function toggleFaq(button) {
  const item = button.closest('.faq-item');
  const content = item.querySelector('.faq-content');
  const chevron = item.querySelector('[data-lucide="chevron-down"]');

  const isHidden = content.classList.contains('hidden');

  document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
  document.querySelectorAll('.faq-item [data-lucide="chevron-down"]').forEach(ch => ch.style.transform = 'rotate(0deg)');

  if (isHidden) {
    content.classList.remove('hidden');
    if (chevron) chevron.style.transform = 'rotate(180deg)';
  }
}

function openLeadModal(sourceTitle = 'Poptávka', prefilledNote = '') {
  const modal = document.getElementById('lead-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    const heading = document.getElementById('modal-heading');
    const notesInput = document.getElementById('modal-form-notes');

    if (heading && sourceTitle) heading.innerText = `Nezávazná poptávka (${sourceTitle})`;
    if (notesInput && prefilledNote) notesInput.value = prefilledNote;
  }
}

function closeLeadModal() {
  const modal = document.getElementById('lead-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function handleLeadSubmit(event) {
  event.preventDefault();

  const nameInput = event.target.querySelector('input[type="text"]');
  const name = nameInput ? nameInput.value : 'Vážený zákazníku';

  closeLeadModal();
  confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });

  showToast(`🎉 Děkujeme, ${name}! Vaše poptávka byla úspěšně odeslána. Brzy vás budeme kontaktovat.`, 'success');
  event.target.reset();
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const typeStyles = {
    info: 'bg-white border-slate-200 text-slate-900 shadow-card',
    success: 'bg-white border-emerald-300 text-emerald-950 shadow-card',
    warning: 'bg-white border-amber-300 text-amber-950 shadow-card'
  };

  toast.className = `p-4 rounded-2xl border backdrop-blur-md text-xs font-mono toast-slide-in pointer-events-auto max-w-sm flex items-start gap-3 ${typeStyles[type] || typeStyles.info}`;

  const iconMap = {
    info: 'info',
    success: 'check-circle-2',
    warning: 'alert-triangle'
  };

  const iconColor = {
    info: 'text-slate-700',
    success: 'text-emerald-600',
    warning: 'text-amber-600'
  };

  toast.innerHTML = `
    <i data-lucide="${iconMap[type] || 'info'}" class="w-4 h-4 flex-shrink-0 mt-0.5 ${iconColor[type] || 'text-slate-700'}"></i>
    <div class="flex-1 leading-snug font-medium text-slate-800">${message}</div>
  `;

  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.classList.remove('toast-slide-in');
    toast.classList.add('toast-slide-out');
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}
