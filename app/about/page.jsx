
export default function About() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-blue-400 mb-8 text-center">
        About ClarityCraft
      </h1>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-purple-300 mb-4">
          ✨ Features
        </h2>
        <ul className="space-y-3 text-base leading-relaxed">
          <li>
            📝 <span className="font-semibold">Problem Input</span> – Paste any
            LeetCode problem link or topic directly into the input box.
          </li>
          <li>
            ❓ <span className="font-semibold">Stuck Point Input</span> – Tell us
            where you’re stuck (approach, debugging, or explanation) so the AI
            can tailor its response.
          </li>
          <li>
            🤖 <span className="font-semibold">Step‑by‑Step AI Guidance</span> –
            Get structured answers: problem restatement, approach outline,
            visualization, and code snippets.
          </li>
          <li>
            📊 <span className="font-semibold">Visualizations</span> – See
            recursion trees, DP tables, or graphs to make complex problems
            clearer.
          </li>
          <li>
            📚 <span className="font-semibold">Vault</span> – Save problems with
            metadata tags like <em>stuck</em> or <em>explanation</em> for easy
            sorting and revision later.
          </li>
          <li>
            📱 <span className="font-semibold">Responsive UI</span> – Works
            seamlessly across devices with clean layouts and adaptive design.
          </li>
        </ul>
      </section>

      {/* How It Works Section */}
      <section>
        <h2 className="text-2xl font-semibold text-purple-300 mb-4">
          🛠️ How It Works
        </h2>
        <div className="space-y-6 text-base leading-relaxed">
          <p>
            <span className="text-blue-400 font-bold">Step 1:</span> Paste a
            LeetCode problem link or topic into the first input box.
          </p>
          <p>
            <span className="text-blue-400 font-bold">Step 2:</span> Use the
            second input box to describe where you’re stuck (e.g., recursion
            step, DP approach, debugging).
          </p>
          <p>
            <span className="text-blue-400 font-bold">Step 3:</span> The AI
            generates a structured response with clear steps and optional
            visualizations.
          </p>
          <p>
            <span className="text-blue-400 font-bold">Step 4:</span> Save the
            problem to your Vault. When saving, choose metadata tags like
            <em> stuck</em> or <em> explanation</em>.
          </p>
          <p>
            <span className="text-blue-400 font-bold">Step 5:</span> Revisit your
            Vault entries anytime, filter by metadata, and track your revision
            progress.
          </p>
        </div>
      </section>
    </div>
  );
}