import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../_generated/api";

const LeetcodeRevision = ({ user }) => {
  const saveRevision = useMutation(api.saveRevision);

  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [topic, setTopic] = useState("Arrays");
  const [explanation, setExplanation] = useState("");

  const handleSave = async () => {
    await saveRevision({
      link,
      title,
      difficulty,
      topic,
      explanation,
      userId: user._id,
    });
    // Optional: clear fields or show confirmation
  };

  return (
    <div className="p-4 space-y-4">
      <input
        type="text"
        placeholder="Leetcode link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        className="input"
      />
      <input
        type="text"
        placeholder="Problem title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input"
      />
      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>
      <select value={topic} onChange={(e) => setTopic(e.target.value)}>
        <option>Arrays</option>
        <option>Trees</option>
        <option>DP</option>
        <option>Graphs</option>
        <option>Strings</option>
      </select>
      <textarea
        placeholder="Explanation"
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
        className="textarea"
      />
      <button onClick={handleSave} className="btn btn-primary">
        Save Revision
      </button>
    </div>
  );
};

export default LeetcodeRevision;