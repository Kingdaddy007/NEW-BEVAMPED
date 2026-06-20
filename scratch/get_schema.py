import asyncio
import sys
import json
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def main():
    server_params = StdioServerParameters(
        command="notebooklm-mcp.exe",
        args=[],
    )
    
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            
            tools = await session.list_tools()
            for tool in tools.tools:
                if tool.name in ["source_delete", "source_add"]:
                    print(f"Tool: {tool.name}")
                    print(json.dumps(tool.inputSchema, indent=2))

if __name__ == "__main__":
    asyncio.run(main())
