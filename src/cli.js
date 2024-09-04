#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

// Determine the path to the JSON file
const yosemiteJsonPath = path.resolve(process.cwd(), 'yosemite.json');

// Ensure the yosemite.json file exists
const ensureYosemiteJsonExists = () => {
  if (!fs.existsSync(yosemiteJsonPath)) {
    console.log("\x1b[31m%s\x1b[0m", ` ❌ yosemite.json not found. Please run 'npx yosemite-docs init' to create one. \n`);
    process.exit(1);
  }
};

// Add an endpoint to the JSON file
const addEndpoint = (
  endpoint,
  method,
  description,
  useDefaultTemplate
) => {
  ensureYosemiteJsonExists();

  const yosemiteConfig = JSON.parse(fs.readFileSync(yosemiteJsonPath, 'utf8'));

  if (yosemiteConfig.endpoints[endpoint]) {
    console.error(`\x1b[31mYOSEMITE ERROR:\x1b[0m Endpoint ${endpoint} already exists.`);
    return;
  }

  yosemiteConfig.endpoints[endpoint] = {
    method,
    description,
    ...(useDefaultTemplate && {
        paramaters: {},
        headers: {
          'Content-Type': 'application/json',
          'Authrization': 'Bearer',
        },
      requestBody: { field : 'string', isExample: true },
      responses: { status: "200", message: "Example response" },
    }),
  };

  fs.writeFileSync(yosemiteJsonPath, JSON.stringify(yosemiteConfig, null, 2));
  console.log("\x1b[32m%s\x1b[0m", `✅ Endpoint ${endpoint} added to docs successfully. \n`);
};

// Initialize the yosemite.json file
const initYosemiteJson = () => {
  if (fs.existsSync(yosemiteJsonPath)) {
    console.error(`\x1b[31mYOSEMITE ERROR:\x1b[0m yosemite.json already exists.`);
    return;
  }

  const initialConfig = {
    config: {
      name: 'My API',
      description: 'My API v1.0.0',
    },
    endpoints: {},
  };

  fs.writeFileSync(yosemiteJsonPath, JSON.stringify(initialConfig, null, 2));
  console.log('\x1b[32m ✅ yosemite.json created successfully.\x1b[0m \n');
};

// Setup the CLI commands
yargs
  .command(
    'init',
    'Initialize yosemite.json',
    () => {},
    () => initYosemiteJson()
  )
  .command(
    'add [endpoint]',
    'Add a new endpoint to yosemite.json',
    {
      get: { type: 'boolean', description: 'Set the HTTP method to GET' },
      post: { type: 'boolean', description: 'Set the HTTP method to POST' },
      delete: { type: 'boolean', description: 'Set the HTTP method to DELETE' },
      put: { type: 'boolean', description: 'Set the HTTP method to PUT' },
      description: { type: 'string', demandOption: true, describe: 'The description of the endpoint' },
      default: { type: 'boolean', description: 'Use the default template for request and response' },
    },
    (argv) => {
      const method = argv.get
        ? 'GET'
        : argv.post
        ? 'POST'
        : argv.delete
        ? 'DELETE'
        : argv.put
        ? 'PUT'
        : '';

      if (!method) {
        console.log('\x1b[31mPlease specify a valid HTTP method using --get, --post, --delete, or --put\x1b[0m \n');
        process.exit(1);
      }

      if (!argv.endpoint) {
        console.log('\x1b[31mPlease specify an endpoint name.\x1b[0m \n');
        process.exit(1);
      }

      addEndpoint(argv.endpoint, method, argv.description, argv.default);
    }
  )
  .help()
  .argv;
