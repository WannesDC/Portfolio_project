export interface Experience extends Readonly<{}> {
    id?: number,
    company?: string,
    jobPos?:string,
    link?: string,
    description?: string,
    startYear?: Date,
    endYear?: Date,
    position?: number,
    portfolioId?: number
}
