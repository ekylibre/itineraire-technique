/**
 * Types of TIKA (@osfarm/itineraire-technique): the itinerary JSON format and
 * the RotationRenderer class. test/test.json is the reference example.
 */

/** An intervention, placed relative to the start of its step. */
export interface TikaIntervention {
    id?: string;
    /** Days from the start of the step (negative before it). Strings are accepted, as in the editor exports. */
    day: number | string;
    name: string;
    /** Above the step (intervention_top) or below it (intervention_bottom). */
    type: "intervention_top" | "intervention_bottom";
    /** Plain text (escaped unless allowHTML). Lines "Label: value" get a bold label. */
    description?: string;
    /** Adds a warning sign after the name. */
    important?: boolean;
    /** "planned": drawn hollow with a dashed outline. Done by default. */
    status?: "done" | "planned";
    /** Free field for the host application (e.g. its own id), given back by onInterventionClick. */
    ref?: unknown;
    [key: string]: unknown;
}

/** A step: a crop (or a secondary crop, such as a cover crop) between two dates. */
export interface TikaStep {
    id?: string;
    name: string;
    /** CSS color. */
    color?: string;
    /** ISO date (or Date). */
    startDate: string | Date;
    endDate: string | Date;
    description?: string;
    /** Computed by the renderer (months). */
    duration?: number;
    secondary_crop?: boolean;
    useDefaultColor?: boolean;
    useDefaultStartDate?: boolean;
    useDefaultEndDate?: boolean;
    /** Deprecated: appended to the description as "name : value" lines. */
    attributes?: { id?: string; name: string; value: string }[];
    interventions?: TikaIntervention[];
    [key: string]: unknown;
}

export interface TikaOptions {
    /** Frise (horizontal, default) or rotation (donut). */
    view?: "horizontal" | "donut";
    /** Textual list of the steps and interventions, next to or below the chart. */
    show_transcript?: boolean;
    title_top_interventions?: string;
    title_bottom_interventions?: string;
    title_steps?: string;
    show_climate_diagram?: boolean;
    /** Monthly normals, 12 values each. */
    climate_data?: { temperatures: number[]; precipitations: number[] };
    [key: string]: unknown;
}

export interface TikaAddress {
    raw?: string;
    town?: string;
    region?: string;
    department?: string;
    country?: string;
    gpsLocation?: { lat: number; lng: number } | null;
}

/** An itinerary ("system"), as exported by the editor. */
export interface TikaSystem {
    title?: string;
    options?: TikaOptions;
    address?: TikaAddress;
    steps: TikaStep[];
}

export interface RotationRendererSettings {
    /** Names and descriptions may contain HTML (previous behaviour). Plain text by default. */
    allowHTML?: boolean;
    /** Click on an intervention, on the chart or in the transcript. The objects are those of the data. */
    onInterventionClick?: (intervention: TikaIntervention, step: TikaStep) => void;
    /** Click on a step of the chart. */
    onStepClick?: (step: TikaStep) => void;
}

export declare class RotationRenderer {
    /**
     * @param target id of the container element, or the element itself
     * @param data an itinerary, or several (before/after mode, work in progress)
     */
    constructor(target: string | HTMLElement, data: TikaSystem | TikaSystem[], settings?: RotationRendererSettings);
    /** Draw the chart (and the transcript). Can be called again; listeners are not duplicated. */
    render(): void;
    /** Resize the chart to its container. */
    resize(): void;
    /** Release the chart and every listener the renderer added. */
    dispose(): void;
    toggleTranscription(): void;
    showClimateDiagram(): void;
    /** The ECharts instance, after render() (null after dispose()). */
    chart: unknown;
    readonly container: HTMLElement;
}

/** Escape a text for HTML. */
export declare function escapeHTML(text: unknown): string;

export default RotationRenderer;
