import asyncio
import sys
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
            
            # Get Doctrine
            doc_res = await session.call_tool("source_get_content", arguments={
                "source_id": "3944613d-1651-4745-a93e-9f142cb6a4d2"
            })
            with open("contexts/BEVAMPED_Brand_Rebirth_Doctrine.md", "w", encoding="utf-8") as f:
                f.write(doc_res.content[0].text)
                
            # Get Visual Style Guide
            vis_res = await session.call_tool("source_get_content", arguments={
                "source_id": "d82af4ca-21ff-43a5-b30f-53ea9df97313"
            })
            with open("contexts/BEVAMPED_Premium_Visual_Style_Guide.md", "w", encoding="utf-8") as f:
                f.write(vis_res.content[0].text)
                
            print("Successfully extracted sources into contexts/")

if __name__ == "__main__":
    asyncio.run(main())
