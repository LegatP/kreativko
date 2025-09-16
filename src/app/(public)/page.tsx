"use client";

import { Button, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import CanvasModel from "@/components/canvas";
import AnimatedHeading from "../../components/layout/AnimatedHeading/AnimatedHeading";
import ShirtCreator from "@/components/ShirtCreator";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <AnimatedHeading />
      <div className="flex flex-row gap-4 mt-[50px]">
        <Card className="w-xl p-2" isBlurred>
          <CardHeader>Ustvari svojo kreacijo</CardHeader>
          <CardBody>
            <ShirtCreator />
          </CardBody>
          <CardFooter>
            <Button>Kreiraj</Button>
          </CardFooter>
        </Card>
        <Card className="w-lg">
          <CanvasModel />
        </Card>
      </div>
    </div>
  );
}
