---
title: "How outdated are software repositories?"
description: "The results for my data-collection script for checking Python packages on various"
pubDate: "Aug 24 2023"
heroImage: '/assets/blogs/outdated-software-repositories/header.jpg'
---

<a href="#the-results">Skip to the results</a>

# Intro
Do you ever wonder just *how* outdated your favorite rolling release distro's repositories are?  
Because that question came to my mind some time ago, after seeing too many "new version availiable" popups while playing [xonotic](https://xonotic.org).

# Measuring it
Now, how do you measure how up-to-date a repository is automatically? Because with Nixpkgs having more than 80k packages, and Gentoo having over 18k, checking how up-to-date they are manually will be no easy task.

My plan for measuring it is:
1. Grab all the Python packages in the repo and their versions
2. Check with PyPI to see if that is the most recently uploaded version
3. For a extra sanity check in case someone put in a weird version number, don't count it if there hasn't also been a release with that version.

While I'd love to do this for every possible distro, I've only done it for Nixpkgs and Gentoo as they are pretty easy to automate finding package versions, and both have categories for Python packages.

I'd also love to expand this to checking github releases aswell, as I don't know how representative Python packages is for the repository.

# The results
The code used to measure the data below can be found in the [assets for this post](https://github.com/TAG-Epic/blog/tree/master/public/assets/blogs/outdated-software-repositories/code).

The code is awful. Feel free to use it to replicate my results/track how the change is over time but please don't actually use this.

## Nixpkgs
![pie graph](/assets/blogs/outdated-software-repositories/charts/nixpkgs.svg)

**Up to date:** 4908  
**Outdated:** 1146  
**Missing Nix version:** 98  
**Missing Nix pname:** 17  
**Wrong Nix version:** 199  
**Package not found:** 110  

## Gentoo
![pie graph](/assets/blogs/outdated-software-repositories/charts/gentoo.svg)

**Up to date:** 1017  
**Outdated:** 69  
**Missing Gentoo version:** 0  
**Wrong Gentoo version:** 495  
**Package not found:** 58  

# Terms
**Up to date:** exact same version as the one on PyPI  
**Outdated:** a newer version is available on PyPI  
**Missing nix/gentoo version:** could not parse the current version from the source file  
**Wrong nix/gentoo version:** the version in the repository doesn't exist on PyPI  
**Package not found:** the package does not exist on PyPI  
