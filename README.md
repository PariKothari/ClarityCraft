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
- Create a file named .env.local in the project root and add your API keys, for example
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
Add Firebase or Convex keys if required.
- Run the project locally using
npm run dev
- Open the browser and go to
http://localhost:3000
License: This project is for learning and portfolio purposes.
