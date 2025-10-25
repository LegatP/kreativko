import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useImperativeHandle, forwardRef } from "react";

interface PaymentFormProps {
  email: string;
  phone: string;
  postalCode: string;
  city: string;
  line1: string;
  name: string;
}

export interface PaymentFormRef {
  handleSubmit: () => Promise<void>;
}

const PaymentForm = forwardRef<PaymentFormRef, PaymentFormProps>(
  ({ email, phone, postalCode, city, line1, name }, ref) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async () => {
      if (!stripe || !elements) {
        return;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
          payment_method_data: {
            billing_details: {
              email,
              name,
              phone,
              address: {
                postal_code: postalCode,
                country: "SI",
                state: "",
                city,
                line1,
              },
            },
          },
        },
      });

      if (error) {
        // TODO: Handle error
      }
    };

    useImperativeHandle(ref, () => ({
      handleSubmit,
    }));

    return (
      <div className="space-y-4">
        <PaymentElement
          options={{
            layout: "tabs",
            fields: {
              billingDetails: {
                name: "auto",
                email: "never",
                phone: "never",
                address: "never",
              },
            },
          }}
        />
      </div>
    );
  }
);

PaymentForm.displayName = "PaymentForm";

export default PaymentForm;
