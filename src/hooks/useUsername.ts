import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

const ANIMALS = ["Lion", "Tiger", "Bear", "Wolf", "Eagle", "Shark", "Panther"];

const STORAGE_KEY = "chat-username";

const generateUsername = () => {
  const adjective = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];

  return `anonymous-${adjective}-${nanoid(5)}`;
};

export const useUsername = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const main = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUsername(stored);
        return;
      }

      const generated = generateUsername();
      localStorage.setItem(STORAGE_KEY, generated);
      setUsername(generated);
    };
    main();
  }, []);

  return [username];
};
