export interface Response<T> {
  data: T[] | null;
  loading: boolean;
}
