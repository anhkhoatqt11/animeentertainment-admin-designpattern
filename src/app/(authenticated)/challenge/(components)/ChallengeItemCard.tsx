import React from "react";
import { Button } from "@/components/ui/button";
import { FileEditIcon } from "lucide-react";
import Link from "next/link";

export default function ChallengeItemCard({ item, index }) {
  return (
    <Link href={`/challenge/${item.questionId}`}>
      <div className="flex flex-col bg-white m-4 rounded-lg shadow transition ease-in-out hover:scale-105 duration-300">
        <div className="relative flex-1 pt-6 pr-6 pl-6">
          <img
            alt="Question Image"
            className="h-full rounded-md object-cover transition-transform group-hover:scale-125 duration-300"
            height="200"
            src={item.mediaUrl}
            style={{
              aspectRatio: "2/1",
              objectFit: "cover",
            }}
            width="1000"
          />
        </div>
        <div className="flex-1 space-y-3 p-6">
          <h3 className="text-base font-semibold text-blue-500">
            Câu {index + 1}: {item.questionName}
          </h3>
          <div className="grid gap-2">
            {item.answers.map((answer, index) => (
              <Button
                key={index}
                className={`justify-start ${
                  item.correctAnswerID === index ? "bg-emerald-200" : ""
                }`}
                variant="outline"
              >
                {answer}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
