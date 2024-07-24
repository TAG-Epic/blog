<script lang="ts">
    import CodeBlock from "$lib/components/CodeBlock.svelte";

    import SendNetworkLogsVisualizer from "./templates/SendNetworkLogsVisualizer.svelte";
    import NoSmoothingStutteringComparison from "./templates/NoSmoothingStutteringComparison.svelte";
    import PacketLossPingVisualization from "./templates/PacketLossPingVisualization.svelte";
    import JitterVisualization from "./templates/JitterVisualization.svelte";
    import SmoothingStutteringComparison from "./templates/SmoothingStutteringComparison.svelte";
    import JigglePeakingVisualization from "./templates/JigglePeakingVisualization.svelte";
    import PingSwingVisualization from "./templates/PingSwingVisualization.svelte";
    import PlayerMarker from "./PlayerMarker.svelte";

let smoothingImplementation = `
let timeBetween = this.#positionInfo.last.receivedAt - this.#positionInfo.second.receivedAt;

// Fixes 0 division error
if (timeBetween === 0) {
    return this.#positionInfo.second.position;
}

let offsetStop = this.#positionInfo.last.receivedAt + timeBetween;
let offsetStart = this.#positionInfo.second.receivedAt + timeBetween;

let currentTime = Date.now();

let currentRelativeToStart = currentTime - offsetStart;
let progressFraction = currentRelativeToStart / timeBetween;
    
if (progressFraction > 1 && !this.#config.smoothing.estimatePast) {
    return this.#positionInfo.last.position;
}
let lastPosition = this.#positionInfo.second.position;
let newPosition = this.#positionInfo.last.position;

return {
    x: lastPosition.x + ((newPosition.x - lastPosition.x) * progressFraction),
    y: lastPosition.y + ((newPosition.y - lastPosition.y) * progressFraction)
};
`.trim();
</script>
<p>
    In the <a href="https://discord.gg/vailvr">VAIL VR discord</a> I often see people complain about various network conditions and just blame it on ping, to the point where people are blaming frame drops on ping.
    This annoys me <i>slightly</i> so I've decided to bite the bullet and write some frontend code to visualize what the different network conditions <i>actually</i> does to your gameplay.
</p>
<h2>Lets take a step back</h2>
<p>
    As this will be shared in the <a href="https://discord.gg/vailvr">VAIL VR discord</a> whenever someone who don't know how games networking works start to complain and blame ping, or when people complain to the devs saying "just magically fix netcode"<a href="#footnote-pls-fix-netcode">¹</a>,
    I need to consider that they probably aren't massive networking nerds. So lets go through some basic stuff:<br/>
    Your position isn't magically sent smooth to all the other players for performance reasons. It is instead sent as individual position "ticks" at a fixed tick rate<a href="#footnote-what-is-tickrate">²</a>
</p>
<SendNetworkLogsVisualizer />
<p>
    The <PlayerMarker color="red" /> local player is smooth as we know what the position is every frame.
    This is different for the <PlayerMarker color="blue" /> remote, which is the local player but from the perspective of another player, so this will only be updated once per tick.
</p>
<NoSmoothingStutteringComparison /> 
<p>
    Vail runs at 60<a href="#footnote-vails-tickrate">³</a> ticks per second, which does look fine enough in the ideal conditions we have right now.
    But unfortunately data doesn't magically instantly transport to anywhere in the world, so we have things like ping and packetloss.
</p>
<PacketLossPingVisualization />
<p>
    In VAIL the ping number that is shown on the scoreboard is not as simple as it seems. This is referring to RTT (the round trip time) which is how long it takes for a message to go from you -&gt; the game server -&gt; you again.
    RTT generally isn't too useful when dealing with games, especially movement as the messages goes from you -&gt; the game server, but doesn't require sending a acknowledgement for receiving it back. 
    How long it takes for a message to go from you -&gt; the game server is referred to as latency.
    In these visualizations we are visualizing messages going from you -&gt; the game server -&gt; another player. We will be referring to this as end to end latency (E2E latency).

    To keep things simple we will be assuming all latency is symmetric (you -&gt; the game server and the game server -&gt; you having the same latency).
    If you want to plug in actual metrics from a game, you can use this to find out what your E2E latency should be.
    <CodeBlock language="python" code="e2e_latency = (your_rtt / 2) + (enemy_rtt / 2)" />
    If you would rather use some preset values, you get around <code>40ms</code> E2E latency for EU only matches, and for the more common example of 2 EU players on NA servers would be around <code>120ms</code> E2E latency.
    <br/><br/>
    Anyways latency isn't just a "static" time, there is also jitter which is a part of your latency which is random.
    My super simplified version of jitter just does
    <CodeBlock language="python" code="latency = static_latency + (jitter * random.random())" />
    which isn't perfect, but it should be accurate enough for these visualizations.
</p>
<JitterVisualization />
<p>
    It's quite hard to get some good reference numbers for jitter as this is something that doesn't show in game in VAIL, however I would guess a normal game for me would be around 30ms jitter. Remember that jitter is both from you -&gt; the game server and the game server -&gt; other players.
    
    All these things makes the game experience <i>worse</i>, but how would adding smoothing impact these?
</p>
<SmoothingStutteringComparison />
<p>
    This hides the ticks and jitter pretty well and allows you to use a lot lower tick rate while still maintaining smooth gameplay.
    This has it's own issues like making the positions delayed, but this is worth it for smooth gameplay.

    My smoothing implementation is quite simple and probably not as sophisticated as the one used by VAIL and other games.
</p>
<CodeBlock code={smoothingImplementation} language="js" />
<p>
    My implementation also supports extrapolation<a href="footnote-what-is-extrapolation">⁴</a> continuing estimating the position past what we know, which may work well in environments with higher packet loss.
    This is however not used by games like VAIL as they "prefer what you see be tightly coupled to the raw data/updates"<a href="#footnote-why-vail-doesnt-use-extrapolation">⁵</a>.
    
    These are the most important networking concepts that can cause issues when playing games. There are some other like bandwidth that are also important, however they can be pretty easily emulated by just increasing packetloss and E2E latency as tick rate goes up.
</p>
<h2>Alright, let's get into how this affects gameplay</h2>
<h3>Jigglepeeking</h3>
<p>
    Jigglepeeking is when you peek in and out from behind a wall quickly to get some shots in before unpeeking before the enemy is able to see you.
    This works really well on low-tickrate games, but isn't as effective on high tickrate games.
    
</p>
<JigglePeakingVisualization />
<p>
    The player is invisible here from the <PlayerMarker color="blue" /> remote perspective as the player is ticked when the player is behind cover and not when they are outside cover.
    So the reason "jigglepeeking doesn't work in VAIL" is because it has a really high tickrate.
</p>
<h3>Ping swinging</h3>
<p>
    Ping swinging is where you swing around a corner where you know the enemy is in view so that you can use your ping to kill them before they can even see you.
    Ping swinging is a pretty useful way to get a trade as in VAIL it trusts both clients when they say they killed the enemy.
</p>
<PingSwingVisualization />
<h2>Footnotes</h2>
<ol class="footnotes">
    <li id="footnote-pls-fix-netcode"><a href="https://discord.com/channels/710682414225162301/1223413597435072653">cough cough</a></li>
    <li id="footnote-what-is-tickrate">Tick rate is how many times a specific action should be ran. Minecraft for example does all its game logic 20 times per second.</li>
    <li id="footnote-vails-tickrate"><a href="https://discord.com/channels/710682414225162301/1223413597435072653/1223982256431824986">VAIL's tickrate confirmed by aoud</a></li>
    <li id="footnote-what-is-extrapolation"><a href="https://en.wikipedia.org/wiki/Extrapolation">Extrapolation explained by WikiPedia</a></li>
    <li id="footnote-why-vail-doesnt-use-extrapolation"><a href="https://discord.com/channels/710682414225162301/1223413597435072653/1223588169409105950">Why VAIL doesn't use extrapolation</a></li>
</ol>
