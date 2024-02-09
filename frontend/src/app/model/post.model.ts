export interface Comment {
    _id: string;
    utente: string;
    testo: string;
  }
  
  export interface Post {
    _id: string;
    utente: string;
    titolo: string;
    corpo: string;
    profilePic: string;
    commenti: Comment[];
    img: string;
  }