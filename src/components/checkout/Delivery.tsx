import { Input, InputOtp } from "@heroui/react";

interface DeliveryProps {
  isRequired?: boolean;
}
export default function Delivery({ isRequired = true }: DeliveryProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        type="text"
        label="Telefon"
        size="sm"
        isRequired={isRequired}
        name="phone"
      />
      <div>
        <label className="text-sm text-gray-500 mb-1" id="postal-code-label">
          Poštna številka
        </label>
        <InputOtp
          name="postCode"
          aria-labelledby="postal-code-label"
          isRequired={isRequired}
          classNames={{ segmentWrapper: "py-0" }}
          label="Poštna številka"
          length={4}
          errorMessage="Vnesite veljavno poštno številko."
        />
      </div>
      <Input
        type="text"
        label="Ulica in hišna številka"
        size="sm"
        isRequired={isRequired}
        name="address"
      />
      <Input
        type="text"
        label="Kraj"
        size="sm"
        isRequired={isRequired}
        name="city"
      />
      <Input
        type="text"
        label="Država"
        size="sm"
        defaultValue="Slovenija"
        name="country"
        isReadOnly
        description="Dostava je zaenkrat možna samo znotraj Slovenije."
      />
    </div>
  );
}
