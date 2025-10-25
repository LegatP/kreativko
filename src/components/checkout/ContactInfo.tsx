import { Checkbox, Input } from "@heroui/react";
import Link from "next/link";
import { useState } from "react";
import { useCheckoutContext } from "../contexts/AppContext/CheckoutContext";

export default function ContactInfo() {
  const [checked, setChecked] = useState(false);
  const { setShippingInfo, shippingInfo } = useCheckoutContext();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <Input
          label="Ime"
          name="firstName"
          isRequired
          variant="flat"
          size="sm"
          value={shippingInfo.firstName}
          onValueChange={(e) =>
            setShippingInfo({ ...shippingInfo, firstName: e })
          }
        />
        <Input
          label="Priimek"
          name="lastName"
          isRequired
          variant="flat"
          size="sm"
          value={shippingInfo.lastName}
          onValueChange={(e) =>
            setShippingInfo({ ...shippingInfo, lastName: e })
          }
        />
      </div>
      <Input
        type="email"
        label="Elektronski naslov"
        size="sm"
        isRequired
        value={shippingInfo.email}
        onValueChange={(e) => setShippingInfo({ ...shippingInfo, email: e })}
        errorMessage="Neveljaven elektronski naslov."
      />
      {/* <div className="flex flex-row justify-between text-xs items-center mt-3"> */}
      {/* <div className="flex flex-row">
          <Checkbox checked={checked} onValueChange={setChecked} size="sm" />
          <span>Ustvari račun</span>
        </div>
        <span>
          Že imaš račun?{" "}
          <Link href="/login" className="underline" tabIndex={-1}>
            Prijavi se
          </Link>
        </span> */}
      {/* </div> */}
      {checked && (
        <Input type="password" label="Geslo" size="sm" className="mt-4" />
      )}
    </div>
  );
}
