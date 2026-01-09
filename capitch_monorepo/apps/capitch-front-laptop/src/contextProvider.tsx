import { createContext, useState } from "react";
import type { participent } from "@repo/common/type";

type ParticipentContextType = {
  participent: participent | null;
  setParticipent: React.Dispatch<React.SetStateAction<participent | null>>;
};

export const ParticipentContext =
  createContext<ParticipentContextType | undefined>(undefined);

  import { useContext } from "react";
  
export function useParticipent() {
  const ctx = useContext(ParticipentContext);
  if (!ctx) {
    throw new Error("useParticipent must be used inside ParticipentProvider");
  }
  return ctx;
}


function ParticipentProvider({ children }: { children: React.ReactNode }) {
  const [participent, setParticipent] = useState<participent | null>(null);

  return (
    <ParticipentContext.Provider value={{ participent, setParticipent }}>
      {children}
    </ParticipentContext.Provider>
  );
}

export default ParticipentProvider;
