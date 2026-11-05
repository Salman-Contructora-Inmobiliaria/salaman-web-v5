/* ==========================================================================
   SALMAN — Calculadora financiera con amortización francesa (ui/calculator.js)
   ========================================================================== */
(() => {
  'use strict';

  const S = (window.SALMAN = window.SALMAN || {});
  const { $, $$, num, money, track } = S;

  function updateCalc() {
    const price = Number($('#calcValue')?.value || 1180);
    const down = Number($('#calcDown')?.value || 20);
    const years = Number($('#calcYears')?.value || 20);
    const rate = Number($('#calcRate')?.value || 10.5);
    const financed = price * (1 - down / 100);
    const monthlyRate = rate / 100 / 12;
    const n = years * 12;
    const monthly = monthlyRate > 0
      ? (financed * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n))
      : financed / n;

    const set = (id, value) => {
      const el = $(id);
      if (el) el.textContent = value;
    };
    set('#calcValueOut', money(price));
    set('#calcDownOut', `${down}%`);
    set('#calcYearsOut', `${years} ${S.t('calc.yearsUnit')}`);
    set('#calcRateOut', `${num(rate.toFixed(1))}%`);
    set('#calcMonthly', `$${num(monthly.toFixed(1))} M`);
    set('#calcFinanced', `$${num(Math.round(financed))} M`);
  }

  function initCalcTracking() {
    let timer;
    $$('#calcValue, #calcDown, #calcYears, #calcRate').forEach((input) => {
      input.addEventListener('input', () => {
        updateCalc();
        clearTimeout(timer);
        timer = setTimeout(() => track('calculator_use'), 900);
      });
    });
  }

  Object.assign(S, {
    updateCalc,
    initCalcTracking
  });
})();
