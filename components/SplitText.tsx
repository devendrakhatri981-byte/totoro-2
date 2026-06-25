"use client";

import React from "react";

interface SplitTextProps {
  text: string;
  className?: string;
  charClassName?: string;
  wordClassName?: string;
  type?: "chars" | "words" | "both";
}

export default function SplitText({
  text,
  className = "",
  charClassName = "",
  wordClassName = "",
  type = "both",
}: SplitTextProps) {
  const words = text.split(" ");

  return (
    <span className={`split-text-wrapper inline-block ${className}`}>
      {words.map((word, wordIndex) => {
        const isLastWord = wordIndex === words.length - 1;

        if (type === "words") {
          return (
            <React.Fragment key={wordIndex}>
              <span className={`word-span inline-block ${wordClassName}`}>
                {word}
              </span>
              {!isLastWord && " "}
            </React.Fragment>
          );
        }

        // For "chars" or "both"
        const chars = Array.from(word);

        return (
          <React.Fragment key={wordIndex}>
            <span
              className={`word-span inline-block ${wordClassName}`}
              style={{ whiteSpace: "nowrap" }}
            >
              {chars.map((char, charIndex) => (
                <span
                  key={charIndex}
                  className={`char-span inline-block ${charClassName}`}
                >
                  {char}
                </span>
              ))}
            </span>
            {!isLastWord && (
              <span className="space-span inline-block" aria-hidden="true">
                &nbsp;
              </span>
            )}
          </React.Fragment>
        );
      })}
    </span>
  );
}
