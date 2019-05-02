export interface Skill extends Readonly<{
    id?: number,
    type?: string,
    description?: string,
    iconPath?: string,
    position?: number,
    portfolioId?: number
}> {
}
