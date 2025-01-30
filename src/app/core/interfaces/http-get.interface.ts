interface GetSort {
  ascending: boolean;
  descending: boolean;
  direction: string;
  ignoreCase: boolean;
  nullHandling: string;
  property: string;
}

export interface IHttpGetRequestBody {
  page: number;
  size: number;
  sort: string;
  search: string;
}

interface IPageable {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface IHttpGetResponseBody<T> {
  content: T[];
  page: IPageable;
}
