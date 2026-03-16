import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  calculateTVM,
  calculateLoan,
  calculateNPV,
  calculateIRR,
} from "./src/utils/financial-utils.js";

const server = new Server(
  {
    name: "fincalc-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define the exposed tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "calculate_tvm",
        description:
          "Solves a Time Value of Money (TVM) equation for one of the missing variables (FV, PV, PMT, N, I). " +
          "Supply the 'target' variable to solve for ('fv', 'pv', 'pmt', 'n', 'i') and a 'values' object containing the other 4 variables.",
        inputSchema: {
          type: "object",
          properties: {
            target: {
              type: "string",
              description: "The variable to solve for: 'fv', 'pv', 'pmt', 'n', or 'i'",
            },
            values: {
              type: "object",
              description: "An object containing values for n, i, pv, pmt, fv (set the target variable to 0 in this object)",
              properties: {
                n: { type: "number" },
                i: { type: "number" },
                pv: { type: "number" },
                pmt: { type: "number" },
                fv: { type: "number" },
              },
              required: ["n", "i", "pv", "pmt", "fv"],
            },
            mode: {
              type: "string",
              description: "Payment mode: 'END' or 'BEGIN' (default: 'END')",
            },
            frequency: {
              type: "number",
              description: "Payments per year (default: 12)",
            },
          },
          required: ["target", "values"],
        },
      },
      {
        name: "calculate_loan",
        description: "Calculates total payment, total interest, and periodic payment for a loan.",
        inputSchema: {
          type: "object",
          properties: {
            amount: { type: "number", description: "Principal loan amount" },
            rate: { type: "number", description: "Annual interest rate (e.g., 5 for 5%)" },
            termYears: { type: "number", description: "Loan term in years" },
            paymentsMade: { type: "number", description: "Number of payments already made (default: 0)" },
            frequency: { type: "number", description: "Payments per year (default: 12)" },
          },
          required: ["amount", "rate", "termYears"],
        },
      },
      {
        name: "calculate_npv",
        description: "Calculates the Net Present Value (NPV) based on a discount rate and an array of cash flows.",
        inputSchema: {
          type: "object",
          properties: {
            rate: { type: "number", description: "Discount rate as a percentage (e.g., 10 for 10%)" },
            cashFlows: {
              type: "array",
              items: { type: "number" },
              description: "Array of cash flows where index 0 is time 0 (usually negative initial investment)",
            },
          },
          required: ["rate", "cashFlows"],
        },
      },
      {
        name: "calculate_irr",
        description: "Calculates the Internal Rate of Return (IRR) from an array of cash flows.",
        inputSchema: {
          type: "object",
          properties: {
            cashFlows: {
              type: "array",
              items: { type: "number" },
              description: "Array of cash flows where index 0 is time 0 (must have at least one positive and one negative flow)",
            },
            guess: { type: "number", description: "Initial guess rate (default: 0.1 for 10%)" },
          },
          required: ["cashFlows"],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    if (name === "calculate_tvm") {
      const mode = args.mode || "END";
      const frequency = args.frequency || 12;
      const result = calculateTVM(args.target, args.values, mode, frequency);
      return {
        content: [{ type: "text", text: JSON.stringify({ result }) }],
      };
    }

    if (name === "calculate_loan") {
      const paymentsMade = args.paymentsMade || 0;
      const frequency = args.frequency || 12;
      const result = calculateLoan(args.amount, args.rate, args.termYears, paymentsMade, frequency);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }

    if (name === "calculate_npv") {
      const result = calculateNPV(args.rate, args.cashFlows);
      return {
        content: [{ type: "text", text: JSON.stringify({ npv: result }) }],
      };
    }

    if (name === "calculate_irr") {
      const guess = args.guess || 0.1;
      const result = calculateIRR(args.cashFlows, guess);
      return {
        content: [{ type: "text", text: JSON.stringify({ irr: result }) }],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

// Start the server via stdio
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("FinCalc MCP Server running on stdio");
}

run().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
