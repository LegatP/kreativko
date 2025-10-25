"use client";

import ROUTES from "@/utils/routes.utils";
import { Button, Card, CardBody, CardHeader, Textarea } from "@heroui/react";
import { PaintBrushIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

export default function DescribeDesignFormContainer() {
  const [description, setDescription] = useState("");
  return (
    <Card shadow="sm" className="border-1 border-primary p-2">
      <CardHeader className="text-primary font-bold text-2xl">
        Opiši Svoj Motiv
      </CardHeader>
      {/* <Divider /> */}
      <CardBody>
        <Textarea
          autoFocus
          variant="bordered"
          color="primary"
          minRows={8}
          onValueChange={(value) => setDescription(value)}
          // placeholder="Vnesi opis svojega motiva"
          // className="border-2 border-primary-300 focus:border-primary-500"
        />
        <Button
          // as={Link}
          onPress={() => {
            window.location.href = ROUTES.createDesign({
              query: { opis: description },
            });
          }}
          className="mt-4 text-white"
          size="lg"
          color="primary"
          isDisabled={!description.trim()}
          fullWidth
          startContent={<PaintBrushIcon size={20} />}
        >
          Ustvari Motiv
        </Button>
      </CardBody>
    </Card>
  );
}
