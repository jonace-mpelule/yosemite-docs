function highlightJSON(json) {
    // Escape HTML special characters
    function escapeHtml(html) {
        return html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // Apply syntax highlighting with indentation
    function highlight(value, indent = 0) {
        const indentation = ' '.repeat(indent);

        if (typeof value === 'object' && value !== null) {
            if (Array.isArray(value)) {
                return `[${value.map(val => `\n${indentation}  ${highlight(val, indent + 2)}`).join(', ')}\n${indentation}]`;
            } else {
                return `{${Object.entries(value).map(([key, val]) =>
                    `\n${indentation}  <span class="json-key">"${escapeHtml(key)}"</span>: ${highlight(val, indent + 2)}`
                ).join(', ')}\n${indentation}}`;
            }
        } else if (typeof value === 'string') {
            return `<span class="json-string">"${escapeHtml(value)}"</span>`;
        } else if (typeof value === 'boolean') {
            return `<span class="json-boolean">${value}</span>`;
        } else if (typeof value === 'number') {
            return `<span class="json-number">${value}</span>`;
        } else if (value === null) {
            return `<span class="json-null">null</span>`;
        } else {
            return escapeHtml(value.toString());
        }
    }
    return highlight(json);
}

document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.endpoint').forEach(endpoint => {
        const codeBlock = endpoint.querySelectorAll('#code-block').forEach(codeBlock => {
            var jsonData = JSON.parse(codeBlock.innerText);
            codeBlock.innerHTML = highlightJSON(jsonData);
        })
    })
});
