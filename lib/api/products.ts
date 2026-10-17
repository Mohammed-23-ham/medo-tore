export type Product = {
    id: number;
    title: string;
    description: string;
    price: number;
    thumbnail: string;
};

type ProductsResponse = {
    products: Product[];
}

export async function getProducts(): Promise<Product[]> {
    const response = await fetch("https://dummyjson.com/products?limit=100");
    if(!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    const data: ProductsResponse = await response.json();
    return data.products;
}