---
title: "How outdated are software repositories?"
description: "The results for my data-collection script for checking python packages on various"
pubDate: "Aug 24 2023"
heroImage: '/blog-placeholder-3.jpg'
---

<a href="#the-results">Skip to the results</a>
# Intro
Some time ago, I was bored and decided to see just *how* outdated software repositories are on nixpkgs. Later I wanted to expand on this to see how bad nixpkgs is compared to other distros.

Automatically checking for general repository "up-to-date-ness" is quite hard as you have to check for so many different upstream providers (GitHub, PyPI, crates.io etc) so for this I'm going to focus on specifically python as PyPI has a API and it was the first thing I thought of. 

There will be a few issues with my approach to doing this:
- Stability distributions like ubuntu will not be included in my results as they are outdated by design, and that wouldn't be fair to them.
- I'm only checking for python packages, as I don't want to implement upstream checks for everything.
- Some python packages are packaged in a unique way like [nextcord in nixpkgs](https://github.com/NixOS/nixpkgs/blob/045910a1a3108d5648e18de00bb39cedc24979c9/pkgs/development/python-modules/nextcord/default.nix#L25-L30)
- Some packages are packaged in a unique way like [pycrypto in nixpkgs](https://github.com/NixOS/nixpkgs/blob/045910a1a3108d5648e18de00bb39cedc24979c9/pkgs/development/python-modules/pycrypto/default.nix#L8) which is split into multiple files.

The data has been collected from:
- [nixpkgs](https://github.com/NixOS/nixpkgs)'s master branch

# PyPI's API
PyPI has an API documented at [pypa's warehouse docs](https://warehouse.pypa.io/api-reference/index.html) which was used to make this. Only now when I'm writing this I found the official docs.

> **Warning**  
> My scripts do not have rate-limiting, as I did not find any docs when I was writing the script.

We just need the [get project metadata](https://warehouse.pypa.io/api-reference/json.html#get--pypi--project_name--json) endpoint from the PyPI api.

# Getting metadata from nixpkgs
My approach to this was to read every `default.nix` file in the `nixpkgs/pkgs/development/python-modules/*` folders, and using regex to gather the pname and version.

This is a awful approach for a few reasons:
- Not all pnames match the PyPI name
- Some packages are split into multiple files.

But for these quick experiments, this is fine.

# The code
```py
import asyncio
from aiohttp import ClientSession
from pathlib import Path
import re

VERSION_REGEX = re.compile("version = \"(.+)\"")
PNAME_REGEX = re.compile("pname = \"(.+)\"")

MISSING_NIX_VERSION = 0
MISSING_NIX_PNAME = 0
MISSING_NIX_DEFAULT = 0
PYPI_ERROR = 0
UP_TO_DATE = []
OUTDATED = []

async def check(session: ClientSession, limiter: asyncio.Semaphore, path: Path):
    global MISSING_NIX_VERSION, MISSING_NIX_PNAME, PYPI_ERROR, UP_TO_DATE, OUTDATED, MISSING_NIX_DEFAULT

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
        print(f"Missing version on {path}")
        return

    if pname is None:
        MISSING_NIX_PNAME += 1
        print(f"Missing pname on {path}")
        return

    version = version.group(1)
    pname = pname.group(1)

    async with limiter:
        response = await session.get(f"https://pypi.org/pypi/{pname}/json", headers={"User-Agent": "Update-Checker/1.0 (https://blog.farfrom.world/outdated-software-repositories)"})
        if response.status != 200:
            text = await response.text()
            print(f"Failed to access pip page for {pname}: {response.status} {text}")
            PYPI_ERROR += 1
            return

        data = await response.json()

    upstream_version = data["info"]["version"]

    if version == upstream_version:
        UP_TO_DATE.append(pname)
        print(f"Package {pname} is up to date")
    else:
        print(f"Package {pname} has pypi: {upstream_version} and nix {version}")
        OUTDATED.append(pname)

async def main():
    session = ClientSession()
    limiter = asyncio.Semaphore(10)
    
    root_path = Path("/home/epic/Development/nixpkgs/pkgs/development/python-modules")
    module_paths = [path for path in root_path.glob("*") if path.is_dir()]

    print(f"Scanning {len(module_paths)} paths")
    
    await asyncio.gather(*[check(session, limiter, path) for path in module_paths])

    print("Stats:")
    print(f"Up to date: {len(UP_TO_DATE)}")
    print(f"Outdated: {len(OUTDATED)}")
    print(f"Missing nix version: {MISSING_NIX_VERSION}")
    print(f"Missing nix pname: {MISSING_NIX_PNAME}")
    print(f"Pypi error: {PYPI_ERROR}")

    with open("outdated.txt", "w+") as f:
        f.write("\n".join(OUTDATED))

asyncio.run(main())
```

# The results
## Nixpkgs
Up to date: 4414  
Outdated: 1776  
Missing nix version: 96  
Missing nix pname: 17  
Pypi error: 106  

<img src="/assets/blogs/outdated-software-repositories/nixpkgs-pie.svg" alt="" />
