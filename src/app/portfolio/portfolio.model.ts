export class Portfolio {

    constructor(private _name: string,
        private _description: string,
        private _picturePath: string,
        private _resumePath: string){
            
        }

        static fromJSON(json: any): Portfolio {
            const por = new Portfolio(
                json.name,
                json.description,
                json.picturePath,
                json.resumePath
            );

            return por;
        }
        
        toJSON(): any{
            return {
                name: this.name,
                description: this.description,
                picturePath: this.picturePath,
                resumePath: this.resumePath  
            };
        }

        get name(): string{
            return this._name;
        }
        get description(): string{
            return this._description;
        }
        get picturePath(): string {
            return this._picturePath;
        }
        get resumePath(): string{
            return this._resumePath;
        }
       


}