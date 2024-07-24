<script lang="ts">
    export let color;
</script>
<svg xmlns="http://www.w3.org/2000/svg" class="player-character" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="50" fill={color} />
</svg>
<style>
    .player-character {
        height: 1ch;
        width: 1ch;
    }
</style>
