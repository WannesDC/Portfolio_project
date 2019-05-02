export interface Contact extends Readonly<{
    id?: number,
    email?: string,
    name?: string,
    surname?: string,
    street?: string,
    city?: string,
    country?: string,
    postalcode?: number,
    birthdate?: Date,
    portfolioId?: number
}>{}
