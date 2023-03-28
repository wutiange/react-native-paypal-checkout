export interface OrderResponse {
  id: string;
  status: string;
  links: CreateOrderLinks[];
}

export interface CreateOrderLinks {
  href: string;
  rel: string;
  method: string;
}
