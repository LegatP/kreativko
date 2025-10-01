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
import {
  collection,
  DocumentData,
  FirestoreDataConverter,
  query,
  Timestamp,
} from "firebase/firestore";
import { useParams } from "next/navigation";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import db from "@/lib/firebase/firestore";
import {
  WithFieldValue,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";

export const coverter: FirestoreDataConverter<DocumentData> = {
  toFirestore(data: WithFieldValue<DocumentData>): DocumentData {
    return data;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): DocumentData {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      // ref: snapshot.ref,
      ...data,
    };
  },
};

// TODO: admin only access
export default function Page() {
  const { collection: collectionName } = useParams();

  const col = collection(db, collectionName as string).withConverter(coverter);
  const [data] = useCollectionDataOnce<DocumentData>(
    collectionName ? query(col) : null
  );

  function renderCell(item: DocumentData, columnKey: string | number) {
    try {
      const key = String(columnKey);
      switch (columnKey) {
        case "createdAt":
        case "updatedAt":
          return new Timestamp(
            item.createdAt.seconds,
            item.createdAt.nanoseconds
          )
            .toDate()
            .toLocaleString();
        case "duration":
          return `${((item.duration || 0) / 1000).toFixed(2)} s`;
        case "image":
          return <img src={item.imageUrl} className="w-32 h-32 object-cover" />;
        default:
          if (typeof item[key] === "object") {
            return JSON.stringify(item[key]);
          }
          return item[key] as string;
      }
    } catch (error) {
      console.log("Error rendering cell:", error);
      return "Error";
    }
  }

  return (
    <Table aria-label="AI Responses" isCompact>
      <TableHeader>
        {Object.keys((data && data[0]) || {}).map((key) => (
          <TableColumn width={200} key={key}>
            {key}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody items={data || []}>
        {(item: DocumentData) => (
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
