
document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if(themeToggle) themeToggle.textContent = '☀️';
    } else {
        if(themeToggle) themeToggle.textContent = '🌙';
    }
    
    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeToggle.textContent = '🌙';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeToggle.textContent = '☀️';
            }
        });
    }

    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    checkboxes.forEach(box => {
        const isChecked = localStorage.getItem(box.id) === 'true';
        box.checked = isChecked;
        
        box.addEventListener('change', (e) => {
            localStorage.setItem(e.target.id, e.target.checked);
        });
    });

    const preElements = document.querySelectorAll('pre:not(.mermaid)');
    preElements.forEach(pre => {
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = 'Copy Code';
        
        copyBtn.addEventListener('click', () => {
            const codeEl = pre.querySelector('code');
            const codeText = codeEl ? codeEl.innerText : pre.innerText;
            
            const fallbackCopyTextToClipboard = (text) => {
                var textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.top = "0";
                textArea.style.left = "0";
                textArea.style.position = "fixed";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                } catch (err) {
                    console.error('Fallback: Oops, unable to copy', err);
                }
                document.body.removeChild(textArea);
            };

            const changeBtnState = () => {
                copyBtn.textContent = 'Copied! ✓';
                copyBtn.style.background = '#22c55e';
                copyBtn.style.color = '#fff';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy Code';
                    copyBtn.style.background = 'var(--aws-orange)';
                    copyBtn.style.color = '#111';
                }, 2000);
            };

            if (!navigator.clipboard) {
                fallbackCopyTextToClipboard(codeText);
                changeBtnState();
            } else {
                navigator.clipboard.writeText(codeText).then(() => {
                    changeBtnState();
                }).catch(err => {
                    fallbackCopyTextToClipboard(codeText);
                    changeBtnState();
                });
            }
        });
        
        wrapper.appendChild(copyBtn);
    });

    const typewriters = document.querySelectorAll('.typewriter');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (!el.classList.contains('typed')) {
                    const text = el.textContent;
                    el.textContent = '';
                    el.classList.add('typed');
                    
                    let i = 0;
                    function type() {
                        if (i < text.length) {
                            el.textContent += text.charAt(i);
                            i++;
                            setTimeout(type, 10);
                        }
                    }
                    type();
                }
            }
        });
    }, { threshold: 0.5 });

    typewriters.forEach(tw => observer.observe(tw));

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});
