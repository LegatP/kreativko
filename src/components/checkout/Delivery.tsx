import { Input, InputOtp } from "@heroui/react";

export default function Delivery() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-sm text-gray-500 mb-1">Poštna številka</div>
        <InputOtp
          classNames={{ segmentWrapper: "py-0" }}
          label="Poštna številka"
          length={4}
          errorMessage="Vnesite veljavno poštno številko"
        />
      </div>
      <Input type="text" label="Naslov" size="sm" />
      <Input type="text" label="Mesto" size="sm" />
      <Input type="text" label="Država" size="sm" value="Slovenija" disabled />
      <Input type="text" label="Telefon" size="sm" />
    </div>
  );
}
