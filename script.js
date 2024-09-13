document.getElementById('truthTableForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const expression = document.getElementById('expression').value.trim();
    if (!expression) return;

    const tableBody = document.querySelector('#truthTable tbody');
    tableBody.innerHTML = ''; // Clear previous results

    // Generate all combinations of p, q, and r
    const combinations = [
        { p: 'T', q: 'T', r: 'T' },
        { p: 'T', q: 'T', r: 'F' },
        { p: 'T', q: 'F', r: 'T' },
        { p: 'T', q: 'F', r: 'F' },
        { p: 'F', q: 'T', r: 'T' },
        { p: 'F', q: 'T', r: 'F' },
        { p: 'F', q: 'F', r: 'T' },
        { p: 'F', q: 'F', r: 'F' }
    ];

    // Track the minterms and maxterms
    let minterms = [];
    let maxterms = [];

    // Evaluate the expression for each combination
    combinations.forEach(({ p, q, r }) => {
        const result = evaluateExpression(expression, { p, q, r });
        const row = `<tr>
            <td>${p}</td>
            <td>${q}</td>
            <td>${r}</td>
            <td>${result}</td>
        </tr>`;
        tableBody.innerHTML += row;

        // Add to minterms or maxterms based on result
        if (result === 'T') {
            minterms.push({ p, q, r });
        } else {
            maxterms.push({ p, q, r });
        }
    });

    document.getElementById('truthTable').classList.remove('hidden');

    // Compute PDNF and CDNF
    const pdnf = computePDNF(minterms);
    const cdnf = computeCDNF(maxterms);

    document.getElementById('pdnf').textContent = ` ${pdnf}`;
    document.getElementById('pcnf').textContent = ` ${cdnf}`;
});

function evaluateExpression(expression, values) {
    // Replace variables with their values
    const substituted = expression
        .replace(/p/g, values.p)
        .replace(/q/g, values.q)
        .replace(/r/g, values.r);

    // Evaluate logical operations
    try {
        var output = new Function('return ' + parseBooleanExpression(substituted))();
        if (output === true) return 'T';
        else return 'F';
    } catch (e) {
        return 'Invalid Expression';
    }
}

function parseBooleanExpression(expr) {
    // Replace operators with JavaScript equivalents
    return expr
        .replace(/T/g, 'true')
        .replace(/F/g, 'false')
        .replace(/\!/g, '!')
        .replace(/\^/g, '&&')
        .replace(/v/g, '||')
        .replace(/\~/g, '!');
}

function computePDNF(minterms) {
    return minterms.map(({ p, q, r }) => {
        return `(${p === 'T' ? 'p' : '~p'}^${q === 'T' ? 'q' : '~q'}^${r === 'T' ? 'r' : '~r'})`;
    }).join('v');
}

function computeCDNF(maxterms) {
    return maxterms.map(({ p, q, r }) => {
        return `(${p === 'T' ? '~p' : 'p'}v${q === 'T' ? '~q' : 'q'}v${r === 'T' ? '~r' : 'r'})`;
    }).join('^');
}