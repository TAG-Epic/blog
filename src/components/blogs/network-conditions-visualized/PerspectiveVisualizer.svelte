<script lang="ts">
    import type { BasePlayer } from "./networker/players/base";
    import type { StaticShape } from "./shapes";
    import { ShapeType } from "./shapes";
    const CANVAS_HEIGHT = 1000;
    const CANVAS_WIDTH = 2000;

    export let staticShapes: StaticShape[] = [];

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
            
            this.#drawStatic();
            this.#drawPlayers();

        }
        #drawPlayers() {
            let player1Position = player1.getPosition();

            this.context.beginPath();
            this.context.ellipse(player1Position.x, player1Position.y, 10, 10, 0, 0, 360);
            this.context.fillStyle = "red";
            this.context.fill();

            let player2Position = player2.getPosition();
            
            this.context.beginPath();
            this.context.ellipse(player2Position.x, player2Position.y, 10, 10, 0, 0, 360);
            this.context.fillStyle = "blue";
            this.context.fill();
        }
        #drawStatic() {
            for (const shape of staticShapes) {
                if (shape.type === ShapeType.RECTANGLE) {
                    this.context.fillStyle = shape.color;
                    this.context.rect(shape.x, shape.y, shape.width, shape.height);
                    this.context.fill();
                }
            }
        }
    }
    
    export let player1: BasePlayer;
    export let player2: BasePlayer;
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
