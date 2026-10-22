import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getMessage() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8000/api/hello/"
      );

      if (!response.ok) {
        throw new Error("Ошибка сервера");
      }

      const data = await response.json();

      setMessage(data.message);
    } catch (err) {
      setError("Не удалось получить данные из Django");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>React + Django API</h1>

      <button onClick={getMessage} disabled={loading}>
        {loading ? "Загрузка..." : "Получить сообщение"}
      </button>

      {message && <p>Ответ Django: {message}</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;