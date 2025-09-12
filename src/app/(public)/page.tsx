"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Textarea,
} from "@heroui/react";
import CanvasModel from "@/components/canvas";
import AnimatedHeading from "./AnimatedHeading";
import { useAppContext } from "@/components/contexts/AppContext";

export default function Home() {
  const { state, setState } = useAppContext();
  const colors = [
    "#EFBD48",
    "#24C1E0",
    "#E02C2C",
    "#2CE07B",
    "#8B2CE0",
    "#E0A22C",
  ];
  return (
    <div className="flex flex-col items-center">
      {/* <h1 className="tracking-tight inline font-semibold from-[#FF1CF7] to-[#b249f8] text-[clamp(1rem,10vw,2rem)] sm:text-[clamp(1rem,10vw,3rem)] lg:text-5xl bg-clip-text text-transparent bg-linear-to-b"> */}
      {/* Animated heading */}
      <AnimatedHeading />
      <div className="flex flex-row gap-4 mt-[50px]">
        <Card className="w-xl p-2" isBlurred>
          <CardHeader>Ustvari svojo kreacijo</CardHeader>
          <CardBody>
            <Textarea
              rows={20}
              placeholder="Vnesi svojo idejo tukaj..."
            ></Textarea>
            <div className="mt-4">
              <div className="font-semibold mb-2">Izberi barvo majice:</div>
              <div className="flex gap-2 mb-4">
                {colors.map((color) => (
                  <button
                    key={color}
                    style={{
                      background: color,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border:
                        state.color === color
                          ? "2px solid #333"
                          : "2px solid #fff",
                    }}
                    onClick={() => setState({ ...state, color })}
                    aria-label={`Izberi barvo ${color}`}
                  />
                ))}
              </div>
              <div className="font-semibold mb-2">Spol:</div>
              <div className="flex gap-2 mb-4">
                {(["male", "female"] as Array<"male" | "female">).map(
                  (gender) => (
                    <button
                      key={gender}
                      className={`px-4 py-2 rounded ${
                        state.gender === gender
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => setState({ ...state, gender: gender })}
                    >
                      {gender === "male" ? "Moški" : "Ženska"}
                    </button>
                  )
                )}
              </div>
              <div className="font-semibold mb-2">Velikost:</div>
              <div className="flex gap-2 mb-4">
                {(["S", "M", "L", "XL"] as Array<"S" | "M" | "L" | "XL">).map(
                  (size) => (
                    <button
                      key={size}
                      className={`px-4 py-2 rounded ${
                        state.size === size
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => setState({ ...state, size: size })}
                    >
                      {size}
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="font-semibold mb-2">
              Izberi ali naloži sliko za majico:
            </div>
            <div className="flex gap-2 mb-4 items-center">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      if (reader.result && typeof reader.result === "string") {
                        setState({ ...state, shirtPatternUrl: reader.result });
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {state.shirtPatternUrl && (
                <img
                  src={state.shirtPatternUrl}
                  alt="Majica vzorec"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    objectFit: "cover",
                    border: "1px solid #ccc",
                  }}
                />
              )}
            </div>
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
