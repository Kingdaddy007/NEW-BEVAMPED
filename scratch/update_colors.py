import asyncio
import sys
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def main():
    # 1. Update the local text
    file_path = '../contexts/BEVAMPED_Premium_Visual_Style_Guide.md'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Text replacements
    content = content.replace("Navy\n\nPrimary background", "Gallery Obsidian\n\nPrimary background")
    content = content.replace("#1A1F36", "#0A0A0B")
    content = content.replace("70% Navy or Light Grey", "70% Gallery Obsidian or Light Grey")
    content = content.replace("Navy or Cool Light Grey", "Gallery Obsidian or Cool Light Grey")
    content = content.replace("Navy \n\n#1A1F36", "Gallery Obsidian \n\n#0A0A0B")
    content = content.replace("Navy (\n\n#1A1F36", "Gallery Obsidian (\n\n#0A0A0B")
    content = content.replace("Navy with spotlight gradient", "Gallery Obsidian with spotlight gradient")
    content = content.replace("Navy\n\n#0A0A0B", "Gallery Obsidian\n\n#0A0A0B")
    content = content.replace("Navy\n\n", "Gallery Obsidian\n\n")
    
    # Save the updated raw markdown
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    # 2. Call MCP to delete old and add new
    server_params = StdioServerParameters(
        command="notebooklm-mcp.exe",
        args=[],
    )
    
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            
            notebook_id = "5bf1c373-691d-499c-a934-597001985a83"
            source_id = "cc620c48-7d2c-409e-9431-e2aa60d10535"
            
            print(f"Deleting source {source_id}...")
            del_res = await session.call_tool("source_delete", arguments={
                "source_id": source_id,
                "confirm": True
            })
            print(f"Delete result: {del_res}")
            
            print("Adding updated source...")
            add_res = await session.call_tool("source_add", arguments={
                "notebook_id": notebook_id,
                "source_type": "file",
                "file_path": "C:\\Users\\godsw\\.gemini\\antigravity\\worktrees\\001\\map-dox-framework-contracts\\contexts\\BEVAMPED_Premium_Visual_Style_Guide.md",
                "wait": True
            })
            print(f"Add result: {add_res}")

if __name__ == "__main__":
    asyncio.run(main())
