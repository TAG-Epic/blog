<script lang="ts">
	import InitialThreadMessages from "./assets/initial-thread-start.png";
	import RainbowSixSiegeDrone from "./assets/rainbow-six-siege-drone.webp";
	import StationaryDrone from "./assets/stationary-drone.jpeg";
</script>
<style>
	img {
		max-width: 100%;
	}
</style>
<section id="section-intro">
	<h1>Lets start with the backstory</h1>
	<p>
		Back a while ago someone posted <a href="https://discord.com/channels/710682414225162301/1289843326832349234">a suggestion about adding kamikaze drones to counter campers</a> which was not very well received
	</p>
	<img src={InitialThreadMessages} alt="the start of the 'can we have kamikaze drones' thread, with 48 downvotes and 0 upvotes with messages where 1 is threatening to quit VAIL, 2 is saying this would ruin the game and 1 is asking if they are making suggestions to make the game die" />
	<p>
		After that we entered into a 800+ message long thread about how something like this could be adapted into a mechanic that could work well in VAIL, being fun yet balanced for both new players and competitive players.
		However as the thread was going a new problem was encountered: new people are joining the conversation and is getting confused around the conversation.
		This makes a lot of sense as some of the messages has tons of messages between the message and the response to that message, and hell even multiple sub-conversations of the conversation trying to think of different ideas to see how they work, but ultimately ending up with them clearly not being viable. This makes for a discussion very hard to follow, and simply asking new people to the conversation to just "read up" is not ideal.
		<br/>
		The goal of this article will be to try and re-write the discussion from the conversation in a more structured and concise way, while still not sparing any of the details.
	</p>
</section>

<h1 id="title-universally-hated-ideas">Universally hated ideas</h1>
<section id="section-rainbow-six-siege-drone">
	<h2>The rainbow six seige drone</h2>
	<img src={RainbowSixSiegeDrone} alt="">
	<p>
		This allows you to spawn a drone you control fully to spy on your enemy while you attack the defenders.
		The defenders can counter the drones with electrical utility or shooting the drones.

		This is a very cool concept for Rainbow Six Siege, but doesn't fit the pacing nor maps in VAIL.
		This also adds persistent utility, which doesn't really fit with the convention of utility being temporary.
	</p>
	<h3>Positives</h3>
	<ul>
		<li>This is very realistic and would fit in lore wise with minor changes</li>
	</ul>
	<h3>Negatives</h3>
	<ul>
		<li>This doesn't fit the pacing VAIL currently has and players love</li>
		<li>VAIL maps aren't built for small nade/drone holes, so drones would require a lot of map changes to have drones that are worth putting in positions</li>
		<li>This would make information very cheap</li>
		<li>Countering it depends on looking for nooks and crannies for drones, which is pretty boring</li>
	</ul>
</section>
<section id="section-stationary-drones">
	<h2>Stationary drones</h2>
	<img src={StationaryDrone} alt="a drone standing still in the sky" />
	<p>
		The idea for this would be that you could somehow deploy a drone and move it around, and let it stay there and go back to control it later.

		This is somewhat similar to Echo's drones from Rainbow Six Siege again, however it wouldn't have any disguising nor be limited to either floor or ceiling.
	</p>
	<h3>Positives</h3>
	<ul>
		<li>This is very realistic and fits in lore-wise</li>
	</ul>
	<h3>Negatives</h3>
	<ul>
		<li>This would fit in much more defender sided scenarios than attacker sided.</li>
		<li>This doesn't fit the pacing VAIL currently has and players love</li>
		<li>Countering it would require looking up quite a lot looking for the drones, which is tiring for your neck and is hard for stock players to do</li>
	</ul>
</section>

<h1 id="title-ideas-needing-more-discussion">Ideas with more discussion needed</h1>
<p>
	These ideas where still being discussed at the closure of the <a href="https://discord.com/channels/710682414225162301/1289843326832349234/1290397034393636896">last closure of the last thread</a>, however we never got done fully discussing them so negatives/positives haven't been figured out yet.
	Remember that this is supposed to be a "living document" updated with points from the discussions about these, so constructive discussions about these are very welcome and appreciated &lt;3
</p>
<section id="section-throwable-camera">
	<h2>Throwable camera</h2>
	<p>
		A camera you can throw over walls and similar where you instantly switch to its perspective as you throw it, but you go back to your character if the camera is either shot or it lands.

		This can be explained in a few reasons in the lore
	</p>
	<ul>
		<li>Countries are consistently spying on eachother in the real world, and the equipment needs to be swapped out relatively often as they are discovered.</li>
		<li>This can be a "<a href="https://www.merriam-webster.com/wordplay/what-does-macgyver-mean-slang-definition">MacGyver</a>" solution for information, for example made using a GoPro and some VR glasses</li>
	</ul>
	<h3>Positives</h3>
	<ul>
		<li>This acts more like a normal utility, where you throw it and let it do its thing</li>
		<li>This is balanced by the thrower being locked into the utility until it's destroyed. This is useful for 1v1's as the enemy can counter a bad camera throw by rushing your character and killing you while you are defenseless</li>
		<li>This is still very skill based as you need to hit the camera in a good location and be able to see all the enemies and call them out in the short time before the camera is destroyed</li>
	</ul>
	<h3>Negatives</h3>
	<ul>
		<li>This won't have any use for non-artifact, and will have little impact outside higher skill gameplay as information is not that important there</li>
		<li>This makes fakes harder. They are still possible by hiding inside things like yard building on miru, however this is very map specific</li>
		<li>This will make the thrower probably quite dizzy.</li>
	</ul>
</section>
<section id="section-aimable-rocket">
	<h2>Aimable missile</h2>
	<p>
		This is inspired by Fortnite's guided missiles.
		Imagine having a missile as a utility that you can fire and gain control over when you fire it. It has a constant speed forward, but you can steer it (however with a big steering radius to balance it, later on this)

		After firing it has a ~5 second countdown until it explodes unless you hit something with it or the enemy shoots it down, in those cases it would explode immediately.
		You would not be able to exit the missile until it has exploded.
	</p>
	<h3>Balancing</h3>
	<h4>Turn radius</h4>
	<p>
		The primary way I'd balance this would be making the turn radius quite high. This combined with the explode countdown makes it so that you have to stand relatively exposed as any "hidden" spots require tight turns, which eats quickly at your explosion countdown timer.
		This also makes it a lot harder to hit enemies that are trying to dodge it, which is a nice positive.
	</p>
	<h4>Damage</h4>
	<p>
		The primary goal is not for this to be a replacement for frags/impacts, so damage is something to be careful about. The reason damage is here is to make it more viable in public matches where strategy and information is not that important. However damage is still important as you want the to balance the impact of actually hitting your missile and just deciding to ignore all enemies and try to get as much info as possible with your missile.
	</p>
	<p>TODO: Write me!</p>
	<h3>Positives</h3>
	<ul>
		<li>This acts somewhat like a normal utility, where it's some temporary projectile you control</li>
		<li>Can be used on hardpoint, however this is more the aimable missile side</li>
	</ul>
	<h3>Negatives</h3>
	<ul>
		<li>This gives you quite a lot of visibility over site, and requires quite a lot of coordination to limit the amount of info gathered</li>
		<li>This would be very hard to fit in the story/game aesthetic</li>
		<li>This will make the thrower probably quite dizzy.</li>
	</ul>
</section>

