<script lang="ts">
    import Cheaterboard from "./Cheaterboard.svelte";
    import MapleConfession from "./assets/maple-confession.png";
</script>

<p>
    As you might know there was a exploit in vail for a <i>long</i> time that allowed you to freeze a hardpoint lobby forever. This exploit was abused by tons of people to grind stats.<br/>
    A while back I started tracking everyone's stats as I was receiving reports from friends catching GigaKnight abusing the hardpoint exploit to get to #1 on the kill leaderboards.<br/><br/>
    
    So back to present day, I have 67 million rows worth of stats and im tracking 77k vail users's stats constantly.
    Up to this day this data has mostly been used to create ✨ pretty graphs ✨ but today that is changing.
</p>

<h2>The Cheaterboard</h2>
<Cheaterboard />
<h2>Lets talk about the numbers</h2>
<p>
This data has been gathered by <a href="https://github.com/tag-epic/vail-api">my (unofficial) VAIL API</a> which is constantly watching the leaderboard for changes and then saving a snapshot of that user's stats in <a href="https://questdb.io">QuestDB</a> for timeseries purposes and also saved to our "hot" db using SQLite.<br/>
Unfortunately I was a bit of a moron and accidentally wiped my database and misattributed stats to Maple 😭, so this only counts data after 21 May 2024. <br/><br/>

We detect exploited lobbies by checking for increases in <code>gamemode-hp-game-seconds</code> that are longer than hardpoints can possibly last while not increasing your <code>gamemode-hp-games-won</code>/<code>gamemode-hp-games-lost</code>/<code>gamemode-hp-games-drawn</code>. If any other wins/losses is registered, that snapshot is immediately discarded as I want to keep this as false positive free as possible.
This works as stats are only submitted once a match is finished or you leave.
The only false positive that can happen is that you join a hardpoint lobby -&gt; get kills -&gt; leave before it ends on repeat for the duration you are here on for. If you win/lose a single hardpoint game this won't count.
False negatives has a decent chance of happening here, sadly not much I can do about it. This should catch most of the "major" exploiters anyway.
</p>
<h2>Accidentally finding more cheaters</h2>
<p>
Before I knew that stats was misattributed to Maple for the first day the stat scraper was on, I ran the script with no cutoff and to my surprise Maple was #1 on the leaderboard with <code>1657</code> cheated kills.
This was quite a surprise to me as Maple has been very against abusing the hardpoint exploit, so I DMed Maple.<br/>

I may have then uh given maple a <i>mild heart attack</i> (oops, sorry!) after asking him. After which he did confess to using it, however we found out this was before I started tracking the stats so he is not on the cheaterboard.
<img src={MapleConfession} alt="Maple confessing to cheating">
</p>
<style>
    h2 {
        margin-top: 2rem;
        margin-bottom: 1rem;
    }
</style>
