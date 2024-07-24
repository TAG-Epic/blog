from aiohttp import ClientSession
from urllib.parse import quote

DEFAULT_HEADERS = {
    "User-Agent": "Package-Version-Checker/1.0 contact me: https://discord.gg/3RFUm3eP5c for blog-post https://blog.farfrom.world/outdated-software-repositories for checking how outdated nixpkgs and similar are"
}

def debug(line):
    ...

async def get_pypi_version(session: ClientSession, package_name: str) -> str:
    response = await session.get(f"https://pypi.org/pypi/{quote(package_name)}/json", headers={"User-Agent": "Nix-Package-Updater/1.0 This API was hard to find"})


    if response.status != 200:
        text = await response.text()
        debug(f"Failed to access pip page for {package_name}: {response.status} {text}")
        raise
    data = await response.json()
    return data["info"]["version"]

async def does_pypi_version_exist(session: ClientSession, package_name: str, package_version: str) -> bool:
    response = await session.get(f"https://pypi.org/pypi/{quote(package_name)}/{quote(package_version)}/json")

    return response.status != 404
