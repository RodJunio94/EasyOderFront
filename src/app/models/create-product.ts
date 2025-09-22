export interface CreateProductRequest {
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
}

export interface CreateProductResponse {
    productId: string;
}


