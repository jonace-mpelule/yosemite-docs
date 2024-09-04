// Interfaces for the yosemite.json structure

export interface YosemiteOptions {
    filePath?: string;      // Path to the configuration file
    autoGenerate?: boolean; // Whether to auto-generate docs or not
  }
  


export interface Config {
    name: string;
    description: string;
}
  
export interface HeaderDetail {
    description: string;
    required: boolean;
}
  
export interface RequestBodyDetail {
    type: string;
    required: boolean;
    example: string;
}

export interface ResponseDetail {
    description: string;
    example: any;
}
  
export interface EndpointDetails {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    description: string;
    tags?: string[];
    headers?: Record<string, HeaderDetail>;
    parameters?: Record<string, RequestBodyDetail>;
    requestBody?: Record<string, RequestBodyDetail>;
    responses: Record<string, ResponseDetail>;
    deprecated?: boolean;
}
  
export interface YosemiteConfig {
    config: Config;
    endpoints: Record<string, EndpointDetails>;
}
  