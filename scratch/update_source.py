import json
import re
import asyncio
import sys
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def main():
    # 1. Update the local text
    with open('../contexts/BEVAMPED_Premium_Visual_Style_Guide.md', 'r', encoding='utf-8') as f:
        data = f.read()
    
    # Try parsing as JSON first
    try:
        json_data = json.loads(data)
        content = json_data['content']
    except json.JSONDecodeError:
        content = data
        
    # Replacements
    content = content.replace("Montserrat", "Jost")
    content = content.replace("Inter", "Manrope")
    
    # Also update the font import
    old_import = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Montserrat:wght@300;400;600;800;900&family=Inter:wght@300;400;600;700&display=swap"
    new_import = "https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400;1,600&family=Manrope:wght@300;400;500;600;700&display=swap"
    content = content.replace(old_import, new_import)
    
    # Save the updated raw markdown (no JSON wrapper so NotebookLM reads it perfectly)
    out_path = '../contexts/BEVAMPED_Premium_Visual_Style_Guide.md'
    with open(out_path, 'w', encoding='utf-8') as f:
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
            old_source_id = "d82af4ca-21ff-43a5-b30f-53ea9df97313"
            
            print("Deleting old source...")
            del_res = await session.call_tool("source_delete", arguments={
                "source_id": old_source_id,
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
