/**
 * STAVPAS™ Authentic Pricing Configurator
 * Calculations strictly based on official Stavpas pricing:
 * - Rodinné domy & chaty: 50–100 Kč / m² (min. 5 000 Kč)
 * - Garáže a drobné stavby: od 1 500 Kč
 * - Bytové a komerční objekty: 45–70 Kč / m²
 */

class StavpasCalculator {
  constructor() {
    this.buildingType = 'rd'; // 'rd' | 'chata' | 'bytovka' | 'garaz'
    this.area = 180;
    this.init();
  }

  init() {
    this.calculate();
  }

  setBuildingType(type) {
    this.buildingType = type;
    document.querySelectorAll('.calc-btype-btn').forEach(btn => {
      if (btn.getAttribute('data-btype') === type) {
        btn.classList.add('active', 'bg-white', 'text-slate-900');
        btn.classList.remove('bg-slate-800', 'text-slate-300');
      } else {
        btn.classList.remove('active', 'bg-white', 'text-slate-900');
        btn.classList.add('bg-slate-800', 'text-slate-300');
      }
    });
    this.calculate();
  }

  setArea(areaVal) {
    this.area = parseInt(areaVal, 10);
    const display = document.getElementById('calc-area-display');
    if (display) display.innerText = this.area.toLocaleString('cs-CZ');
    this.calculate();
  }

  calculate() {
    let ratePerM2 = 70;
    let minPrice = 5000;

    if (this.buildingType === 'rd') {
      ratePerM2 = 70; // 50 - 100 Kč/m²
      minPrice = 5000;
    } else if (this.buildingType === 'chata') {
      ratePerM2 = 65;
      minPrice = 5000;
    } else if (this.buildingType === 'bytovka') {
      ratePerM2 = 50;
      minPrice = 12000;
    } else if (this.buildingType === 'garaz') {
      ratePerM2 = 45;
      minPrice = 1500;
    }

    let calculatedPrice = Math.max(minPrice, this.area * ratePerM2);
    const finalPrice = Math.round(calculatedPrice / 100) * 100;

    const priceEl = document.getElementById('calc-final-price');
    if (priceEl) priceEl.innerText = `${finalPrice.toLocaleString('cs-CZ')} Kč`;

    return {
      finalPrice,
      ratePerM2,
      minPrice,
      buildingType: this.buildingType,
      area: this.area
    };
  }
}

// Global Calculator Instance
window.calculator = null;

function setCalcBuildingType(type) {
  if (window.calculator) {
    window.calculator.setBuildingType(type);
    updateBothCalculators();
  }
}

function updateCalculatorMath() {
  const slider = document.getElementById('calc-area-slider');
  if (slider && window.calculator) {
    const val = slider.value;
    window.calculator.setArea(val);
    
    // Sync hero slider if present
    const heroSlider = document.getElementById('hero-calc-slider');
    const heroArea = document.getElementById('hero-calc-area-display');
    const heroPrice = document.getElementById('hero-calc-price-display');
    const calcData = window.calculator.calculate();

    if (heroSlider) heroSlider.value = val;
    if (heroArea) heroArea.innerText = parseInt(val, 10).toLocaleString('cs-CZ');
    if (heroPrice) heroPrice.innerText = `${calcData.finalPrice.toLocaleString('cs-CZ')} Kč`;
  }
}

function syncHeroCalculator(val) {
  const area = parseInt(val, 10);
  const heroArea = document.getElementById('hero-calc-area-display');
  const heroPrice = document.getElementById('hero-calc-price-display');

  if (heroArea) heroArea.innerText = area.toLocaleString('cs-CZ');

  if (window.calculator) {
    window.calculator.setArea(area);
    const calcData = window.calculator.calculate();
    if (heroPrice) heroPrice.innerText = `${calcData.finalPrice.toLocaleString('cs-CZ')} Kč`;

    // Also sync main section slider
    const mainSlider = document.getElementById('calc-area-slider');
    const mainArea = document.getElementById('calc-area-display');
    if (mainSlider) mainSlider.value = area;
    if (mainArea) mainArea.innerText = area.toLocaleString('cs-CZ');
  }
}

function updateBothCalculators() {
  if (!window.calculator) return;
  const calcData = window.calculator.calculate();
  const heroPrice = document.getElementById('hero-calc-price-display');
  if (heroPrice) heroPrice.innerText = `${calcData.finalPrice.toLocaleString('cs-CZ')} Kč`;
}

function requestQuoteFromHero() {
  const calcData = window.calculator ? window.calculator.calculate() : null;
  const note = `Poptávka z kalkulačky v úvodu: ${window.calculator ? window.calculator.area : 160} m², odhad ${calcData ? calcData.finalPrice : 11200} Kč`;
  openLeadModal('Kalkulačka v úvodu', note);
}

function requestQuoteFromCalculator() {
  const calcData = window.calculator ? window.calculator.calculate() : null;
  const note = `Poptávka pasportu z kalkulačky: ${window.calculator.buildingType.toUpperCase()}, ${window.calculator.area} m², odhad ${calcData ? calcData.finalPrice : ''} Kč`;
  openLeadModal('Kalkulačka', note);
}

document.addEventListener('DOMContentLoaded', () => {
  window.calculator = new StavpasCalculator();
  updateCalculatorMath();
  if (document.getElementById('hero-calc-slider')) {
    syncHeroCalculator(document.getElementById('hero-calc-slider').value);
  }
});
