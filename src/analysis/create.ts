import { OpenAI } from 'openai'
import { Analysis } from '.'
import fs from 'fs'
import { object, string, number, boolean } from 'yup'

/**
 * createAnalysis
 * 
 * Analyzes an image of a road and returns an Analysis.
 * 
 * @param imageUrl The URL of the image to analyze
 * @returns a number between 1 and 10 representing the condition of the pavement
 */
export const createAnalysis = async (imageUrl: string): Promise<Analysis> => {
    // Check if the OPENAI_API_KEY environment variable is set
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('Missing OPENAI_API_KEY environment variable')
    }

    // Create an instance of the OpenAI API client
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    // Generate a response from the GPT-4 model
    const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: "text",
                        text: prompt,
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": imageUrl,
                            "detail": "high"
                        }
                    }
                ]
            },
        ],
    })

    // Extract the JSON string from the response
    const analysisString = response.choices[0]?.message?.content

    if (!analysisString) {
        throw new Error('Failed to generate a response from AI')
    }

    // Parse the rating as a number
    const analysisJSON = JSON.parse(analysisString.replace("\`\`\`json\n", "").replace("\n\`\`\`", "").trim())

    // Validate the analysis object
    const distressSchema = string().oneOf(['none', 'mild', 'moderate', 'severe'])
    const analysisSchema = object({
        valid_image: boolean().required(),
        rating: number().required().min(0).max(10),
        raveling: distressSchema,
        flushing: distressSchema,
        polishing: distressSchema,
        rutting: distressSchema,
        distortion: distressSchema,
        rippling: distressSchema,
        shoving: distressSchema,
        settling: distressSchema,
        frost_heave: distressSchema,
        transverse_cracks: distressSchema,
        reflection_cracks: distressSchema,
        slippage_cracks: distressSchema,
        longitudinal_cracks: distressSchema,
        block_cracks: distressSchema,
        alligator_cracks: distressSchema,
        patches: distressSchema,
        potholes: distressSchema,
        reasoning: string().required(),
    })

    try {
        // Validate the analysis object
        await analysisSchema.validate(analysisJSON)

        // Return the analysis object
        return analysisJSON as Analysis
    } catch (error) {
        throw new Error(`Invalid analysis from AI`)
    }
}

export const analysisInterface = fs.readFileSync('src/analysis/index.ts', 'utf-8')

/**
 * prompt
 * 
 * The prompt text to use for the GPT-4 model. 
 * The prompt text provides a guide to scoring the condition of the pavement based on common asphalt pavement surface distress.
 * This is based on the Asphalt PASER Manual
 */
export const prompt = `
        Use the following guide to score the condition of the pavement and respond with a JSON object following the Analysis interface.

        There are four major categories of common asphalt pavement surface distress. Watch out for the following signs:

        1. Surface defects
        2. Surface deformation
        3. Cracks
        4. Patches and potholes

        Surface defects
        - Raveling:
            Raveling is progressive loss of pavement
            material from the surface downward,
            caused by: stripping of the bituminous
            film from the aggregate, asphalt hardening due to aging, poor compaction
            especially in cold weather construction,
            or insufficient asphalt content. Slight to
            moderate raveling has loss of fines.
            Severe raveling has loss of coarse
            aggregate. Raveling in the wheelpaths
            can be accelerated by traffic.
        - Flushing:
            Flushing is excess asphalt on the
            surface caused by a poor initial asphalt
            mix design or by paving or sealcoating
            over a flushed surface.
        - Polishing:
            Polishing is a smooth slippery surface
            caused by traffic wearing off sharp
            edges of aggregates.

        Surface deformation
        - Rutting:
            Rutting is displacement of material,
            creating channels in wheelpaths.
            It is caused by traffic compaction or
            displacement of unstable material.
            Severe rutting (over 2”) may
            be caused by base or subgrade
            consolidation.
        - Shoving:
            Shoving is a series of ripples across a
            pavement caused by the asphalt mix
            being too hot or too tender during
            compaction.
        - Depression:
            Depression is a localized low spot in
            the pavement caused by settlement of the
            base or subgrade, poor drainage, or
            heavy traffic.

        Cracks
        - Transverse cracks:
            A crack at approximately right angles
            to the center line is a transverse crack.
            They are often regularly spaced. The
            cause is movement due to temperature changes and hardening of the
            asphalt with aging.
            Transverse cracks will initially be
            widely spaced (over 50’). Additional
            cracking will occur with aging until
            they are closely spaced (within several
            feet). These usually begin as hairline or
            very narrow cracks; with aging they
            widen.
        - Reflection cracks:
            Cracks in overlays reflect the crack
            pattern in the pavement underneath.
            They are difficult to prevent and
            correct. Thick overlays or reconstruction
            is usually required.
        - Slippage cracks:
            Crescent or rounded cracks in the
            direction of traffic, caused by slippage
            between an overlay and an underlying
            pavement. Slippage is most likely to
            occur at intersections where traffic is
            stopping and starting.
        - Longitudinal cracks:
            Cracks running in the direction of traffic
            are longitudinal cracks. Center line or
            lane cracks are caused by inadequate
            bonding during construction or reflect
            cracks in underlying pavement. Longitudinal cracks in the wheel path indicate
            fatigue failure from heavy vehicle loads.
            Cracks within one foot of the edge are
            caused by insufficient shoulder support,
            poor drainage, or frost action. Cracks
            usually start as hairline or vary narrow
            and widen and erode with age. Without crack filling, they can ravel,
            develop multiple cracks, and become
            wide enough to require patching.
        - Block cracks:
            Block cracking is interconnected cracks
            forming large blocks. Cracks usually intersect at nearly right angles. Blocks may
            range from one foot to approximately
            10’ or more across. The closer spacing
            indicates more advanced aging caused by
            shrinking and hardening of the asphalt
            over time.

        Patches and potholes
        - Patches:
            Original surface repaired with new
            asphalt patch material. This indicates a
            pavement defect or utility excavation
            which has been repaired. Patches with
            cracking, settlement or distortions
            indicate underlying causes still remain.
        - Potholes:
            Holes and loss of pavement material
            caused by traffic loading, fatigue and
            inadequate strength. Often combined
            with poor drainage.

        With an understanding of surface
        distress, you can evaluate and rate
        asphalt pavement surfaces. The rating
        scale ranges from 10 (excellent)
        condition to 1 (failed) condition.

        Rate the condition of the pavement based on the following scale:

        10 Excellent: New pavement, no distress
        9  Excellent: No distress. Recent overlay. Like new.
        8  Very Good: No longitudinal cracks except reflection of paving joints. Occasional transverse cracks, widely spaced (40’ or greater). All cracks sealed or tight (open less than 1⁄4”).
        7  Good: Very slight or no raveling, surface shows some traffic wear. Longitudinal cracks (open 1⁄4”) due to reflection or paving joints. Transverse cracks (open 1⁄4”) spaced 10’ or more apart, little or slight crack raveling. No patching or very few patches in excellent condition.
        6  Good: Slight raveling (loss of fines) and traffic wear. Longitudinal cracks (open 1⁄4”– 1⁄2”), some spaced less than 10’. First sign of block cracking. Sight to moderate flushing or polishing. Occasional patching in good condition.
        5  Fair: Moderate to severe raveling (loss of fine and coarse aggregate). Longitudinal and transverse cracks (open 1⁄ 2”) show first signs of slight raveling and secondary cracks. First signs of longitudinal cracks near pavement edge. Block cracking up to 50% of surface. Extensive to severe flushing or polishing. Some patching or edge wedging in good condition.
        4  Fair: Severe surface raveling. Multiple longitudinal and transverse cracking with slight raveling. Longitudinal cracking in wheel path. Block cracking (over 50% of surface). Patching in fair condition. Slight rutting or distortions (1⁄2” deep or less).
        3  Poor: Closely spaced longitudinal and transverse cracks often showing raveling and crack erosion. Severe block cracking. Some alligator cracking (less than 25% of surface). Patches in fair to poor condition. Moderate rutting or distortion (1” or 2” deep). Occasional potholes.
        2  Very Poor: Alligator cracking (over 25% of surface). Severe distortions (over 2” deep) Extensive patching in poor condition. Potholes.
        1  Failed: Severe distress with extensive loss of surface integrity.
        0  Not a road (use this as a response if the image is not of a road or pavement)

        Respond with JSON object following the Analysis interface. The interface contains a raiting, a score for each of the surface distress categories, and a reasoning for the rating (a paragraph of text explaining the condition of the pavement based on the distress categories and the rating scale).

        If the image is not of a road or pavement, the analysis should contain "valid_image": false and a reasoning explaining why the image is not valid. The distress categories should be set to "none" and the rating should be 0.

        ${analysisInterface}
`.trim()
