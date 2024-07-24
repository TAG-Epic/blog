import asyncio
from aiohttp import ClientSession
from pathlib import Path
import re
from pypi import get_pypi_version, does_pypi_version_exist
from tqdm.asyncio import tqdm_asyncio
from nextcore.common import TimesPer

MISSING_GENTOO_VERSION = 0
WRONG_GENTOO_VERSION = 0
PYPI_ERROR = 0
UP_TO_DATE = []
OUTDATED = []


def debug(line):
    ...

async def check(session: ClientSession, limiter: TimesPer, path: Path):
    global MISSING_GENTOO_VERSION, MISSING_GENTOO_PNAME, PYPI_ERROR, UP_TO_DATE, OUTDATED, MISSING_GENTOO_DEFAULT, WRONG_GENTOO_VERSION

    pname = path.name
    
    versions = []
    for file in path.glob("*.ebuild"):
        gentoo_version = file.name.removeprefix(pname + "-").removesuffix(".ebuild") # TODO: This does not handle gentoo patch versions!
        versions.append(gentoo_version)
    
    if len(versions) == 0:
        MISSING_GENTOO_VERSION += 1
        debug(f"Missing ebuild on {pname}")
        return
    versions.sort()
    latest_version = versions[-1]

    async with limiter.acquire():
        try:
            upstream_version = await get_pypi_version(session, pname)
        except:
            PYPI_ERROR += 1
            return
    async with limiter.acquire():
        version_exists = await does_pypi_version_exist(session, pname, latest_version)
        if not version_exists:
            debug(f"Gentoo version {latest_version} not found on PyPI")
            WRONG_GENTOO_VERSION += 1
            return 
    
    latest_version = str(latest_version)
    if latest_version == upstream_version:
        UP_TO_DATE.append(pname)
        debug(f"Package {pname} is up to date")
    else:
        debug(f"Package {pname} has pypi: {upstream_version} and gentoo {latest_version}")
        OUTDATED.append(pname)

async def main():
    session = ClientSession()
    limiter = asyncio.Semaphore(10)
    
    root_path = Path("/tmp/gentoo/dev-python/")
    module_paths = [path for path in root_path.glob("*") if path.is_dir()]

    debug(f"Scanning {len(module_paths)} paths")

    rate_limiter = TimesPer(25, .25)

    # progress = tqdm_asyncio()
    # await asyncio.gather(*[check(session, limiter, path) for path in module_paths])
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
    print(f"Missing gentoo version: {MISSING_GENTOO_VERSION}")
    print(f"Wrong gentoo version: {WRONG_GENTOO_VERSION}")
    print(f"Pypi error: {PYPI_ERROR}")

    with open("outdated.txt", "w+") as f:
        f.write("\n".join(OUTDATED))

asyncio.run(main())



