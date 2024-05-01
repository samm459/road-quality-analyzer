export interface Analysis {
    valid_image: boolean
    rating: number
    ravelling: "none" | "mild" | "moderate" | "severe"
    flushing: "none" | "mild" | "moderate" | "severe"
    polishing: "none" | "mild" | "moderate" | "severe"
    rutting: "none" | "mild" | "moderate" | "severe"
    distortion: "none" | "mild" | "moderate" | "severe"
    rippling: "none" | "mild" | "moderate" | "severe"
    shoving: "none" | "mild" | "moderate" | "severe"
    settling: "none" | "mild" | "moderate" | "severe"
    frost_heave: "none" | "mild" | "moderate" | "severe"
    transverse_cracks: "none" | "mild" | "moderate" | "severe"
    reflection_cracks: "none" | "mild" | "moderate" | "severe"
    slippage_cracks: "none" | "mild" | "moderate" | "severe"
    longitudinal_cracks: "none" | "mild" | "moderate" | "severe"
    block_cracking: "none" | "mild" | "moderate" | "severe"
    alligator_cracking: "none" | "mild" | "moderate" | "severe"
    patches: "none" | "mild" | "moderate" | "severe"
    potholes: "none" | "mild" | "moderate" | "severe"
    reasoning: string
}
