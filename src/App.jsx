import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

// Component to display individual search result card
function ResultCard({ result }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white rounded-2xl shadow-md w-fit mx-auto text-center"
    >
      <h3 className="text-2xl font-bold text-indigo-700 mb-2">{result.city}</h3>
      <p className="text-gray-700 text-lg">{result.condition}</p>
      <p className="text-4xl font-extrabold text-indigo-600 mt-2">
        {result.temperature}
      </p>
    </motion.div>
  );
}

// Component to display the response based on intent
function ResponseDisplay({ data }) {
  if (data.intent === "news" && data.result?.top) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {data.result.top.map((item, i) => (
          <motion.a
            href={item.link}
            key={i}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            className="block p-5 bg-white rounded-2xl shadow hover:shadow-xl transition"
          >
            <h3 className="font-semibold text-lg mb-2 text-indigo-700">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600">{item.source}</p>
            <p className="mt-2 text-xs text-gray-400 truncate">{item.link}</p>
          </motion.a>
        ))}
      </motion.div>
    );
  }

  if (data.intent === "weather" && data.result) {
    return <ResultCard result={data.result} />;
  }

  return (
    <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto text-sm">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

// Component for Search Input and Button
function SearchInput({ input, setInput, isJSON, setIsJSON, runTool, loading }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <label className="block mb-2 text-sm font-semibold text-gray-700">
        {isJSON ? "Input (JSON)" : "Ask something"}
      </label>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        rows="4"
        placeholder={
          isJSON
            ? '{"method":"tool.invoke","params":{"toolId":"askAI","input":{"question":"What’s the weather in India?"}},"id":1}'
            : "Example: What’s the weather in India?"
        }
      />

      <div className="flex justify-between items-center mt-3">
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={isJSON}
            onChange={(e) => setIsJSON(e.target.checked)}
          />
          <span>Raw JSON mode</span>
        </label>

        <button
          onClick={runTool}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow"
        >
          {loading ? "Loading..." : "Run"}
        </button>
      </div>
    </div>
  );
}

// Component to display search history
function SearchHistory({ history }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Search History</h2>
      <ul className="space-y-2">
        {history.map((item, index) => (
          <li
            key={index}
            className="p-3 bg-gray-100 rounded-lg shadow-md text-gray-700"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Main App component
export default function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [isJSON, setIsJSON] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const runTool = async () => {
    setLoading(true);
    let payload;

    try {
      if (isJSON) {
        payload = JSON.parse(input);
      } else {
        payload = {
          method: "tool.invoke",
          params: {
            toolId: "askAI",
            input: { question: input },
          },
          id: Date.now(),
        };
      }

      const res = await axios.post("http://localhost:3000/mcp", payload, {
        headers: { "Content-Type": "application/json" },
      });
      setResponse(res.data.result);
      setHistory([...history, input]);
    } catch (err) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-6">
          MCP Playground 🧠
        </h1>

        <SearchInput
          input={input}
          setInput={setInput}
          isJSON={isJSON}
          setIsJSON={setIsJSON}
          runTool={runTool}
          loading={loading}
        />

        <SearchHistory history={history} />

        {/* Results */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Response
          </h2>
          {!response ? (
            <p className="text-gray-500">No response yet.</p>
          ) : response.error ? (
            <p className="text-red-500">⚠️ {response.error}</p>
          ) : (
            <ResponseDisplay data={response} />
          )}
        </div>
      </div>
    </div>
  );
}