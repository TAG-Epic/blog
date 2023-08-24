import asyncio
from aiohttp import ClientSession
from pathlib import Path
import re
from pypi import get_pypi_version, does_pypi_version_exist
from nextcore.common import TimesPer
from tqdm.asyncio import tqdm_asyncio


VERSION_REGEX = re.compile("version = \"(.+)\"")
PNAME_REGEX = re.compile("pname = \"(.+)\"")

MISSING_NIX_VERSION = 0
MISSING_NIX_PNAME = 0
MISSING_NIX_DEFAULT = 0
WRONG_NIX_VERSION = 0
PYPI_ERROR = 0
UP_TO_DATE = []
OUTDATED = []

def debug(line):
    ...

async def check(session: ClientSession, limiter: TimesPer, path: Path):
    global MISSING_NIX_VERSION, MISSING_NIX_PNAME, PYPI_ERROR, UP_TO_DATE, OUTDATED, MISSING_NIX_DEFAULT, WRONG_NIX_VERSION

    default_path = path.joinpath("default.nix")

    if not default_path.exists():
        MISSING_NIX_DEFAULT += 1
        return

    with default_path.open("r") as f:
        text = f.read()
        version = VERSION_REGEX.search(text)
        pname = PNAME_REGEX.search(text)


    if version is None:
        MISSING_NIX_VERSION += 1
        debug(f"Missing version on {path}")
        return

    if pname is None:
        MISSING_NIX_PNAME += 1
        debug(f"Missing pname on {path}")
        return

    version = version.group(1)
    pname = pname.group(1)

    async with limiter.acquire():
        try:
            upstream_version = await get_pypi_version(session, pname)
        except:
            PYPI_ERROR += 1
            return
    async with limiter.acquire():
        version_exists = await does_pypi_version_exist(session, pname, version)

        if not version_exists:
            debug(f"Nix version {version} not found on PyPI")
            WRONG_NIX_VERSION += 1
            return 


    if version == upstream_version:
        UP_TO_DATE.append(pname)
        debug(f"Package {pname} is up to date")
    else:
        debug(f"Package {pname} has pypi: {upstream_version} and nix {version}")
        OUTDATED.append(pname)
async def main():
    session = ClientSession()
    
    root_path = Path("/tmp/nixpkgs/pkgs/development/python-modules")
    module_paths = [path for path in root_path.glob("*") if path.is_dir()]

    debug(f"Scanning {len(module_paths)} paths")

    rate_limiter = TimesPer(100, 1)
    
    # await asyncio.gather(*[check(session, rate_limiter, path) for path in module_paths])
    # progress = tqdm_asyncio()
    # await progress.gather(*[check(session, rate_limiter, path) for path in module_paths])

    for id, path in enumerate(module_paths):
        while True:
            print(f"{path} ({id}/{len(module_paths)})")
            try:
                await asyncio.wait_for(check(session, rate_limiter, path), timeout=5)
            except asyncio.TimeoutError:
                continue
            break

    print("Stats:")
    print(f"Up to date: {len(UP_TO_DATE)}")
    print(f"Outdated: {len(OUTDATED)}")
    print(f"Missing nix version: {MISSING_NIX_VERSION}")
    print(f"Missing nix pname: {MISSING_NIX_PNAME}")
    print(f"Wrong nix version: {WRONG_NIX_VERSION}")
    print(f"Pypi error: {PYPI_ERROR}")

    with open("outdated.txt", "w+") as f:
        f.write("\n".join(OUTDATED))

asyncio.run(main())



