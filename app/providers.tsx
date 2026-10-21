'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useProductStore } from "@/lib/store/products";

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    useEffect(() => {
        void useProductStore.persist.rehydrate();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}