export default function Faqs() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-blue-400 mb-8 text-center">
        Frequently Asked Questions
      </h1>

      {/* General Questions Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-purple-300 mb-4">
          ❓ General Questions
        </h2>
        <ul className="space-y-3 text-base leading-relaxed">
          <li>
            🧩 <span className="font-semibold">What is ClarityCraft?</span> – It’s a
            LeetCode revision companion. You paste a problem link or topic, tell
            us where you’re stuck, and get step‑by‑step guidance with optional
            visualizations.
          </li>
          <li>
            🔑 <span className="font-semibold">Do I need to sign in?</span> – You
            can try problems without signing in. Sign‑in is only required if you
            want to save problems in your Vault for future revision.
          </li>
          <li>
            🤖 <span className="font-semibold">How does the AI help?</span> – The
            AI adapts to your input. If you’re stuck on approach, debugging, or
            want a full explanation, it responds in structured steps instead of
            long essays.
          </li>
        </ul>
      </section>

      {/* Beginner Help Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-purple-300 mb-4">
          🌱 Beginner Help
        </h2>
        <div className="space-y-6 text-base leading-relaxed">
          <p>
            <span className="text-blue-400 font-bold">Tip 1:</span> Paste any
            LeetCode problem link or topic. Even if you’re unsure, the AI will
            guide you step‑by‑step.
          </p>
          <p>
            <span className="text-blue-400 font-bold">Tip 2:</span> Use the second
            input box to describe where you’re stuck (e.g., recursion step, DP
            approach, debugging). This makes the AI’s response more tailored.
          </p>
          <p>
            <span className="text-blue-400 font-bold">Tip 3:</span> Save problems
            in the Vault with metadata tags like <em>stuck</em> or
            <em> explanation</em> so you can sort and revisit them later.
          </p>
        </div>
      </section>

      
    </div>
  );
}