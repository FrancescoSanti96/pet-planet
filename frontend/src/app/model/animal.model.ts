export class Animal {
    constructor(
        public _id: string,
        public owner: string,
        public nome: string,
        public tipoAnimale: string,
        public image: { data: string; contentType: string },
        public razza?: string,
        public sesso?: string,
        
    ) { }
}