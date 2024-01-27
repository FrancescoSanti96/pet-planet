export class Animal {
    constructor(
        public _id: string,
        public owner: string,
        public nome: string,
        public tipoAnimale: string,
        public image: string,
        public razza?: string,
        public sesso?: string,
        
    ) { }
}