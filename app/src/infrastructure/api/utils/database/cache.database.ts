
export interface PaginatedResult<T> {
  items: T[];
  lastEvaluatedKey?: Record<string, any>;
  count: number;
  hasMore: boolean;
}

export interface PaginationOptions {
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}

export interface ICacheDatabase {
  insertItem<T extends Record<string, any>>(
  tableName: string,
  item: T
  ): Promise<boolean>;

  queryWithPagination<T extends Record<string, any>>(
    tableName: string,
    options: PaginationOptions
  ): Promise<PaginatedResult<T>>;

  queryByPartitionKey<T extends Record<string, any>>(
    tableName: string,
    partitionKeyName: string,
    partitionKeyValue: any,
    options: PaginationOptions
  ): Promise<PaginatedResult<T>>;
}
