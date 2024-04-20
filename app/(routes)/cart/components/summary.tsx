"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import { useCart } from "@/hooks/use-cart";

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const clearItems = useCart((state) => state.clearItems);

  const [loading, setLoading] = useState(false);

  const totalPrice = items.reduce((acc, item) => acc + Number(item.price), 0);

  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current  && searchParams.get("reference") && searchParams.get("trxref")) {
      toast.success("Payment Completed!");
      clearItems();
      hasRun.current = true;
    }
  }, [searchParams, clearItems])

  const onCheckout = async () => {
    try {
      setLoading(true);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        productIds: items.map((item) => item.id),
      });
  
      window.location = response.data.url;
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return(
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">
        Order Summary
      </h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">
            Order total
          </div>
          <Currency value={totalPrice} />
        </div>
      </div>
      <Button onClick={onCheckout} disabled={loading} className="mt-6 w-full">Proceed to checkout</Button>
    </div>
  )
};

export default Summary;