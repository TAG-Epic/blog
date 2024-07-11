<script lang="ts">
    import type { BasePlayer } from "./networker/players/base";
    const CANVAS_HEIGHT = 1000;
    const CANVAS_WIDTH = 2000;

    class Renderer {
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        active: boolean;

        constructor(canvas: HTMLCanvasElement) {
            this.canvas = canvas;
            let context = this.canvas.getContext("2d");

            if (context === null) {
                throw "Could not get context for canvas";
            }
            this.context = context;
            this.active = false;
        }
        stop() {
            this.active = false;
        }
        start() {
            this.active = true;
            this.renderFrame();
        }
        renderFrame(): void {
            if (this.active) {
                requestAnimationFrame(() => {this.renderFrame()});
            }
            this.context.reset();

            let position = player.getPosition();

            this.context.ellipse(position.x, position.y, 10, 10, 0, 0, 360);
            this.context.fillStyle = "blue";
            this.context.fill();

        }
    }
    
    export let player: BasePlayer;
    let canvas: HTMLCanvasElement;
    let activeRenderer: Renderer | undefined;

    function handleCanvasChange(canvas: HTMLCanvasElement | undefined) {
        if (activeRenderer !== undefined) {
            activeRenderer.stop();
        }
        if (canvas !== undefined) {
            activeRenderer = new Renderer(canvas);
            activeRenderer.start();
        }
    }

    $: handleCanvasChange(canvas);
</script>

<canvas class="visualization" height={CANVAS_HEIGHT} width={CANVAS_WIDTH} bind:this={canvas} />

<style>
    .visualization {
        aspect-ratio: 1/2;
    }
</style>
