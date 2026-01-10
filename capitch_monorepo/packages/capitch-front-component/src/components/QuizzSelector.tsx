import { useEffect, useState } from "react";

export default function QuizzSelector({
  roomId,
  onSet,
}: {
  roomId: string;
  onSet?: (quizzId: number) => void;
}) {
  const [quizzes, setQuizzes] = useState<{ id: number; title: string }[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:5001/quizz", { headers: { Accept: "application/json" } })
      .then((r) => r.json())
      .then((data) => setQuizzes(data.quizzes || []))
      .catch(() => setQuizzes([]));
  }, []);

  async function setQuizz() {
    if (!selected) return;
    const res = await fetch(`http://localhost:5001/trainer/setQuizz/${roomId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ quizzId: selected }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(`Set quizz failed: ${err.error || res.statusText}`);
      return;
    }
    onSet?.(selected);
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <label>
        Select quizz
        <select
          value={selected ?? ""}
          onChange={(e) => setSelected(Number(e.target.value))}
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        >
          <option value="" disabled>
            Choose a quizz
          </option>
          {quizzes.map((q) => (
            <option key={q.id} value={q.id}>
              {q.title}
            </option>
          ))}
        </select>
      </label>
      <button onClick={setQuizz} disabled={!selected} style={{ padding: "8px 12px" }}>
        Set quizz
      </button>
    </div>
  );
}
