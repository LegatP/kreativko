"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableCell,
  TableRow,
  Divider,
  Button,
  useDisclosure,
} from "@heroui/react";
import {
  collection,
  DocumentData,
  FirestoreDataConverter,
  limit,
  orderBy,
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
import { isObject } from "framer-motion";
import { isArray } from "util";
import Image from "next/image";
import { PlusIcon, PencilIcon } from "@phosphor-icons/react";
import CreateProductCategoryForm from "@/components/forms/CreateProductCategoryForm";
import CreateProductForm from "@/components/forms/CreateProductForm";
import EditProductCategoryForm from "@/components/forms/EditProductCategoryForm";
import EditProductForm from "@/components/forms/EditProductForm";

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

  const {
    isOpen: isProductCategoryFormOpen,
    onOpen: onProductCategoryFormOpen,
    onClose: onProductCategoryFormClose,
  } = useDisclosure();

  const {
    isOpen: isProductFormOpen,
    onOpen: onProductFormOpen,
    onClose: onProductFormClose,
  } = useDisclosure();

  const {
    isOpen: isEditProductCategoryFormOpen,
    onOpen: onEditProductCategoryFormOpen,
    onClose: onEditProductCategoryFormClose,
  } = useDisclosure();

  const {
    isOpen: isEditProductFormOpen,
    onOpen: onEditProductFormOpen,
    onClose: onEditProductFormClose,
  } = useDisclosure();

  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const col = collection(db, collectionName as string).withConverter(coverter);
  const [data] = useCollectionDataOnce<DocumentData>(
    collectionName ? query(col, limit(20), orderBy("createdAt", "desc")) : null
  );

  const handleFormSuccess = () => {
    // Force re-fetch of data
    window.location.reload();
  };

  const handleEdit = (id: string) => {
    setEditingItemId(id);
    if (collectionName === "product_categories") {
      onEditProductCategoryFormOpen();
    } else if (collectionName === "products") {
      onEditProductFormOpen();
    }
  };

  const handleEditClose = () => {
    setEditingItemId(null);
    onEditProductCategoryFormClose();
    onEditProductFormClose();
  };

  const getCreateButton = () => {
    if (collectionName === "product_categories") {
      return (
        <Button
          color="primary"
          startContent={<PlusIcon size={16} />}
          onPress={onProductCategoryFormOpen}
        >
          Ustvari kategorijo
        </Button>
      );
    }

    if (collectionName === "products") {
      return (
        <Button
          color="primary"
          startContent={<PlusIcon size={16} />}
          onPress={onProductFormOpen}
        >
          Ustvari izdelek
        </Button>
      );
    }

    return null;
  };

  function renderCell(item: DocumentData, columnKey: string | number) {
    try {
      const key = String(columnKey);
      if (String(columnKey).includes("At")) {
        return new Timestamp(item[key].seconds, item[key].nanoseconds)
          .toDate()
          .toLocaleString();
      }

      if (isObject(item[key]) && !isArray(item[key])) {
        return (
          <div>
            {Object.entries(item[key])
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([k, v]) => (
                <div key={k}>
                  <strong>{k}:</strong> {String(v)}
                </div>
              ))}
          </div>
        );
      }
      switch (columnKey) {
        case "items":
          return (
            <div>
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                item.items.map((item: any, index: number) => (
                  <div key={index}>
                    <span>Izdelek: {index}</span>
                    <div>
                      {Object.keys(item)
                        .sort()
                        .map((k) => (
                          <div key={k}>
                            <strong>{k}:</strong> {JSON.stringify(item[k])}
                          </div>
                        ))}
                    </div>
                    <Divider />
                  </div>
                ))
              }
            </div>
          );
        case "designs":
          return (
            <div className="flex flex-wrap gap-2 min-w-[150px]">
              {item.designs?.map(
                (design: { title: string; url: string }, index: number) => (
                  <div key={index} className="flex flex-col items-center">
                    <img
                      src={design.url}
                      alt={design.title}
                      className="object-cover rounded w-[150px] h-[150px]"
                      title={design.title}
                    />
                  </div>
                )
              )}
            </div>
          );
        case "duration":
          return `${((item.duration || 0) / 1000).toFixed(2)} s`;
        case "image":
        case "imageUrl":
          return (
            <img
              src={item[key]}
              alt="Product image"
              width={128}
              height={128}
              className="object-cover"
            />
          );
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
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {collectionName} ({data?.length || 0})
        </h1>
        {getCreateButton()}
      </div>

      <Table aria-label="Collection Data" isCompact>
        <TableHeader>
          {[
            <TableColumn width={120} key="actions">
              Akcije
            </TableColumn>,
            ...Object.keys((data && data[0]) || {})
              .sort()
              .map((key) => (
                <TableColumn width={200} key={key}>
                  {key}
                </TableColumn>
              )),
          ]}
        </TableHeader>
        <TableBody items={data || []}>
          {(item: DocumentData) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === "actions" ? (
                    <div className="flex gap-2">
                      {(collectionName === "product_categories" ||
                        collectionName === "products") && (
                        <Button
                          size="sm"
                          variant="light"
                          color="primary"
                          isIconOnly
                          onPress={() => handleEdit(item.id)}
                        >
                          <PencilIcon size={16} />
                        </Button>
                      )}
                    </div>
                  ) : (
                    renderCell(item, columnKey)
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <CreateProductCategoryForm
        isOpen={isProductCategoryFormOpen}
        onClose={onProductCategoryFormClose}
        onSuccess={handleFormSuccess}
      />

      <CreateProductForm
        isOpen={isProductFormOpen}
        onClose={onProductFormClose}
        onSuccess={handleFormSuccess}
      />

      <EditProductCategoryForm
        isOpen={isEditProductCategoryFormOpen}
        onClose={handleEditClose}
        onSuccess={handleFormSuccess}
        categoryId={editingItemId || undefined}
      />

      <EditProductForm
        isOpen={isEditProductFormOpen}
        onClose={handleEditClose}
        onSuccess={handleFormSuccess}
        productId={editingItemId || undefined}
      />
    </div>
  );
}
