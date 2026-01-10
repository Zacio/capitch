export type Participant = { id: string; name: string | null };

export default function ParticipantsList({
  participants,
  canRemove = false,
  onRemove,
}: {
  participants: Participant[];
  canRemove?: boolean;
  onRemove?: (id: string) => void;
}) {
  if (!participants?.length) return <p>No participants yet...</p>;

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {participants.map((p) => (
        <div
          key={p.id}
          style={{
            background: "#e3f2fd",
            padding: 10,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div><strong>{p.name || "Anonymous"}</strong></div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{p.id}</div>
          </div>
          {canRemove && (
            <button onClick={() => onRemove?.(p.id)} style={{ padding: "6px 10px" }}>
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
