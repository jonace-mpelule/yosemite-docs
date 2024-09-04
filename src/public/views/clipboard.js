document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const code = btn.previousElementSibling.textContent;
        navigator.clipboard.writeText(code);
        alert('Copied to clipboard');
    });
});

