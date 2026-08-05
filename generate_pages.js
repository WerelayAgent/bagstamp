const fs = require('fs');
const path = require('path');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Strip Next.js scripts that break static hydration
// We want to remove <script src="/_next..."></script> and <script>self.__next_f.push(...)</script>
html = html.replace(/<script src="\/_next[^>]+><\/script>/g, '');
html = html.replace(/<script>self\.__next_f\.push[^<]+<\/script>/g, '');
// Also remove the next build manifest scripts
html = html.replace(/<script defer[^>]+><\/script>/g, '');

// 2. Replace the main content
// Let's find the main content block. Usually it's inside <main ...> ... </main>
// We'll use a regex to grab from <main to </main>
const mainRegex = /(<main[^>]*>)([\s\S]*?)(<\/main>)/i;

const communityContent = `
<div class="flex flex-col items-center justify-center min-h-[60vh] px-5 py-20 text-center">
    <h1 class="font-display text-[42px] font-semibold tracking-[-0.035em] text-[var(--color-foreground)] mb-4">Community</h1>
    <p class="font-sans text-[16px] leading-[1.5] text-[var(--color-copy-subtle)] max-w-2xl mb-12">
        Join the bagstamp ecosystem. Connect with other builders, propose ideas, and help shape the future of verifiable on-chain bounties.
    </p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full text-left">
        <a href="https://x.com/bagstamp" target="_blank" class="border border-[var(--color-surface-rule-strong)] bg-[var(--color-surface-panel)] p-6 hover:bg-[var(--color-surface-rule)] transition-colors">
            <h3 class="font-display text-[20px] font-semibold text-[var(--color-foreground)] mb-2">Twitter / X</h3>
            <p class="font-sans text-[13px] text-[var(--color-copy-subtle)]">Follow us for the latest announcements, feature updates, and community highlights.</p>
        </a>
        <a href="#" class="border border-[var(--color-surface-rule-strong)] bg-[var(--color-surface-panel)] p-6 hover:bg-[var(--color-surface-rule)] transition-colors">
            <h3 class="font-display text-[20px] font-semibold text-[var(--color-foreground)] mb-2">Discord Server</h3>
            <p class="font-sans text-[13px] text-[var(--color-copy-subtle)]">Chat with the team, ask questions, and collaborate with other developers.</p>
        </a>
        <a href="#" class="border border-[var(--color-surface-rule-strong)] bg-[var(--color-surface-panel)] p-6 hover:bg-[var(--color-surface-rule)] transition-colors">
            <h3 class="font-display text-[20px] font-semibold text-[var(--color-foreground)] mb-2">Developer Forum</h3>
            <p class="font-sans text-[13px] text-[var(--color-copy-subtle)]">Deep technical discussions, feature requests, and API support.</p>
        </a>
        <a href="#" class="border border-[var(--color-surface-rule-strong)] bg-[var(--color-surface-panel)] p-6 hover:bg-[var(--color-surface-rule)] transition-colors">
            <h3 class="font-display text-[20px] font-semibold text-[var(--color-foreground)] mb-2">GitHub Discussions</h3>
            <p class="font-sans text-[13px] text-[var(--color-copy-subtle)]">Contribute to open source bounties and submit PRs for community review.</p>
        </a>
    </div>
</div>
`;

const proposalsContent = `
<div class="flex flex-col items-center justify-center min-h-[60vh] px-5 py-20 text-center">
    <h1 class="font-display text-[42px] font-semibold tracking-[-0.035em] text-[var(--color-foreground)] mb-4">Proposals</h1>
    <p class="font-sans text-[16px] leading-[1.5] text-[var(--color-copy-subtle)] max-w-2xl mb-12">
        Governance and active bounties. Vote on protocol upgrades or apply for available funding pools.
    </p>
    
    <div class="max-w-4xl w-full text-left border border-[var(--color-surface-rule-strong)] bg-[var(--color-surface-panel)]">
        <div class="grid grid-cols-[1fr_auto] gap-4 p-5 border-b border-[var(--color-surface-rule-strong)] items-center">
            <div>
                <span class="inline-block px-2 py-1 mb-2 font-mono text-[9px] uppercase tracking-[0.14em] bg-[var(--color-proof)] text-[var(--color-action-ink)]">Active</span>
                <h3 class="font-display text-[18px] font-semibold text-[var(--color-foreground)]">Integrate Robinhood Chain Native USDC</h3>
            </div>
            <a href="#" class="font-mono text-[11px] text-[var(--color-copy-muted)] hover:text-[var(--color-foreground)]">View Details →</a>
        </div>
        <div class="grid grid-cols-[1fr_auto] gap-4 p-5 border-b border-[var(--color-surface-rule-strong)] items-center">
            <div>
                <span class="inline-block px-2 py-1 mb-2 font-mono text-[9px] uppercase tracking-[0.14em] border border-[var(--color-surface-rule-interactive)] text-[var(--color-copy-subtle)]">Passed</span>
                <h3 class="font-display text-[18px] font-semibold text-[var(--color-foreground)]">Update Bounty Fee Structure (v2)</h3>
            </div>
            <a href="#" class="font-mono text-[11px] text-[var(--color-copy-muted)] hover:text-[var(--color-foreground)]">View Details →</a>
        </div>
        <div class="grid grid-cols-[1fr_auto] gap-4 p-5 items-center">
            <div>
                <span class="inline-block px-2 py-1 mb-2 font-mono text-[9px] uppercase tracking-[0.14em] border border-[var(--color-surface-rule-interactive)] text-[var(--color-copy-subtle)]">Draft</span>
                <h3 class="font-display text-[18px] font-semibold text-[var(--color-foreground)]">Pons Family Ambassador Program</h3>
            </div>
            <a href="#" class="font-mono text-[11px] text-[var(--color-copy-muted)] hover:text-[var(--color-foreground)]">View Details →</a>
        </div>
    </div>
</div>
`;

let communityHtml = html;
let proposalsHtml = html;

if (mainRegex.test(html)) {
    communityHtml = communityHtml.replace(mainRegex, '$1' + communityContent + '$3');
    proposalsHtml = proposalsHtml.replace(mainRegex, '$1' + proposalsContent + '$3');
} else {
    // If no <main> tag, just append it before </body> as a fallback, or replace the first big div
    console.warn("Could not find <main> tag, appending to body");
    communityHtml = communityHtml.replace('</body>', '<div id="custom-page-content">' + communityContent + '</div></body>');
    proposalsHtml = proposalsHtml.replace('</body>', '<div id="custom-page-content">' + proposalsContent + '</div></body>');
}

fs.writeFileSync('community.html', communityHtml);
fs.writeFileSync('proposals.html', proposalsHtml);

// 3. Inject Navbar links into index.html (and the new pages too)
// The injection waits for the DOM and appends links to the navbar if not present.
const navInjection = `
<script>
setInterval(() => {
    // Find the navbar container. In typical Next.js apps, we look for a header or nav tag.
    const navs = document.querySelectorAll('header, nav, .flex.items-center');
    for (let nav of navs) {
        if (nav.innerHTML.includes('bagstamp') && !nav.innerHTML.includes('Community') && nav.clientHeight > 20) {
            // Find the inner link container, usually a flex div next to the logo
            const linksContainers = nav.querySelectorAll('div.flex');
            let targetContainer = null;
            for (let c of linksContainers) {
                if (c.innerHTML.includes('href')) {
                    targetContainer = c;
                    break;
                }
            }
            if (!targetContainer) targetContainer = nav;
            
            const communityLink = document.createElement('a');
            communityLink.href = '/community';
            communityLink.className = 'font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-copy-subtle)] hover:text-[var(--color-foreground)] ml-4';
            communityLink.innerText = 'Community';
            
            const proposalsLink = document.createElement('a');
            proposalsLink.href = '/proposals';
            proposalsLink.className = 'font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-copy-subtle)] hover:text-[var(--color-foreground)] ml-4';
            proposalsLink.innerText = 'Proposals';
            
            targetContainer.appendChild(communityLink);
            targetContainer.appendChild(proposalsLink);
            break;
        }
    }
}, 1000);
</script>
`;

// Add navbar injection to all HTML files
function injectNav(file) {
    let text = fs.readFileSync(file, 'utf8');
    if (!text.includes("communityLink.href = '/community'")) {
        text = text.replace('</body>', navInjection + '</body>');
        fs.writeFileSync(file, text);
    }
}

injectNav('index.html');
injectNav('community.html');
injectNav('proposals.html');

console.log("Pages generated and nav injected.");
