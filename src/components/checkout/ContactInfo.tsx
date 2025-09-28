import { Checkbox, Input } from "@heroui/react";
import { truncateSync } from "fs";
import Link from "next/link";
import { useState } from "react";

export default function ContactInfo() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col">
      <Input type="email" label="Elektronski naslov" size="sm" />
      <div className="flex flex-row justify-between text-xs items-center mt-3">
        <div className="flex flex-row">
          <Checkbox checked={checked} onValueChange={setChecked} size="sm" />
          <span>Ustvari račun</span>
        </div>
        <span>
          Že imaš račun?{" "}
          <Link href="/login" className="underline" tabIndex={-1}>
            Prijavi se
          </Link>
        </span>
      </div>
      {checked && (
        <Input type="password" label="Geslo" size="sm" className="mt-4" />
      )}
    </div>
  );
}
