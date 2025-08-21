import {
  DynamoDBClient,
  DynamoDBClientConfig,
  CreateTableCommand,
  CreateTableCommandInput,
  DescribeTableCommand,
  DeleteTableCommandInput,
  DeleteTableCommand
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
  ScanCommandInput,
  marshallOptions,
  unmarshallOptions,
} from "@aws-sdk/lib-dynamodb";
import { ICacheDatabase, PaginatedResult, PaginationOptions } from "../cache.database";

export interface AttributeDefinition {
  AttributeName: string;
  AttributeType: any; //"S" | "N" | "B";
}

export interface KeySchema {
  AttributeName: string;
  KeyType: any; //"HASH" | "RANGE";
}

export interface TableDefinition {
  TableName: string;
  AttributeDefinitions: AttributeDefinition[];
  KeySchema: KeySchema[];
  BillingMode?: "PAY_PER_REQUEST" | "PROVISIONED";
  ProvisionedThroughput?: {
    ReadCapacityUnits: number;
    WriteCapacityUnits: number;
  };
}

export const TableDefinitions = {
  SALA_CINE_HISTORIAL: {
    TableName: "sala_cine_historial",
    AttributeDefinitions: [
      //{ AttributeName: "id", AttributeType: "S" }, // ID único
      { AttributeName: "sala_cine_id", AttributeType: "N" }, // ID de la sala
    ],
    KeySchema: [
      { AttributeName: "sala_cine_id", KeyType: "HASH" }, // Clave primaria
    ],
    BillingMode: "PAY_PER_REQUEST" as const,
  },
}

export class DynamoDatabase implements ICacheDatabase {
  private docClient: DynamoDBDocumentClient;
  private isConnected: boolean = false;

  constructor(config: DynamoDBClientConfig = {}) {
    const defaultConfig: DynamoDBClientConfig = {
      region: "us-east-1",
      endpoint: "http://localhost:8000",
      credentials: {
        accessKeyId: "fakeAccessKeyId",
        secretAccessKey: "fakeSecretAccessKey",
      },
    };

    // Combinar configuración por defecto con la proporcionada
    const finalConfig = { ...defaultConfig, ...config };

    const marshallOptions: marshallOptions = {
      convertClassInstanceToMap: true,
      removeUndefinedValues: true,
    };

    const unmarshallOptions: unmarshallOptions = {
      wrapNumbers: false,
    };

    try {
      const client = new DynamoDBClient(finalConfig);
      this.docClient = DynamoDBDocumentClient.from(client, {
        marshallOptions,
        unmarshallOptions,
      });
      this.isConnected = true;
      console.log("Cliente de DynamoDB Local inicializado correctamente");
    } catch (error) {
      console.error("Error al inicializar el cliente de DynamoDB:", error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Inserta un elemento en una tabla
   * @param tableName Nombre de la tabla
   * @param item Elemento a insertar
   * @returns Promise con el resultado de la inserción
   */
  async insertItem<T extends Record<string, any>>(
    tableName: string,
    item: T
  ): Promise<boolean> {
    try {
        if (!(await this.tableExists(tableName))) {
            const tableDefinition = TableDefinitions;
            await this.createTableIfNotExists(tableDefinition.SALA_CINE_HISTORIAL);
        }

        const params: PutCommandInput = {
            TableName: tableName,
            Item: item,
        };

      const command = new PutCommand(params);
      await this.docClient.send(command);
      
      console.log(`Elemento insertado correctamente en ${tableName}`);
      return true;
    } catch (error) {
      console.error(`Error al insertar elemento en ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Consulta elementos de una tabla con paginación
   * @param tableName Nombre de la tabla
   * @param options Opciones de paginación
   * @returns Promise con los elementos paginados
   */
  async queryWithPagination<T extends Record<string, any>>(
    tableName: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<T>> {
    try {
      const params: ScanCommandInput = {
        TableName: tableName,
        Limit: options.limit || 20,
        ExclusiveStartKey: options.lastEvaluatedKey,
      };

      const command = new ScanCommand(params);
      const result = await this.docClient.send(command);

      return {
        items: result.Items as T[] || [],
        lastEvaluatedKey: result.LastEvaluatedKey,
        count: result.Count || 0,
        hasMore: !!result.LastEvaluatedKey,
      };
    } catch (error) {
      console.error(`Error al consultar la tabla ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Consulta elementos con filtro por clave de partición y ordenación
   * @param tableName Nombre de la tabla
   * @param partitionKeyName Nombre de la clave de partición
   * @param partitionKeyValue Valor de la clave de partición
   * @param options Opciones de paginación
   * @returns Promise con los elementos paginados
   */
  async queryByPartitionKey<T extends Record<string, any>>(
    tableName: string,
    partitionKeyName: string,
    partitionKeyValue: any,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<T>> {
    try {
      const params: QueryCommandInput = {
        TableName: tableName,
        KeyConditionExpression: `${partitionKeyName} = :value`,
        ExpressionAttributeValues: {
          ":value": partitionKeyValue,
        },
        Limit: options.limit || 20,
        ExclusiveStartKey: options.lastEvaluatedKey,
      };

      const command = new QueryCommand(params);
      const result = await this.docClient.send(command);

      return {
        items: result.Items as T[] || [],
        lastEvaluatedKey: result.LastEvaluatedKey,
        count: result.Count || 0,
        hasMore: !!result.LastEvaluatedKey,
      };
    } catch (error) {
      console.error(`Error al consultar por clave de partición en ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Verifica si la conexión está activa
   */
  isReady(): boolean {
    return this.isConnected;
  }

  async tableExists(tableName: string): Promise<boolean> {
    try {
      const command = new DescribeTableCommand({ TableName: tableName });
      await this.docClient.send(command);
      return true;
    } catch (error: any) {
      if (error.name === "ResourceNotFoundException") {
        return false;
      }
      throw error;
    }
  }
  
  async createTableIfNotExists(tableDefinition: TableDefinition): Promise<boolean> {
    const tableExists = await this.tableExists(tableDefinition.TableName);
    
    if (tableExists) {
      console.log(`La tabla ${tableDefinition.TableName} ya existe`);
      return true;
    }

    try {
      const params: CreateTableCommandInput = {
        TableName: tableDefinition.TableName,
        AttributeDefinitions: tableDefinition.AttributeDefinitions,
        KeySchema: tableDefinition.KeySchema,
        BillingMode: tableDefinition.BillingMode || "PAY_PER_REQUEST",
        ProvisionedThroughput: tableDefinition.BillingMode === "PROVISIONED" ? 
          tableDefinition.ProvisionedThroughput : undefined,
      };

      const command = new CreateTableCommand(params);
      await this.docClient.send(command);
      
      console.log(`Tabla ${tableDefinition.TableName} creada exitosamente`);
      
      // Esperar a que la tabla esté activa (opcional)
      await this.waitForTableActive(tableDefinition.TableName);
      
      return true;
    } catch (error) {
      console.error(`Error al crear la tabla ${tableDefinition.TableName}:`, error);
      throw error;
    }
  }

  async deleteTable(tableName: string): Promise<boolean> {
    try {
      if (!(await this.tableExists(tableName))) {
        console.log(`La tabla ${tableName} no existe, no se puede eliminar`);
        return false;
      }

      const params: DeleteTableCommandInput = {
        TableName: tableName,
      };

      const command = new DeleteTableCommand(params);
      await this.docClient.send(command);
      
      console.log(`Tabla ${tableName} eliminada exitosamente`);
      return true;
    } catch (error) {
      console.error(`Error al eliminar la tabla ${tableName}:`, error);
      throw error;
    }
  }

  private async waitForTableActive(tableName: string, maxWaitTime: number = 30): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime * 1000) {
      try {
        const command = new DescribeTableCommand({ TableName: tableName });
        const result = await this.docClient.send(command);
        
        if (result.Table?.TableStatus === "ACTIVE") {
          console.log(`Tabla ${tableName} está activa`);
          return;
        }
        
        console.log(`Esperando que la tabla ${tableName} esté activa...`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
      } catch (error) {
        console.error(`Error al verificar estado de la tabla ${tableName}:`, error);
        throw error;
      }
    }
    
    throw new Error(`Tiempo de espera agotado para la tabla ${tableName}`);
  }

}