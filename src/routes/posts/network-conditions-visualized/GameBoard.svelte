<script lang="ts">
    import type { BasePlayer } from "./networker/players/base";
    import type { StaticShape } from "./shapes";
    import { ShapeType } from "./shapes";
    export let canvas_size: number = 600;

    export let players: BasePlayer[];
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
            for (const player of players) {
                let position = player.getPosition();
                let renderConfig = player.getRenderConfig();
                this.context.beginPath();
                this.context.ellipse(position.x, position.y, 10, 10, 0, 0, 360);
                this.context.fillStyle = renderConfig.color;
                this.context.fill();

            }
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

<canvas class="visualization" height={canvas_size} width={canvas_size} bind:this={canvas} />

<style>
    .visualization {
        aspect-ratio: 1/1;
        max-width: 100%;
    }
</style>
