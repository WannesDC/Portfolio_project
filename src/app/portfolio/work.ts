export interface Work extends Readonly<{
    id?: number,
    workName?: string,
    description?: string,
    timePublished?: Date,
    link?: string,
    imagePath?: string,
    position?: number,
    porfolioId?: number
}> {
}
