<script>
    import cheaters from "./cheaterboard.json";
    function formatTime(totalSeconds) {
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;

        let formattedHours = hours.toString();
        let formattedMinutes = minutes.toString().padStart(2, "0");
        let formattedSeconds = seconds.toString().padStart(2, "0");


        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }
</script>

<table>
    <tr>
        <th>Rank</th>
        <th>Username</th>
        <th>Kills</th>
        <th>Headshots</th>
        <th>Time spent</th>
    </tr>
    {#each cheaters as cheater, rank}
        <tr>
            <td>{rank+1}</td>
            <td>{cheater.name}</td>
            <td>{cheater.cheated_kills}</td>
            <td>{cheater.cheated_headshot_kills}</td>
            <td>{formatTime(cheater.cheated_time)}</td>
        </tr>
    {/each}
</table>
