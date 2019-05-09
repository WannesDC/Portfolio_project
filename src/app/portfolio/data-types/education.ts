export interface Education extends Readonly<{
    id?: number,
    institute?: string,
    description?: string,
    link?: string,
    course?: string,
    startYear?: Date,
    endYear?: Date,
    position?: number,
    portfolioId?: number

}> {
}
