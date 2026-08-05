const fs = require('fs');
const path = require('path');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Strip Next.js scripts that break static hydration
html = html.replace(/<script src="\/_next[^>]+><\/script>/g, '');
html = html.replace(/<script>self\.__next_f\.push[^<]+<\/script>/g, '');
html = html.replace(/<script defer[^>]+><\/script>/g, '');

// 2. Replace the main content
const mainRegex = /(<main[^>]*>)([\s\S]*?)(<\/main>)/i;

const communityContent = `
<div class="flex flex-col items-center justify-center min-h-[60vh] px-5 py-20 text-center">
    <h1 class="font-display text-[42px] font-semibold tracking-[-0.035em] text-[var(--color-foreground)] mb-4">Communities</h1>
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
    communityHtml = communityHtml.replace('</body>', '<div id="custom-page-content">' + communityContent + '</div></body>');
    proposalsHtml = proposalsHtml.replace('</body>', '<div id="custom-page-content">' + proposalsContent + '</div></body>');
}

// Notice that the filenames have changed to correctly match the original links
fs.writeFileSync('communities.html', communityHtml);
fs.writeFileSync('proposals.html', proposalsHtml);

console.log("Static pages generated correctly without injections.");
