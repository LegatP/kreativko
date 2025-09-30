"use client";

import React from "react";
import { AiReponse, getAiReponses } from "@/db/ai-reponses";
import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableCell,
  TableRow,
} from "@heroui/react";
import { Timestamp } from "firebase/firestore";

// TODO: admin only access
export default function Page() {
  const [aiResponses, setAiResponses] = useState<AiReponse[]>([]);

  useEffect(() => {
    async function fetchAiResponses() {
      const responses = await getAiReponses();
      setAiResponses(responses);
    }
    fetchAiResponses();
  }, []);

  function renderCell(item: AiReponse, columnKey: string | number) {
    try {
      const key = String(columnKey);
      switch (columnKey) {
        case "prompt":
          return item.prompt;
        case "createdAt":
          return new Timestamp(
            item.createdAt.seconds,
            item.createdAt.nanoseconds
          )
            .toDate()
            .toLocaleString();
        case "duration":
          return `${((item.duration || 0) / 1000).toFixed(2)} s`;
        case "image":
          return (
            <img
              src={item.imageUrl}
              alt={item.prompt}
              className="w-32 h-32 object-cover"
            />
          );
        default:
          return null;
      }
    } catch (error) {
      console.error("Error rendering cell:", error);
      return "Error";
    }
  }
  return (
    <Table aria-label="AI Responses" isCompact sepera>
      <TableHeader>
        <TableColumn width={500} key="prompt">
          Opis
        </TableColumn>
        <TableColumn width={100} key="image">
          Motiv
        </TableColumn>
        <TableColumn width={100} key="createdAt">
          Ustvarjeno
        </TableColumn>
        <TableColumn width={100} key="duration">
          Trajanje
        </TableColumn>
      </TableHeader>
      <TableBody items={aiResponses}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
