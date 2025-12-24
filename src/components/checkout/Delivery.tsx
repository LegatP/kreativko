import { Input, InputOtp } from "@heroui/react";
import { useCheckoutContext } from "../contexts/CheckoutContext";

interface DeliveryProps {
  isRequired?: boolean;
}
export default function Delivery({ isRequired = true }: DeliveryProps) {
  const { shippingInfo, setShippingInfo } = useCheckoutContext();
  return (
    <div className="flex flex-col gap-4">
      <Input
        type="text"
        label="Telefon"
        size="sm"
        isRequired={isRequired}
        name="phone"
        value={shippingInfo.phoneNumber}
        onValueChange={(value) =>
          setShippingInfo({ ...shippingInfo, phoneNumber: value })
        }
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
          onValueChange={(value) =>
            setShippingInfo({ ...shippingInfo, postalCode: value })
          }
          value={shippingInfo.postalCode}
        />
      </div>
      <Input
        type="text"
        label="Ulica in hišna številka"
        size="sm"
        isRequired={isRequired}
        name="address"
        value={shippingInfo.address}
        onValueChange={(value) =>
          setShippingInfo({ ...shippingInfo, address: value })
        }
      />
      <Input
        type="text"
        label="Kraj"
        size="sm"
        isRequired={isRequired}
        name="city"
        value={shippingInfo.city}
        onValueChange={(value) =>
          setShippingInfo({ ...shippingInfo, city: value })
        }
      />
      <Input
        type="text"
        label="Država"
        size="sm"
        defaultValue={shippingInfo.country}
        name="country"
        isReadOnly
        description="Dostava je zaenkrat možna samo znotraj Slovenije."
      />
    </div>
  );
}
