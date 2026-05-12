/**
 * Anime Scientific Calculator
 */
(function () {
    'use strict';

    const expressionEl = document.getElementById('expression');
    const resultEl = document.getElementById('result');
    const modeLabelEl = document.getElementById('modeLabel');
    const modeBtnEl = document.getElementById('modeBtn');
    const memoryLabelEl = document.getElementById('memoryLabel');
    const secondBtnEl = document.getElementById('secondBtn');
    const leftMsg = document.getElementById('leftMessage');
    const rightMsg = document.getElementById('rightMessage');

    let expression = '';
    let lastResult = null;
    let degreeMode = true;
    let memory = 0;
    let isSecondMode = false;
    let justEvaluated = false;

    const animeMessages = {
        clear: ["Fresh start!", "All clean~", "Let's go again!", "Reset desu!"],
        equals: ["Sugoi!", "Calculated!", "Here you go~", "Yatta!", "Perfect!"],
        error: ["Eh?! Error!", "That's wrong...", "Try again~", "Nani?!"],
        number: ["Nice~", "Keep going!", "Hmm...", "Interesting~"],
        scientific: ["So smart!", "Big brain~", "Science!", "Sugoi math!"],
        memory: ["Remembered!", "Saved it~", "Got it!", "Stored!"]
    };

    function getRandomMessage(category) {
        const msgs = animeMessages[category];
        return msgs[Math.floor(Math.random() * msgs.length)];
    }

    function updateCharacterMessages(category) {
        const msg = getRandomMessage(category);
        const target = Math.random() > 0.5 ? leftMsg : rightMsg;
        target.textContent = msg;
        target.parentElement.style.animation = 'none';
        void target.parentElement.offsetWidth;
        target.parentElement.style.animation = 'bubblePop 0.4s ease';
    }

    function updateDisplay() {
        const displayText = expression || '0';
        expressionEl.textContent = displayText;

        if (displayText.length > 20) {
            expressionEl.style.fontSize = '1.1rem';
        } else if (displayText.length > 14) {
            expressionEl.style.fontSize = '1.3rem';
        } else {
            expressionEl.style.fontSize = '1.6rem';
        }

        if (expression && !justEvaluated) {
            try {
                const preview = evaluate(expression);
                if (preview !== null && !isNaN(preview) && isFinite(preview)) {
                    resultEl.textContent = '= ' + formatNumber(preview);
                    resultEl.classList.remove('final');
                } else {
                    resultEl.textContent = '';
                }
            } catch {
                resultEl.textContent = '';
            }
        }
    }

    function formatNumber(num) {
        if (Number.isInteger(num) && Math.abs(num) < 1e15) {
            return num.toLocaleString('en-US');
        }
        if (Math.abs(num) < 0.0001 || Math.abs(num) >= 1e15) {
            return num.toExponential(8);
        }
        return parseFloat(num.toPrecision(12)).toString();
    }

    function factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        if (n > 170) return Infinity;
        if (!Number.isInteger(n)) return gamma(n + 1);
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    function gamma(z) {
        if (z < 0.5) {
            return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
        }
        z -= 1;
        const g = 7;
        const c = [
            0.99999999999980993, 676.5203681218851, -1259.1392167224028,
            771.32342877765313, -176.61502916214059, 12.507343278686905,
            -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
        ];
        let x = c[0];
        for (let i = 1; i < g + 2; i++) {
            x += c[i] / (z + i);
        }
        const t = z + g + 0.5;
        return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
    }

    function toRad(deg) {
        return deg * (Math.PI / 180);
    }

    function toDeg(rad) {
        return rad * (180 / Math.PI);
    }

    function evaluate(expr) {
        let processed = expr
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-')
            .replace(/π/g, '(' + Math.PI + ')')
            .replace(/e(?![xp])/g, '(' + Math.E + ')');

        processed = processed.replace(/(\d+(?:\.\d+)?)!/g, function (_, n) {
            return 'factorial(' + n + ')';
        });

        processed = processed.replace(/sin⁻¹\(/g, 'asin(');
        processed = processed.replace(/cos⁻¹\(/g, 'acos(');
        processed = processed.replace(/tan⁻¹\(/g, 'atan(');

        const safeFunctions = {
            sin: function (x) { return Math.sin(degreeMode ? toRad(x) : x); },
            cos: function (x) { return Math.cos(degreeMode ? toRad(x) : x); },
            tan: function (x) { return Math.tan(degreeMode ? toRad(x) : x); },
            asin: function (x) { var r = Math.asin(x); return degreeMode ? toDeg(r) : r; },
            acos: function (x) { var r = Math.acos(x); return degreeMode ? toDeg(r) : r; },
            atan: function (x) { var r = Math.atan(x); return degreeMode ? toDeg(r) : r; },
            log: Math.log10,
            ln: Math.log,
            sqrt: Math.sqrt,
            abs: Math.abs,
            factorial: factorial
        };

        try {
            const func = new Function(
                ...Object.keys(safeFunctions),
                'return (' + processed + ');'
            );
            return func(...Object.values(safeFunctions));
        } catch {
            return null;
        }
    }

    function addSparkle(button) {
        button.classList.remove('sparkle');
        void button.offsetWidth;
        button.classList.add('sparkle');
    }

    function handleNumber(value) {
        if (justEvaluated) {
            expression = '';
            justEvaluated = false;
            resultEl.textContent = '';
            resultEl.classList.remove('final');
        }
        expression += value;
        updateDisplay();
    }

    function handleOperator(op) {
        if (justEvaluated) {
            expression = lastResult !== null ? formatNumber(lastResult).replace(/,/g, '') : '';
            justEvaluated = false;
            resultEl.textContent = '';
            resultEl.classList.remove('final');
        }
        const last = expression.slice(-1);
        if (['+', '-', '*', '/'].includes(last)) {
            expression = expression.slice(0, -1);
        }
        expression += op;
        updateDisplay();
    }

    function handleFunction(func) {
        if (justEvaluated) {
            expression = '';
            justEvaluated = false;
            resultEl.textContent = '';
            resultEl.classList.remove('final');
        }

        if (func === 'factorial') {
            expression += '!';
        } else if (func === 'abs') {
            expression += 'abs(';
        } else if (func === 'asin') {
            expression += 'sin\u207B\u00B9(';
        } else if (func === 'acos') {
            expression += 'cos\u207B\u00B9(';
        } else if (func === 'atan') {
            expression += 'tan\u207B\u00B9(';
        } else {
            expression += func + '(';
        }
        updateDisplay();
        updateCharacterMessages('scientific');
    }

    function handlePower(power) {
        if (justEvaluated) {
            expression = lastResult !== null ? formatNumber(lastResult).replace(/,/g, '') : '';
            justEvaluated = false;
            resultEl.textContent = '';
            resultEl.classList.remove('final');
        }
        expression += '**' + power;
        updateDisplay();
        updateCharacterMessages('scientific');
    }

    function handlePowerN() {
        if (justEvaluated) {
            expression = lastResult !== null ? formatNumber(lastResult).replace(/,/g, '') : '';
            justEvaluated = false;
            resultEl.textContent = '';
            resultEl.classList.remove('final');
        }
        expression += '**';
        updateDisplay();
    }

    function handleEquals() {
        if (!expression) return;

        const result = evaluate(expression);
        if (result !== null && !isNaN(result) && isFinite(result)) {
            lastResult = result;
            resultEl.textContent = '= ' + formatNumber(result);
            resultEl.classList.add('final');
            justEvaluated = true;
            updateCharacterMessages('equals');
        } else {
            expressionEl.classList.add('display-error');
            setTimeout(function () {
                expressionEl.classList.remove('display-error');
            }, 500);
            resultEl.textContent = 'Error';
            updateCharacterMessages('error');
        }
    }

    function handleClear() {
        expression = '';
        lastResult = null;
        justEvaluated = false;
        resultEl.textContent = '';
        resultEl.classList.remove('final');
        updateDisplay();
        updateCharacterMessages('clear');
    }

    function handleBackspace() {
        if (justEvaluated) {
            handleClear();
            return;
        }
        const funcPatterns = ['sin(', 'cos(', 'tan(', 'log(', 'ln(', 'sqrt(', 'abs(',
            'sin\u207B\u00B9(', 'cos\u207B\u00B9(', 'tan\u207B\u00B9('];
        for (const pattern of funcPatterns) {
            if (expression.endsWith(pattern)) {
                expression = expression.slice(0, -pattern.length);
                updateDisplay();
                return;
            }
        }
        expression = expression.slice(0, -1);
        updateDisplay();
    }

    function handleDecimal() {
        if (justEvaluated) {
            expression = '0';
            justEvaluated = false;
            resultEl.textContent = '';
            resultEl.classList.remove('final');
        }
        const parts = expression.split(/[\+\-\*\/\(]/);
        const lastPart = parts[parts.length - 1];
        if (!lastPart.includes('.')) {
            if (!lastPart || lastPart === '') {
                expression += '0.';
            } else {
                expression += '.';
            }
        }
        updateDisplay();
    }

    function handleNegate() {
        if (justEvaluated && lastResult !== null) {
            expression = String(-lastResult);
            justEvaluated = false;
            resultEl.textContent = '';
            resultEl.classList.remove('final');
            updateDisplay();
            return;
        }
        if (expression.startsWith('-')) {
            expression = expression.slice(1);
        } else if (expression) {
            expression = '-' + expression;
        }
        updateDisplay();
    }

    function handleParen(paren) {
        if (justEvaluated) {
            if (paren === '(') {
                expression = '';
                justEvaluated = false;
                resultEl.textContent = '';
                resultEl.classList.remove('final');
            } else {
                return;
            }
        }
        expression += paren;
        updateDisplay();
    }

    function handlePercent() {
        if (expression) {
            try {
                const result = evaluate(expression);
                if (result !== null && !isNaN(result) && isFinite(result)) {
                    expression = String(result / 100);
                    updateDisplay();
                }
            } catch { /* ignore */ }
        }
    }

    function handleConst(value) {
        if (justEvaluated) {
            expression = '';
            justEvaluated = false;
            resultEl.textContent = '';
            resultEl.classList.remove('final');
        }
        if (value === 'pi') {
            expression += '\u03C0';
        } else if (value === 'e') {
            expression += 'e';
        }
        updateDisplay();
        updateCharacterMessages('scientific');
    }

    function toggleMode() {
        degreeMode = !degreeMode;
        const label = degreeMode ? 'DEG' : 'RAD';
        modeLabelEl.textContent = label;
        modeBtnEl.textContent = label;
    }

    function toggleSecond() {
        isSecondMode = !isSecondMode;
        secondBtnEl.classList.toggle('active', isSecondMode);

        const normalBtns = document.querySelectorAll('.btn-sci[data-func="sin"], .btn-sci[data-func="cos"], .btn-sci[data-func="tan"]');
        const inverseBtns = document.querySelectorAll('.btn-sci[data-second]');

        normalBtns.forEach(function (btn) {
            btn.style.display = isSecondMode ? 'none' : '';
        });
        inverseBtns.forEach(function (btn) {
            btn.style.display = isSecondMode ? '' : 'none';
        });
    }

    function handleMemory(action) {
        switch (action) {
            case 'mc':
                memory = 0;
                memoryLabelEl.style.display = 'none';
                break;
            case 'mr':
                if (justEvaluated) {
                    expression = '';
                    justEvaluated = false;
                    resultEl.textContent = '';
                    resultEl.classList.remove('final');
                }
                expression += String(memory);
                updateDisplay();
                break;
            case 'm+':
                if (lastResult !== null) {
                    memory += lastResult;
                } else {
                    const result = evaluate(expression);
                    if (result !== null && !isNaN(result)) {
                        memory += result;
                    }
                }
                memoryLabelEl.style.display = memory !== 0 ? '' : 'none';
                break;
        }
        updateCharacterMessages('memory');
    }

    // Event delegation
    document.querySelector('.button-grid').addEventListener('click', function (e) {
        const btn = e.target.closest('.btn');
        if (!btn) return;

        addSparkle(btn);

        const action = btn.dataset.action;

        switch (action) {
            case 'number':
                handleNumber(btn.dataset.value);
                if (Math.random() > 0.7) updateCharacterMessages('number');
                break;
            case 'operator':
                handleOperator(btn.dataset.value);
                break;
            case 'func':
                handleFunction(btn.dataset.func);
                break;
            case 'power':
                handlePower(btn.dataset.power);
                break;
            case 'powerN':
                handlePowerN();
                break;
            case 'equals':
                handleEquals();
                break;
            case 'clear':
                handleClear();
                break;
            case 'backspace':
                handleBackspace();
                break;
            case 'decimal':
                handleDecimal();
                break;
            case 'negate':
                handleNegate();
                break;
            case 'paren':
                handleParen(btn.dataset.value);
                break;
            case 'percent':
                handlePercent();
                break;
            case 'const':
                handleConst(btn.dataset.value);
                break;
            case 'toggleMode':
                toggleMode();
                break;
            case 'second':
                toggleSecond();
                break;
            case 'memory':
                handleMemory(btn.dataset.mem);
                break;
        }
    });

    // Keyboard support
    document.addEventListener('keydown', function (e) {
        const key = e.key;

        if (key >= '0' && key <= '9') {
            handleNumber(key);
        } else if (key === '+') {
            handleOperator('+');
        } else if (key === '-') {
            handleOperator('-');
        } else if (key === '*') {
            handleOperator('*');
        } else if (key === '/') {
            e.preventDefault();
            handleOperator('/');
        } else if (key === 'Enter' || key === '=') {
            e.preventDefault();
            handleEquals();
        } else if (key === 'Backspace') {
            handleBackspace();
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            handleClear();
        } else if (key === '.') {
            handleDecimal();
        } else if (key === '(' || key === ')') {
            handleParen(key);
        } else if (key === '%') {
            handlePercent();
        }
    });

    // Initialize display
    updateDisplay();
})();
