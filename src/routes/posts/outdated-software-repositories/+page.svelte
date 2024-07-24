<script lang="ts">
    import GentooChart from "./assets/charts/gentoo.svg";
    import NixpkgsChart from "./assets/charts/nixpkgs.svg";
</script>
<a href="#the-results">Skip to the results</a>

<h2>Intro</h2>
Do you ever wonder just *how* outdated your favorite rolling release distro's repositories are?  
Because that question came to my mind some time ago, after seeing too many "new version availiable" popups while playing <a href="https://xonotic.org">Xonotic</a>.

<h2>Measuring it</h2>
Now, how do you measure how up-to-date a repository is automatically? Because with Nixpkgs having more than 80k packages, and Gentoo having over 18k, checking how up-to-date they are manually will be no easy task.

My plan for measuring it is:
<ol>
    <li>Grab all the Python packages in the repo and their versions</li>
    <li>Check with PyPI to see if that is the most recently uploaded version</li>
    <li>For a extra sanity check in case someone put in a weird version number, don't count it if there hasn't also been a release with that version.</li>
</ol>
While I'd love to do this for every possible distro, I've only done it for Nixpkgs and Gentoo as they are pretty easy to automate finding package versions, and both have categories for Python packages.

I'd also love to expand this to checking github releases aswell, as I don't know how representative Python packages is for the repository.

<h2>The results</h2>
The code used to measure the data below can be found in the <a href="https://github.com/TAG-Epic/blog/tree/master/public/assets/blogs/outdated-software-repositories/code">assets for this post</a>

The code is awful. Feel free to use it to replicate my results/track how the change is over time but please don't actually use this.

<h3>Nixpkgs</h3>
<img src={NixpkgsChart} alt="">
<table>
    <tr>
        <td>Up to date</td>
        <td>4908</td>
    </tr>
    <tr>
        <td>Outdated</td>
        <td>1146</td>
    </tr>
    <tr>
        <td>Missing nix version</td>
        <td>98</td>
    </tr>
    <tr>
        <td>Missing nix pname</td>
        <td>17</td>
    </tr>
    <tr>
        <td>Wrong nix version</td>
        <td>199</td>
    </tr>
    <tr>
        <td>Package not found</td>
        <td>110</td>
    </tr>
</table>

<h3>Gentoo</h3>
<img src={GentooChart} alt="">

<table>
    <tr>
        <td>Up to date</td>
        <td>1017</td>
    </tr>
    <tr>
        <td>Outdated</td>
        <td>69</td>
    </tr>
    <tr>
        <td>Missing gentoo version</td>
        <td>0</td>
    </tr>
    <tr>
        <td>Wrong gentoo version</td>
        <td>495</td>
    </tr>
    <tr>
        <td>Package not found</td>
        <td>58</td>
    </tr>
</table>

<h2>Terms</h2>
<table>
    <tr>
        <td>Up to date</td>
        <td>exact same version as the one on PyPI</td>
    </tr>
    <tr>
        <td>Outdated</td>
        <td>a newer version is available on PyPI</td>
    </tr>
    <tr>
        <td>Missing nix/gentoo version</td>
        <td>Could not parse the current version from the source file</td>
    </tr>
    <tr>
        <td>Wrong nix/gentoo version</td>
        <td>The version in the repository doesn't exist on PyPI</td>
    </tr>
    <tr>
        <td>Package not found</td>
        <td>The package does not exist on PyPI</td>
    </tr>
</table>
