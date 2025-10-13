import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const configSchema = z.object({
  resourcespace: z.object({
    url: z.string().url(),
    user: z.string().min(1),
    apiKey: z.string().min(1),
  }),
  server: z.object({
    logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    requestTimeout: z.number().positive().default(30000),
    maxRetries: z.number().min(0).default(3),
    retryDelay: z.number().min(0).default(1000),
  }),
});

export type Config = z.infer<typeof configSchema>;

export function loadConfig(): Config {
  const config = {
    resourcespace: {
      url: process.env.RESOURCESPACE_URL || '',
      user: process.env.RESOURCESPACE_USER || '',
      apiKey: process.env.RESOURCESPACE_API_KEY || '',
    },
    server: {
      logLevel: (process.env.LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
      requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '30000', 10),
      maxRetries: parseInt(process.env.MAX_RETRIES || '3', 10),
      retryDelay: parseInt(process.env.RETRY_DELAY || '1000', 10),
    },
  };

  try {
    return configSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n');
      throw new Error(`Configuration validation failed:\n${issues}`);
    }
    throw error;
  }
}

