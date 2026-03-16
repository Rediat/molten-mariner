# AI Agent Workflows / Skills

This directory (`.agents/workflows`) contains reusable logic that AI Assistants (like Claude, ChatGPT, Cursor, GitHub Copilot) can read to perform specific tasks perfectly. 

## Included Skills

### 1. `financial-calculations-skill.md`
This file contains the robust mathematical logic for solving:
*   Time Value of Money (TVM)
*   Loan Amortization
*   Net Present Value (NPV)
*   Internal Rate of Return (IRR) 
*   Bond Pricing

## How to use these Skills in other Projects

### Method 1: IDE AI Context (Cursor / Windsurf / Copilot)
If you are starting a new project in your IDE, simply drag and drop the `.agents/workflows/financial-calculations-skill.md` file into your new project's workspace.
*   You can then ask your IDE AI:
    > "Read `financial-calculations-skill.md` and implement the TVM calculator in Python for me."

### Method 2: System Prompts (Anthropic Console / OpenAI API)
If you are building your own LLM application, copy the entire contents of the `.md` file into the `system_prompt` of your application.
*   Give the LLM a tool named `calculate_loan` and instruct it:
    > "When using the `calculate_loan` tool, write the implementation EXACTLY as defined in the Financial Calculations Skill."
