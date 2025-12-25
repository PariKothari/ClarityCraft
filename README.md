ClarityCraft

ClarityCraft is a project built to help with LeetCode revision. It generates structured explanations for coding problems and allows saving them in a Vault for future reference. The goal is to make practice more organized.

Features:
- Structured output with sections like Problem Restatement, Approach, Steps, Code, and Pitfalls
- Vault saving to store explanations with metadata
- In the Vault, you can sort saved entries according to topic, difficulty level, and clarity level
- Simple and clean user interface

Tech stack: Next.js, Node.js, Gemini API, Firebase, Convex, Vercel


Setup instructions:
- Clone the repository using
git clone https://github.com/PariKothari/ClarityCraft.git
cd ClarityCraft
- Install dependencies using
npm install
- Create a file named .env.local in the project root and add your API keys.
You can refer to .env.example for the required variables.
- Copy lib/firebase.example.js to lib/firebase.js and update it to use your own keys from .env.local.
- Convex setup:
After cloning, you may face the error "Module not found: Can't resolve 'convex/_generated/api.js'".
This happens because Convex auto‑generated files are ignored in GitHub.
To fix it, run:
npx convex login
npx convex dev --once --configure=new
(first time to configure)
or simply:
npx convex dev
(after configuration).
This regenerates the convex/_generated folder locally.
On Vercel, these files are regenerated automatically during build.
- Run the project locally using
npm run dev
- Open the browser and go to
http://localhost:3000
License: This project is for learning and portfolio purposes.
