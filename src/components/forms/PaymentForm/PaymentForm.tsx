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
  totalAmount?: number;
}

export interface PaymentFormRef {
  handleSubmit: (orderId: string) => Promise<void>;
}

const PaymentForm = forwardRef<PaymentFormRef, PaymentFormProps>(
  ({ email, phone, postalCode, city, line1, name, totalAmount = 0 }, ref) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (orderId: string) => {
      if (!stripe || !elements) {
        return;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}`,
          payment_method_data: {
            metadata: {
              order_id: orderId,
            },
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
            layout: "accordion",

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
