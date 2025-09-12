"use client";

import CanvasModel from "@/components/canvas";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Textarea,
} from "@heroui/react";

export default function Home() {
  return (
    <div className="flex flex-row gap-4">
      <Card className="w-xl p-2" isBlurred>
        <CardHeader>Ustvari svojo kreacijo</CardHeader>
        <CardBody>
          <Textarea
            rows={20}
            placeholder="Vnesi svojo idejo tukaj..."
          ></Textarea>
        </CardBody>
        <CardFooter>
          <Button>Kreiraj</Button>
        </CardFooter>
      </Card>
      <Card className="w-lg">
        <CanvasModel />
      </Card>
    </div>
  );
}
