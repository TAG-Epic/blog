export type FiddleAnalyticTrackerOptions = {
    visualization: string
};
export type FiddleAnalyticControlOptions = {
    input: string;
};
export class FiddleAnalyticTracker {
    #options: FiddleAnalyticTrackerOptions;
    constructor(options: FiddleAnalyticTrackerOptions) {
        this.#options = options;
    }

    createControlHook(options: FiddleAnalyticControlOptions): (value: any) => void {
        let isNotInitial = false;
        return () => {
            if (!isNotInitial) {
                isNotInitial = true;
                return;
            }
            console.log(`submitting fiddle event for ${this.#options.visualization} (control ${options.input}) to plausible`);
            
            let plausible = window["plausible"];
            if (plausible === undefined) {
                console.warn("plausible not loaded :(");
                return;
            }

            plausible(`network conditions visualized: fiddle`, {
                props: {
                    visualization: this.#options.visualization,
                    input: options.input
                }
            });
        }
    }
}
